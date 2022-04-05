const mongoose = require("mongoose");
const DB = "mongodb+srv://Abhineet:Abhineet01@cluster0.aoiio.mongodb.net/Assignment?retryWrites=true&w=majority";
mongoose.connect(DB).then(()=>{
    console.log("connected");
}).catch((e)=> console.log(`no conn..............`));