const mongoose = require("mongoose");
// const { stringify } = require("querystring");
const eventSchema = new mongoose.Schema({
    // Category : String,
    Title : String,
    artist : String,
    image : String,
    organiser : String,
    date : String,
    time : String,
    venue : String,
    attendees : [
        {
            user : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "User",
            },
            category : String,
        },
    ],
    tickets : [
        {
            category : String,
            price : Number,
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