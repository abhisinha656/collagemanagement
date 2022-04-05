const mongoose= require("mongoose");
const res = require("express/lib/response");

const assign = new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    time:{
        type:Date,
        default:Date.now
    }
})

const assi = new mongoose.model("assignment", assign);
module.exports = assi;