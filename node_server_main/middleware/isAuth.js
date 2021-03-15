const jwt = require('jsonwebtoken');
const admin = require('./../model/adminlogin');
const bcrypt = require("bcryptjs");
const decrypt = require('./../controller/crypt').decrypt;

exports.isAuthenticate =  (req,res,next) =>{
    try{
        let token = req.body.token;
        let t = decrypt(token);
        let test = jwt.verify(t,"Secret");
        req.userid = test.userid;
        if(!test){
            res.status(401).json({token,msg:"Opearation are not authenticated."});
            return;
        }else{
            next();
        }
    }
    catch(e){
        let err = new Error(e);
        res.status(500).json({token,msg:err.message});
    }   
}

exports.isAuthenticateGet = (req,res,next) =>{
    try{
        let token = req.query.token;
        let t = decrypt(token);
        let test = jwt.verify(t,"Secret");
        req.userid = test.userid;
        if(!test){
            res.status(401).json({token,msg:"Opearation are not authenticated."});
            return;
        }else{
            next();
        }
    }
    catch(e){
        let err = new Error(e);
        
        res.status(500).json({token,msg:err.message});
    }   
};

exports.isadmin = (req,res,next) =>{
    let userid = req.userid;
    admin.findById(userid).then(data=>{
        if(!data) {res.status(403).json({err:"Not Authorized"});return;}
        else{
            next();
        }
    });
}

exports.isSameUser=(req,res,next)=>{
    let userid = req.userid;
    let check = req.body.id;
    if(userid == check){
        next();
    }else{
        res.status(403).json("Not Authorized!");
        return;
    }
}