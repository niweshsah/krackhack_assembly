const mongoose = require("mongoose");
// const { stringify } = require("querystring");
const eventSchema = new mongoose.Schema({
    // Category : String,
    Title : String,
    image : {
        public_id : String,
        url : String
    },
    organiser : 
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    Date_and_Time : 
    {
        date : String,
        time : String
    },
    attendees : [
        {
            user : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "User",
            },
            category : Number,
        },
    ],
    tickets : [
        {
            category : Number,
            price : String,
            desc : String,
            seats_available : Number
        }
    ],
    reviews : [
        {
            review : String,
            user : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "User",
            },
        }
    ],

    isFinish : Boolean
});
module.exports = mongoose.model("Event",eventSchema);