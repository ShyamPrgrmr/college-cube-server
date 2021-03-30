const userdata = require("./../model/userdata");
const usersignup = require("./../model/usersignup");

exports.setuserdata = async (req,res,next) =>{
    let name = req.body.name;
    let mobile = req.body.mobile;
    let address = req.body.address;
    let _id = req.userid;
    try{
        let tempuser = await usersignup.findById(_id);
        if(!tempuser) {
            let err = new Error("User not found!");
            next({msg:err.message,code:404});
        }else{
            let user = await userdata.insertMany({
                _id,
                mobile,
                address,
                name
            });
            res.status(200).json(user[0]);
        }    
    }catch(error){
        let err = new Error(error);
        next({msg:err.message,code:500});
    }
}

exports.updateuserdata = async (req,res,next)=>{
    let _id = req.userid;
    let name = req.body.name;
    let address = req.body.address;
    let mobile = req.body.mobile;
    
    try{
        let user = await usersignup.findById(_id);
        if(!user){
            let err = new Error("User not found!");
            next({msg:err.message,code:404});
        }else{
            let data = await userdata.findById(_id);
            data.address=address;
            data.name=name;
            data.mobile= mobile;
            let temp = await data.save();
            res.status(200).json(data);
        }

    }catch(error){
        let err = new Error(error);
        next({msg:err.message,code:500});
    }
    
}

exports.getuserdata = async (req,res,next)=>{
    let _id = req.userid;
    try{
        let user = await userdata.findById(_id);
        let d = await usersignup.findById(_id);

        if(!user || !d){
            let err = new Error("User not found!");
            next({msg:err.message,code:404});
        }else{
            res.status(200).json({user,email : d.email});
        }

    }catch(error){
        let err = new Error(error);
        next({msg:err.message,code:500});
    }
    
}

exports.setuseravtar = async (req,res,next)=>{
   let filepath = req.file.path;
   let path = new String(filepath).replace(/\\/g,"/");
   let _id = req.userid;
   try{
        let user = await usersignup.findById(_id);
        if(!user){
            let err = new Error("User not found!");
            next({msg:err.message,code:404});
        }else{
            let data = await userdata.findById(_id);
            data.avatar = filepath;
            let temp = await data.save();
            res.status(200).json(data);
        }

    }catch(error){
        let err = new Error(error);
        next({msg:err.message,code:500});
    }
}
