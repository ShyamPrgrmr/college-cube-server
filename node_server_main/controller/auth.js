const jwt = require("jsonwebtoken");
const Admin = require("./../model/adminlogin");
const User = require("./../model/usersignup");
const Userdata = require("./../model/userdata");
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

exports.signupuser= async (req,res,next)=>{
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


