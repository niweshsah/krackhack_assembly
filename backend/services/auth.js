const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  walletAddress: user.walletAddress,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const hashRefreshToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const createAccessToken = (user) =>
  jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL }
  );

const createRefreshToken = async (userId) => {
  const token = crypto.randomBytes(48).toString("hex");
  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashRefreshToken(token),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });
  return token;
};

const issueTokens = async (user) => ({
  accessToken: createAccessToken(user),
  refreshToken: await createRefreshToken(user.id),
});

const register = async ({ name, email, password, walletAddress }) => {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, walletAddress },
  });
  return { user: publicUser(user), ...(await issueTokens(user)) };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }
  return { user: publicUser(user), ...(await issueTokens(user)) };
};

const refresh = async (token) => {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashRefreshToken(token) },
    include: { user: true },
  });
  if (!storedToken || storedToken.revokedAt || storedToken.expiresAt <= new Date()) {
    const error = new Error("Invalid or expired refresh token");
    error.statusCode = 401;
    throw error;
  }

  const replacementToken = crypto.randomBytes(48).toString("hex");
  const replacementHash = hashRefreshToken(replacementToken);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    }),
    prisma.refreshToken.create({
      data: {
        userId: storedToken.userId,
        tokenHash: replacementHash,
        expiresAt,
      },
    }),
  ]);

  return {
    accessToken: createAccessToken(storedToken.user),
    refreshToken: replacementToken,
  };
};

const revokeRefreshToken = async (token) => {
  if (!token) return;
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashRefreshToken(token), revokedAt: null },
    data: { revokedAt: new Date() },
  });
};

module.exports = {
  login,
  register,
  refresh,
  revokeRefreshToken,
  publicUser,
};