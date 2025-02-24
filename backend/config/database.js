const mongoose = require("mongoose")
exports.connectDatabase = ()=>{
    mongoose
    .connect('mongodb+srv://MananPapneja:Manan12345@ticketchain.85iad.mongodb.net/?retryWrites=true&w=majority&appName=TicketChain')
    .then((con)=> console.log(`Database Connected : ${con.connection.host}`))
    .catch((err) => console.log(err));
};