const express = require("express");
const { createServer } = require("http");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const user = require("./routes/user");
app.use("/api/v1", user);

if (require.main === module) {
    const server = createServer(app);
    const port = Number(process.env.PORT || 5000);
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

module.exports = { app };
