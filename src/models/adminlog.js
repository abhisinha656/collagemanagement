const mongoose= require("mongoose");

const jwt = require("jsonwebtoken");
const res = require("express/lib/response");

const logadmin = new mongoose.Schema({
    code:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

// jwt token
logadmin.methods.generateAuthToken = async function(){
    // console.log('Aman');
    try{
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        // console.log(token);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch(e){
        res.send(e);
        console.log(e);
    }
}

const log = new mongoose.model("admin", logadmin);
module.exports = log;