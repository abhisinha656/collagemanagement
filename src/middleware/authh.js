const jwt = require("jsonwebtoken");
const Register = require("../models/sdata");

const auth = async (req, res, next) =>{
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, "amamamamamamamamamamamamamamamamamamamamam");
        console.log(verifyUser);
        const user = await Register.findOne({_id:verifyUser._id})
        // console.log(user.code);
        req.token = token;
        req.user = user;
        next();
    } catch (err){
        console.log("Session Expire");
        return res.redirect('/');
        res.status(401).send(err);
    }
}

module.exports = auth;