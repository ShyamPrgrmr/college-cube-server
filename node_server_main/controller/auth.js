const jwt = require("jsonwebtoken");
const Admin = require("./../model/adminlogin");
const User = require("./../model/usersignup");
const Userdata = require("./../model/userdata");
const bcrypt = require('bcryptjs');
const encrypt = require('./crypt').encrypt;
const otp = require('./../model/otp');
const { Mailer } = require("./mailer");


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

exports.signupuser= async (req,res,next)=>{

    let token = req.body.checktoken;
    let temp = await otp.findById(token);

    if(!temp){
        res.status(200).json({msq:"Already signed up"});
        return;
    }
    
    if(temp.confirm){
        await otp.findByIdAndDelete(token);

        let email = req.body.email;
        let password = req.body.password;
        let firstname = req.body.fname;
        let lastname = req.body.lname;
        let bdate = req.body.bdate;
        let phone = req.body.phone;
        let gender = req.body.gender;
        let address = req.body.address;

        let user = await User.findOne({email});

        if(user){
            next({msg:"Already Added",code:409})
        } else{

            let saveUser = await User.insertMany([{email,password}]);

            let id = saveUser[0]._id;

            let userdata = await Userdata.insertMany([{
                _id:id,
                name:{
                    firstname:firstname,
                    lastname:lastname
                },
                mobile:{
                    mob_1:phone,
                    mob_2:""
                },
                address:{
                    route:address,
                    pincode:444602       
                },
                bdate:bdate,
                gender:gender
            }]);

            res.status(200).json({userdata});

        }   
    }
    else{
        res.status(403).json({msg:"OTP is not confirmed yet!"});
    }
 
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
            
            Userdata.findById(userid).then( udata=>{
                if(!udata) next({msg:"User not found",code:404})
                else{

                    res.status(200).json({token:enctoken,udata});
                
                }
            }
            )
        }
        
    }).catch(err=>{
        console.log(err)
        next({msg:err,code:500});
    });
}

exports.setOTP=async(req,res,next)=>{
    let token = req.body.token;
    let OTP = new String((Math.random()*1000000)).substring(0,4);
    let email = req.body.email; 
    let data = await otp.insertMany({_id:token,number:OTP,confirm:false});
    if(data.length!==0) {
        await Mailer({email},{
            subject:"OTP for new account opening",
            text:"Hello",
            html:`
                <p>
                    <b>Hello from Grocery Shop</b>
                    <p>Your One Time Password is,
                        <h1><b><pre>${OTP}</pre></b></h1>
                    </p>
                    <p>
                        <small>Please dont share your otp.</small>
                    </p>
                </p>
            ` 
        });
        res.status(200).json({msg:"OTP SEND"});
    }
}

exports.checkOTP=async(req,res,next)=>{
    let OTP = req.body.otp;
    let token = req.body.token;
    let data = await otp.findById(token);
    let otp_data = data.number;
    if(otp_data !== OTP) res.status(404).json({msg:"not found!"});
    else {
        data.confirm = true;
        await data.save();
        res.status(200).json({msg:"Matched"});
    }
}

exports.forgotpassword=async (req,res,next)=>{
    try{

        let email = req.body.email;
        let user = await User.findOne({email});
        let id = user._id;
        let data = await Userdata.findById(id);
        let name = data.name.firstname+" "+data.name.lastname;
    
        if(user){
            let pass = new String(parseInt(Math.random()*10000000));
            await Mailer({email},{subject:"New Password",text:"",html:`<p><h1>Hello, ${name}</h1></p><p>This is your new password<p><b>${pass}</b></p>`});
            user.password = pass;
            await user.save();
            res.status(200).json({msg:"email send."})
        }else{
            res.status(404).json({msg:"User not found!"});
        }
    
    }catch(e){
        let err = new Error(e);
        next({code:500,msg:"Server Error : "+err.stack});
    }
} 


exports.changepassword=async (req,res,next)=>{
    try{
    let id = req.userid;
    let newpassword = req.body.password;
    let user = await User.findById(id);
    user.password = newpassword;
    await user.save();
    res.status(200).json({msg:"password reset!"});
    }catch(e){
        res.status(500).json({msg:e});
    }
}
