const { find } = require("./../model/order");
const order = require("./../model/order");
const product = require("./../model/productprice");
const products = require("./../model/product");

exports.addorder=async(req,res,next)=>{
    let userid = req.userid;
    let productlist =  req.body.products;
    let totalprice = 0;
    try{
        let products = [];
        let total = productlist.length;
        
        for(let i=0;i<total;i++){
            let data = productlist[i];
            let productid = data.productid;
            let quantity = data.quantity;
            let temp = await product.findById(productid);
            let price = temp.price * quantity;
            totalprice += price;
            
            products.push({
                productid:productid,
                quantity:quantity,
                price:price
            });
        }
        
        let finalorder = await order.insertMany({
            userid,
            products,
            totalprice,
            status:-1
        });
        
        res.status(200).json(finalorder);
    
    }catch(e){
        let err = new Error(e);
        next({code:500,msg:err.message});       
    }
}

exports.getorders=async (req,res,next)=>{
    let userid = req.userid;
    try{
        let allorders = await order.find({userid});
        res.status(200).json(allorders);
        return;
    }catch(e){
        let err = new Error(e);
        console.log(e);
        next({msg:err.message,code:500}); 
    }
}

exports.getorderdata=async (req,res,next)=>{
    let orderid = req.body.orderid;

    try{
        let allorders = await order.findById(orderid);
        let response = [];
        let productdata = allorders.products;
        
        for(let i=0;i<productdata.length;i++){
            let temp = productdata[i];
            let data = await products.findById(temp.productid);
            let pricepermeasurement = await product.findById(temp.productid);
            console.log(pricepermeasurement)
            let pdata = {};
            pdata.name = data.name;
            pdata.measurement = data.measurement;
            pdata.description = data.description;
            pdata.productid = data._id;
            pdata.quantity = temp.quantity;
            pdata.price = temp.price;
            pdata.pricepermeasurement = pricepermeasurement.price;
            pdata.imgsrc = data.imgsrc;
            response.push(pdata);
        }

        res.status(200).json(response);

        return;
    }catch(e){
        let err = new Error(e);
        console.log(e);
        next({msg:err.message,code:500}); 
    }
}

//frontend after this redirect page to order page
//think about updating the orders. this is not efficient.
//most probably this is not helpful

exports.updateproduct=async (req,res,next)=>{
    let orderid = req.body.orderid;
    await order.findByIdAndDelete(orderid);
    
    let userid = req.userid;
    let productlist =  req.body.products;
    let totalprice = 0;
    try{
        let products = [];
        let total = productlist.length;
        
        for(let i=0;i<total;i++){
            let data = productlist[i];
            let productid = data.productid;
            let quantity = data.quantity;
            let temp = await product.findById(productid);
            let price = temp.price * quantity;
            totalprice += price;
            
            products.push({
                productid:productid,
                quantity:quantity,
                price:price
            });
        }
        
        let finalorder = await order.insertMany({
            userid,
            products,
            totalprice
        });
        
        res.status(200).json(finalorder);
    
    }catch(e){
        let err = new Error(e);
        next({code:500,msg:err.message});       
    }
}



exports.deleteorder = async (req,res,next) => {
    let productid = req.body.orderid;
    try{
        await order.findByIdAndDelete(productid);
        res.status(200).json({msg:"deleted"});
    }catch(err){
        let error = new Error(err);
        next({msg:error.message,code:500});
    }
}