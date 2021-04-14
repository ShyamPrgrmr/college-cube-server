const { find } = require("./../model/order");
const order = require("./../model/order");
const product = require("./../model/productprice");
const products = require("./../model/product");
const productpricevar = require("./../model/productprice");
const filters = require("./../model/filters");
const review = require("./../model/review");
const productreview = require("./../model/productreview");
const user = require("./../model/userdata");


exports.getproductbyfilter=async(req,res,next)=>{
    let filter = req.query.filter;
    let response = [];

    let page = req.query.page;
    const currentPage = page || 1;
    const perpage = 10;

    if(filter === "All"){
        let var_products = await products.find().skip((currentPage-1)*perpage).limit(perpage);
        
        for(let i=0;i<var_products.length;i++){
            let pr = await productpricevar.findById(var_products[i]._id);
            
            let anything = await productreview.findById(var_products[i]._id);
            let review_v = 0;
            let count = 0;
            if(!anything) review_v = 0;
            else{ review_v = anything.final; count=anything.count; }

            let price = pr.price;
            let name = var_products[i].name;
            let description = var_products[i].description;
            let measurement = var_products[i].measurement;
            let manufacturer =  var_products[i].manufacturer;
            let category = var_products[i].category;
            let id = var_products[i]._id;
            let imgsrc = var_products[i].imgsrc[0];
            let images = var_products[i].imgsrc;

            response.push({
                price,name,description,manufacturer,measurement,category,id,imgsrc,images,review : { rating:review_v,count }
            });
        }
    }else{

        let var_products = await products.find({category:filter}).skip((currentPage-1)*perpage).limit(perpage);
        
        for(let i=0;i<var_products.length;i++){
            let pr = await productpricevar.findById(var_products[i]._id);
            let price = pr.price;


            let anything = await productreview.findById(var_products[i]._id);
            let review_v = 0;
            let count = 0;
            if(!anything) review_v = 0;
            else { review_v = anything.final; count=anything.count; }
            
            
            let name = var_products[i].name;
            let description = var_products[i].description;
            let measurement = var_products[i].measurement;
            let manufacturer =  var_products[i].manufacturer;
            let category = var_products[i].category;
            let id = var_products[i]._id;
            let imgsrc = var_products[i].imgsrc[0];
            let images = var_products[i].imgsrc;
            response.push({
                price,name,description,manufacturer,measurement,category,id,imgsrc,images,review : { rating:review_v,count }
            });
        }

    }

    res.status(200).json({products:response});
}

exports.addorder=async(req,res,next)=>{
    let userid = req.userid;
    let productlist =  req.body.products;
    let ordertype = req.body.ordertype;
    let totalprice = 0;
    
    let now = new Date();
    let date = now.getDate()+"/"+(now.getMonth()+1)+"/"+now.getFullYear();
        
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
            status:-1,
            ordertype,
            date
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

exports.getfilters=async(req,res,next)=>{
    try{    
       let fil = await  filters.find();
       let response = fil.map(f=>{ return f.name; });
       res.status(200).json({filters:response}); 
    }catch(e){
        let err = new Error(e);
        next({code:500,msg:err.message});
    }
}

exports.getNameAndCategory=async(req,res,next)=>{
    try{    
        let id = req.query.id;
        let product_v = await products.findById(id);
        let product_price_v = await productpricevar.findById(id);

        let anything = await productreview.findById(id);
        let review_v = 0;
        let count = 0;
        if(!anything) review_v = 0;
        else { review_v = anything.final; count=anything.count; }


        res.status(200).json(
        {
            product : {
                price:product_price_v.price,
                name:product_v.name,
                description:product_v.description,
                manufacturer:product_v.manufacturer,
                measurement:product_v.measurement,
                category:product_v.category,
                id:id,
                imgsrc:product_v.imgsrc[0],
                images:product_v.imgsrc,
                review : { rating:review_v,count }
            }
        });
        
     }catch(e){
         let err = new Error(e);
         next({code:500,msg:err.message});
     }
}

exports.addreview=async (req,res,next)=>{
    try{
        let userid = req.userid;
        let productid = req.body.productid;
        let review_c = req.body.review;
        let reviewText = req.body.reviewtext;

        let data = await review.findOne({ productid,userid });
        let res_v;
        let id;
        if(!data){
            res_v = await review.insertMany([{productid,userid,review:review_c,reviewText}]);
            id = res_v[0]._id;
        }else{
            data.review = review_c;
            res_v = await data.update();
            id = data._id;
        }

        let p_review = await productreview.findById(productid);
        let p; 
        
        let arrrev = [];
        let revid=[];
        
        if(!p_review){
            arrrev.push(review_c);
            revid.push(id);

            p = await productreview.insertMany([{
                _id:productid,
                totalreview: arrrev,
                count:1,
                final:review_c,
                userreviews:revid
            }]);
        }else{
            p_review.count = p_review.count + 1;
            let arrrev = p_review.totalreview;
            arrrev.push(review_c);
            p_review.totalreview = arrrev;

            revid = p_review.userreviews;
            revid.push(id);
            p_review.userreviews = revid;


            let co = {r1:0,r15:0,r2:0,r25:0,r3:0,r35:0,r4:0,r45:0,r5:0}

            arrrev.forEach(element => {
                if (element === 1) co.r1 = co.r1+1;
                else if (element === 1.5) co.r15 = co.r15+1;
                
                else if (element === 2) co.r2 = co.r2+1; 
                else if (element === 2.5) co.r25 = co.r25+1;
                
                else if (element === 3) co.r3 = co.r3+1; 
                else if (element === 3.5) co.r35 = co.r35+1;
                
                else if (element === 4) co.r4 = co.r4+1; 
                else if (element === 4.5) co.r45 = co.r45+1;

                else if(element === 5) co.r5 = co.r5 +1;
            });

            let cal_1 = (co.r1 * 1) + (co.r15 * 1.5) + (co.r2 * 2) + (co.r25 * 2.5) + (co.r3 * 3) + (co.r35 * 3.5) + (co.r4 * 4)  + (co.r45 * 4.5) + (co.r5 * 5); 
            let cal_2 = arrrev.length;

            let cal = cal_1/cal_2;

            p_review.final = cal;

            p = await p_review.save();
        }
        


        res.status(200).json({review : res_v});
    }catch(e){
        let err = new Error(e);
        next({code:500,msg:err.stack});
    }
}

exports.getproductreview=async(req,res,next)=>{
    try{
        let id = req.query.id;
        let product_r = await productreview.findById(id);
        let res_v = [];
        if(product_r){
            let userreviews = product_r.userreviews;
            let reviewset = new Set();
            let br = 5;

            for(let usr of userreviews){
                if(br==0){
                    break;
                }
                br--;
                reviewset.add(usr);            
            }

            for(let rev of reviewset){
                let temp = await review.findById(rev);
                let userid = temp.userid;
                let reviewText = temp.reviewText;
                let review_v = temp.review;
                let date = new String(temp.createdAt).substring(0,new String(temp.createdAt).indexOf("T"));
                let u = await user.findById(userid);
                let name = u.name.firstname + " "+ u.name.lastname;
                res_v.push({
                    userid,
                    name,
                    reviewText,
                    review_v,
                    date
                });
            }

        }
        
        res.status(200).json({data : res_v});

    }catch(e){
        let err = new Error(e);
        next({code:500,msg:err.stack});
    }
}