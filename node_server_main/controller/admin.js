const { json } = require("express");
const Product = require("./../model/product");
const mongo = require("mongodb");
const fs = require('fs');
const path = require('path');
const productprice = require("../model/productprice");
const orders = require("../model/order");
const userdata = require("../model/userdata");
const order = require("../model/order");
const product = require("./../model/product");
const filters  = require("./../model/filters");
const inventory = require("./../model/inventoryproduct");
const itemsold = require("./../model/itemsold");
const { findById } = require("../model/order");


exports.addproduct = (req,res,next) =>{
    let data = req.body;
    let name = data.name;
    let description = data.description;
    let measurement = data.measurement;
    let manufacturer = data.manufacturer;
    let files = data.images;
    let category = data.category;
    let keywords = data.keywords;

    Product.insertMany([{
        name,
        description,
        measurement,
        imgsrc: files,
        manufacturer,
        category
    }]).then(product=>{ 
        
        let id = product[0]._id;
        
        
        productprice.insertMany([{
            _id:id,
            price:0
        }]).then(p=>{
            product.price = p.price;
        }).catch(e=>{
            let err = new Error(e);
            next({msg:err.message,code:500});
        });

        inventory.insertMany({
            _id:id,
            quantity:0
        }).then(p=>{

            product.inventoryQuantity = p.quantity;
            res.status(200).json(product);

        }).catch(e=>{
            let err = new Error(e);
            next({msg:err.message,code:500});
        });



    }).catch(e=>{
        let err = new Error(e);
        next({msg:err.message,code:500});
    })

}

exports.updateproduct=async(req,res,next)=>{
    let name = req.body.name;
    let measurement = req.body.measurement;
    let description = req.body.description;
    let manufacturer = req.body.manufacturer;
    let category = req.body.category;
    let id = req.body.id;
    let product = await Product.findById(id);
    if(!product) {res.status(404).json({msg:"Product not found"});return;}
    else {
        product.name = name;
        product.measurement=measurement;
        product.description=description;
        product.manufacturer=manufacturer;
        product.category = category;
        let updatedproduct = await product.save();
        res.status(200).json({updatedproduct});
    }
};

exports.deleteproduct=async(req,res,next)=>{
    let id = req.query.id;
    let product = await Product.findById(id);
    let imgsrc = product.imgsrc;
    imgsrc.forEach(p => {
        let filepath = path.join(__dirname,'..',p);
        fs.unlink(filepath,err=>{ console.log(err) });
    });
    await Product.findByIdAndDelete(id);
    await productprice.findByIdAndDelete(id);
    res.status(200).json({msg:"deleted"});
}

exports.updateproductprice=async(req,res,next)=>{
    const id = req.body.id;
    const price = req.body.price;
    try{
        let product = await productprice.findById(id);
        product.price = price;
        let updated = await product.save(); 
        res.status(200).json(updated);
    }catch(e){
        err = new Error(e);
        next({code:404,msg:e});
    }
}

exports.testing=async(req,res,next)=>{
    try{
        
        
       // res.status(200).json(product);
    }catch(e){
        let err = new Error(e);
    }
}

exports.getAllOrders=async(req,res,next)=>{
    try{

        
        let now = new Date();
        let date = now.getDate()+"/"+(now.getMonth()+1)+"/"+now.getFullYear();
        const orderdata = await order.find({date:date});
        let response = [];
        let length = orderdata.length;

        for(let i = 0;i < length;i++){
            let temp = {};
            const {userid,products,totalprice,createdAt,_id,status,ordertype} = orderdata[i];
            const {name,mobile,address} = await userdata.findById(userid);
            
            temp.userid = userid;
            temp.username = name;
            temp.usermobile = mobile;
            temp.useraddress = address;
            //temp.products = products;
            let data = [];
            
            for(let i=0;i<products.length;i++){
                const a = await product.find({_id:products[i].productid});
                const invQuan = await inventory.findById(products[i].productid);
                let inventory_q = invQuan.quantity;
                let quantity = products[i].quantity;
                let price = products[i].price;
                let id = products[i].productid;
                data.push({name:a[0].name,quantity,price,id,inventory_q});
            }

            temp.products = data;
            temp.totalprice = totalprice;
            temp.placedat = createdAt;
            temp.orderid = _id;  
            temp.orderstatus = status;
            temp.ordertype = ordertype;

            response.push(temp);
        }

        res.status(200).json(response);
    }catch(e){
        let err = new Error(e);
        next({code:500,msg:err.stack}); 
    }
}


exports.getAllAcceptedOrders=async (req,res,next)=>{
    try{
        const orderdata = await order.find();
        let response = [];
        let length = orderdata.length;

        for(let i = 0;i < length;i++){
            let temp = {};
            const {userid,products,totalprice,createdAt,_id,status,ordertype} = orderdata[i];
            const {name,mobile,address} = await userdata.findById(userid);
            
            temp.userid = userid;
            temp.username = name;
            temp.usermobile = mobile;
            temp.useraddress = address;
            //temp.products = products;
            let data = [];
            
            for(let i=0;i<products.length;i++){
                const a = await product.find({_id:products[i].productid});
                let quantity = products[i].quantity;
                let price = products[i].price;
                let id = products[i].productid;
                data.push({name:a[0].name,quantity,price,id});
            }

            temp.products = data;
            temp.totalprice = totalprice;
            temp.placedat = createdAt;
            temp.orderid = _id;  
            temp.orderstatus = status;
            temp.ordertype = ordertype;

            if(status >= 1)
                response.push(temp);
        }

        res.status(200).json(response);
    }catch(e){
        let err = new Error(e);
        next({code:500,msg:err.stack}); 
    }
}

/*
    Order status scale : 
    -1 : not accepted yet waiting       orange
    0 : not accepted                    red
    1 : accepted                        green
    2 : out for delivery                yello
    3 : delivered                       blue
*/

exports.setorder = async(req,res,next)=>{
    try{
        const orderid  = req.body.orderid;
        const status = req.body.status;
        let temp = await order.findById(orderid);
        status ? temp.status = 1 : temp.status = 0;
        let products = temp.products;
        
        for(pr of products){
            let id = pr.productid;
            let newtemp = await inventory.findById(id);
            newtemp.quantity = parseInt(newtemp.quantity) - (pr.quantity);
            
            let date = new Date();
            let now = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`;

            
            let te = await itemsold.find({_id:id,date:now});
            if(te.length===0) await itemsold.insertMany({date:now,_id:id,quantity:pr.quantity});
            else{
                let nt = await itemsold.findById(id);
                nt.quantity = parseInt(nt.quantity) + parseInt(pr.quantity);
                nt.save();
            }


            await newtemp.save();
        }   

        //reduce item from inventory...

        let data = await temp.save();
        res.status(200).json(data);
    }catch(e){
        let err = new Error(e);
        next({code:500,msg:err.stack});
    }
}

exports.outForDelivery = async(req,res,next)=>{
    try{
        const orderid  = req.body.orderid;
        let temp = await order.findById(orderid);
        temp.status = 2;
        let data = await temp.save();
        res.status(200).json(data);
    }catch(e){
        let err = new Error(e);
        next({code:500,msg:err.stack});
    }
}



exports.delivered = async(req,res,next)=>{
    try{
        const orderid  = req.body.orderid;
        let temp = await order.findById(orderid);
        temp.status = 3;
        let data = await temp.save();

        let products = temp.products;
        for(let pr of products){
            let temp = await inventory.findById(pr.productid);
            temp.quantity = temp.quantity - pr.quantity;
            await temp.save(); 
        }

        res.status(200).json(data);
    }catch(e){
        let err = new Error(e);
        next({code:500,msg:err.stack});
    }
}


exports.getNumbersofAllAcceptedOrders=async(req,res,next)=>{
    try{    
        let temp = await order.find();


        let resp = temp.filter(data=>{
            let id = data._id;
            let status = data.status;
            
            let tempdate1 = new Date(data.updatedAt).toISOString();
            let tempdate2 = new Date(req.query.date).toISOString(); 
            
            let date1 = tempdate1.slice(0,tempdate1.indexOf("T"));
            let date2 = tempdate2.slice(0,tempdate2.indexOf("T"));

            if(date1 === date2)
                return(true);
            else
                return(false);
        });

        let accepted=0,rejected=0,delivered=0,arrived=0;

        resp.forEach(data=>{
            if(data.status === 1) accepted++;
            else if(data.status === 0) rejected++;
            else if(data.status === 3) {accepted++; delivered++;}
            else if(data.status === -1) {arrived}
        }) 

        res.status(200).json({accepted,rejected,delivered,arrived});

    }catch(err){
        let e  = new Error(err);
        next({code:500,msg:e.stack});
    }
}




exports.getDateWiseNumbers=async(req,res,next)=>{
    try{    
        let temp = await order.find();


        let resp = temp.filter(data=>{
            let id = data._id;
            let status = data.status;
            
            let tempdate1 = new Date(data.updatedAt).toISOString();
            let tempdate2 = new Date(req.query.date).toISOString(); 
            
            let date1 = tempdate1.slice(0,tempdate1.indexOf("T"));
            let date2 = tempdate2.slice(0,tempdate2.indexOf("T"));

            if(date1 === date2)
                return(true);
            else
                return(false);
        });

        let accepted=0,rejected=0,delivered=0,arrived=0;

        resp.forEach(data=>{
            if(data.status === 1) accepted++;
            else if(data.status === 0) rejected++;
            else if(data.status === 3) {accepted++; delivered++;}
            else if(data.status === -1) {arrived}
        }) 

        res.status(200).json({accepted,rejected,delivered,arrived});

    }catch(err){
        let e  = new Error(err);
        next({code:500,msg:e.stack});
    }
}

exports.addfilter=async(req,res,next)=>{
    try{
        let filter = req.body.filter.name;
        let data = await filters.insertMany([{name:filter}]);
        res.status(200).json({ data : data[0] });
    }catch(e){
        let err = new Error(e);
        next({code:500,msq:err.stack});
    }
}

exports.getAllItemSold=async(req,res,next)=>{
    try{
        let date = req.query.date;
        let items = await itemsold.find({date});
        let response=[];

        for(let item of items){
            let id = item._id;
            let temp = await productprice.findById(id);
            let price = temp.price;
            temp = await product.findById(id);
            let re = await inventory.findById(id);

            response.push({ price,...temp._doc,soldquantity:item.quantity,stock:re.quantity});
        }
        
        res.status(200).json(response);

    }catch(e){
        let err = new Error();
        next({code:500,msg:err.stack});
    }
}

exports.getPieChartData=async (req,res,next)=>{
    try{
       let data = await itemsold.find().sort({'quantity':-1});
       let produ = data.slice(0,5);
       let resp = [];
       for(let pro of produ){
        let temp = await product.findById(pro._id);
        let name = temp.name;
        let qty = pro.quantity;
        resp.push({name,qty});
       }
       res.status(200).json(resp);
    }catch(err){
        let e = new Error(err);
        next({code:500,msg:e.stack});
    }

}
