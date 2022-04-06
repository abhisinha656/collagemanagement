const mongoose= require("mongoose");
const res = require("express/lib/response");
const jwt = require("jsonwebtoken");

const sdata = new mongoose.Schema({
    regno:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    dob:{
        type:String,
        required:true
    },
    propic:{
        type:String
    },
    email:{
        type:String,
        default: 'N/A'
    },
    gen:{
        type:String,
        default: 'N/A'
    },
    password:{
        type:String,
        default: 'N/A'
    },
    about:{
        type:String,
        default: 'N/A'
    },
    phone:{
        type:String,
        default: 'N/A'
    },
    linkedin:{
        type:String,
        default: 'N/A'
    },
    cpweb:{
        type:String,
        default: 'N/A'
    },
    address:{
        type:String,
        default: 'N/A'
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

// jwt token
sdata.methods.generateAuthToken = async function(){
    // console.log('Aman');
    try{
        // console.log(this._id);
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

const data = new mongoose.model("Student", sdata);
module.exports = data;