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


exports.getProductsByFilter= async (req,res,next) =>{
    let filter = req.query.filter;
    let page = req.query.page;
    let resp = [];
    try{
        
    const currentPage = page || 1;
    const perpage = 12;
      
    let product = await Products.find({category:filter}).skip((currentPage-1)*perpage).limit(perpage);
    let totalitem = product.length;

    for(let i=0;i<totalitem;i++){
        let id = product[i]._id;
        let name = product[i].name;
        let description = product[i].description;
        let measurement = product[i].measurement;
        let manufacturer = product[i].manufacturer;
        let category = product[i].category;
        let images = product[i].imgsrc;
        let imgsrc = product[i].imgsrc[0];
        let data = await productprice.findById(id);
        let price = data.price;
        resp.push(
            {
                name,
                id,
                measurement,
                manufacturer,
                description,
                category,
                price,
                imgsrc,
                images
            }
        );
    }

    res.status(200).json({product:resp,item:totalitem});

    }catch(e){
        let err = new Error(e).stack;
        next({msg:err,code:500});
    }
}