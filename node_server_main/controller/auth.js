const jwt = require("jsonwebtoken");
const Admin = require("./../model/adminlogin");
const User = require("./../model/usersignup");
const bcrypt = require('bcryptjs');
const encrypt = require('./crypt').encrypt;


exports.adminlogin = (req,res,next) =>{
    let email = req.body.email;
    let password = req.body.password;
    Admin.findOne({email:email,password:password}).then(data=>{
        if(!data) next({msg:"User not found",code:404})
        else{
            let userid = data._id.toString();
            let token = jwt.sign({email,userid},"Secret",{expiresIn:'1h'});
            let enctoken = encrypt(token);
            res.status(200).json({token:enctoken});
        }
    }).catch(err=>{
        next({msg:err,code:500});
    });
}

exports.signupuser=(req,res,next)=>{
    let email = req.body.email;
    let password = req.body.password;
    User.insertMany([{email,password}]).then(data=>{
        res.status(200).json({data});
    }).catch(err => {
        next({msg:err,code:500})
    });
}

exports.userlogin = (req,res,next) =>{
    let email = req.body.email;
    let password = req.body.password;
    User.findOne({email:email,password:password}).then(data=>{
        if(!data) next({msg:"User not found",code:404})
        else{
            let userid = data._id.toString();
            let token = jwt.sign({email,userid},"Secret",{expiresIn:'1h'});
            let enctoken = encrypt(token);
            res.status(200).json({token:enctoken});
        }
        
    }).catch(err=>{
        console.log(err)
        next({msg:err,code:500});
    });
}


