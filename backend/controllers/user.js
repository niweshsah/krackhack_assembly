const prisma = require("../config/prisma");
const { login: loginWithPostgres, register: registerWithPostgres, refresh: refreshTokens, revokeRefreshToken } = require("../services/auth");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.register = async (req, res) => {
  try {
    const { name, email, password, walletId } = req.body;
    const result = await registerWithPostgres({ name, email, password, walletAddress: walletId });
    return res.status(201).json({ success: true, ...result });
  } catch (error) {
    const statusCode = error.code === "P2002" ? 409 : 500;
    res.status(statusCode).json({
      success: false,
      message: statusCode === 409 ? "User already exists" : error.message
    })
  }
}
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginWithPostgres({ email, password });
    res.status(200).json({ success: true, message: "Logged in successfully", ...result });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    })
  }
}
exports.refresh = async (req, res) => {
  try {
    const result = await refreshTokens(req.body.refreshToken);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};
exports.logout = async (req, res) => {
  try {
    await revokeRefreshToken(req.body?.refreshToken);
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({
        success: true,
        message: "Logged Out"
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
exports.myProfile = async (req, res) => {
  try {
    const email = req.body.email || req.user?.email;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const name = req.query.name;
    const users = await prisma.user.findMany({
      where: name ? { name: { contains: String(name), mode: "insensitive" } } : undefined,
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};