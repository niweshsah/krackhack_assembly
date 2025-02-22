const User = require("../models/User");
const jwt = require("jsonwebtoken");
exports.isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({
            message: "Please Login First",
        });
    }
    const decoded = await jwt.verify(token, 'mananmananmanan')
    req.user = await User.findById(decoded._id); 
    // console.log(req.user);
    next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};