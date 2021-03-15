const Products = require('./../model/product');
const productprice = require('./../model/productprice');

exports.getproduct=async(req,res,next)=>{
    let page = req.query.page;
    const currentPage = page || 1;
    const perpage = 10;
    try {     
        
        let product = await Products.find().skip((currentPage-1)*perpage).limit(perpage);
        let totalitem = product.length;
        res.status(200).json({product:product,item:totalitem});
    } catch (error) {
        err = new Error(error);
        next({msg:err.message,code:500});
    }
}

exports.getAllproduct=async(req,res,next)=>{

    try {     
        
        let product = await Products.find();
        let totalitem = product.length;
        res.status(200).json({product:product,item:totalitem});
    } catch (error) {
        err = new Error(error);
        next({msg:err.message,code:500});
    }
}

exports.getproductprice=async(req,res,next)=>{
    let id = req.query.id;
    try{    
        let product = await productprice.findById(id);
        let price  = product.price;
        res.status(200).json({price:price});
    }catch(error){
        let err = new Error(error);
        next({msg:err.message,code:500});
    }
}

