const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");  // Use require instead of import
const app = express();
const cookieParser = require("cookie-parser");
app.use(express.json({ limit: '10mb' }));  // Example to increase limit to 10 MB
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// if (process.env.NODE_ENV !== "production") {
//     require("dotenv").config({ path: "backend/config/config.env" });
// }
require("dotenv").config({ path: "/config/config.env" });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// const event = require("./routes/event");
const user = require("./routes/user");
// app.use("/api/v1", event);
app.use("/api/v1", user);
const server = createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"],
//         credentials: true,
//     },
// });
// app.use(cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//     credentials: true,
// }));
// Start server
const port = 5000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
