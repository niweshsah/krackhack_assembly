const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
    },
    walletId : String,
    balance : Number,
    avatar: {
        public_id: String,
        url: String
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Id"],
        unique: [true, "ID already exists"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        // minLength: [6, "Password must be atleast 6 characters"],
        select: false
    },
    // Total_Points : Number,
    events_attended : [
        {
            event : {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event"
            },
            category : String,
        },
    ],
    events_organised : [
        {
        event : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event"
        }
    }
    ]
});
userSchema.pre("save",async function (next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
}); // Whenever the Schema is saved (Whether new or refreshed) hash the password
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password,this.password);

 };
 userSchema.methods.generateToken = function () {
    return jwt.sign({_id : this._id},'mananmananmanan')
 }
module.exports = mongoose.model("User",userSchema);