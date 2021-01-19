const merchant = require('./../model/merchant');


exports.addmerchant = async (req,res,next)=>{
    let name = req.body.name;
    let tradersid = req.body.tradersid;
    let address = req.body.address;
    let email = req.body.email;
    let mobile = req.body.mobile;

    try{
        let m = await merchant.insertMany({name,tradersid,address,email,mobile});
        res.status(200).json(m);
    }catch(e){
        let err = new Error(e);
        next({msg:err.message,code:500});
    }
};

exports.deletemerchant= async (req,res,next) =>{
    let id = req.body.id;
    try{
        await merchant.findByIdAndRemove(id);
        res.status(200).json({msg:"deleted"});
    }catch(e){
        let err = new Error(e);
        next({msg:err.message,code:500});
    }
}

exports.updatemerchant = async (req,res,next) =>{
    let id = req.body.id;
    try{
        let mer = await merchant.findById(id);
        let updated = await mer.save({
            name:req.body.name,
            email:req.body.email,
            address:req.body.address,
            tradersid:req.body.tradersid,
            mobile:req.body.mobile
        });
        res.status(200).json(updated);

    }catch(e){
        let err = new Error(e);
        next({msg:err.message,code:500});
    }
}

exports.getmerchants = (req,res,next)=>{
    try{
        let merchants = merchant.find();
        res.status(200).json(merchants);
    }catch(e){
        next({msg : new Error(e).message , code:500});
    }
}