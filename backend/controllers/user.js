const User = require("../models/User")
const Event = require("../models/Event");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: 'dvqfxjfia', // Replace with your actual Cloudinary cloud name
  api_key: '452653768355675', // Replace with your actual Cloudinary API key
  api_secret: 'W45YS0MwZnIvwPdOo5LdS5fRZ3s', // Replace with your actual Cloudinary API secret
});
exports.register = async (req, res) => {
    try {
        const { name , email , password} = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res
                .status(400)
                .json({ success: false, message: "User already exists" });
        }
        user = await User.create({
            name,
            email,
            password
        })
        const token = await user.generateToken();
        res.status(200).cookie("token", token, { expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), httpOnly: true }).json({
            success: true,
            user,
            token,
        });
      //   res.status(200).json({
      //     success: true,
      //     user
      //     // token,
      // });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        // Select + password is compulsory because if we do not write it we will not be able to access this.password while matching password
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Password"
            });
        }
        const token = await user.generateToken();
        res.status(200).cookie("token", token, { expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), httpOnly: true }).json({
            success: true,
            user,
            
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
exports.logout = async (req, res) => {
    try {
        // const user = await User.findById(req.user._id);
        // await user.deleteOne();
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
      const user = await User.findById(req.user._id);
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
      const query = req.query.name ? { name: { $regex: req.query.name, $options: "i" } } : {};
  
      const users = await User.find(query);
  
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
  exports.getMyDebates = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const debates = user.debates_organised
      res.status(200).json({
        success: true,
        debates
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };