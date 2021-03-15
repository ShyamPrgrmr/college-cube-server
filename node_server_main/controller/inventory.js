const product = require('./../model/inventoryproduct');
const productdata = require('./../model/product');
const productprice = require('./../model/productprice');


exports.addproductstoinventory = async (req,res,next)=>{
    let inventoryproducts = req.body.products;
    let length = inventoryproducts.length;
    let data = [];
    
    for(let i=0;i<length;i++){
        try{
            let productid = inventoryproducts[i].productid;
            let quantity  = inventoryproducts[i].quantity;
            let pro = await product.findById(productid);

            if(!pro){
                let response = await product.insertMany({ _id:productid,quantity});
                data.push(response[0]);
            }
            else{
                pro.quantity += parseInt(quantity);
                let response = await pro.save();
                data.push(response);
            }
        }catch(e){
            let err = new Error(e);
            res.status(500).json({msg:err.stack});
            console.log(err.stack);
            return;
        }
    }

    res.status(200).json(data);
}

exports.viewproductdataininventory= async (req,res,next)=>{
    try{
        let page = req.query.page;
        const currentPage = page || 1;
        const perpage = 10;
        let inventoryproducts = await product.find().skip((currentPage-1)*perpage).limit(perpage);
        let response = [];
        let length = inventoryproducts.length;
        
        for(let i=0;i<length;i++){
            let temp={};
            let id = inventoryproducts[i]._id;
            let quantity = inventoryproducts[i].quantity;            
            let productd = await productdata.findById(id);
            let priced = await productprice.findById(id);
            temp.price = priced.price;
            temp.name = productd.name;
            temp.measurement = productd.measurement;
            temp.description = productd.description;
            temp.imgsrc = productd.imgsrc;
            temp.id = id;
            temp.quantity = quantity;
            response.push(temp);
        }

        res.status(200).json(response);

    }catch(e){
        let err = new Error(e); res.status(500).json({err:err.stack});
    }
    
    res.status(200).json([]);
}