const Products = require('./../model/product');

exports.getproduct=async(req,res,next)=>{
    let page = req.query.page;
    const currentPage = page || 1;
    const perpage = 10;
    try {     
        let totalitem = await Products.find().countDocuments();
        let product = await Products.find().skip((currentPage-1)*perpage).limit(perpage);
        res.status(200).json({product:product,item:totalitem});
    } catch (error) {
        err = new Error(error);
        next({msg:err.message,code:500});
    }
}

