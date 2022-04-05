const mongoose= require("mongoose");
const res = require("express/lib/response");

const notify = new mongoose.Schema({
    notifying:{
        type:String,
        required:true
    },
    time:{
        type: Date,
        default: Date.now
    }
})

const not = new mongoose.model("notification", notify);
module.exports = not;