const { json } = require("express");
const Product = require("./../model/product");
const mongo = require("mongodb");
const fs = require('fs');
const path = require('path');
const productprice = require("../model/productprice");

exports.addproduct = (req,res,next) =>{
    let data = JSON.parse(req.body.data);
    let name = data.name;
    let description = data.description;
    let measurement = data.measurement;
    let files = req.files.map(data=>{
        return new String(data.path).replace(/\\/g,"/");
    });

    Product.insertMany([{
        name,
        description,
        measurement,
        imgsrc: files
    }]).then(product=>{ 
        
        let id = product[0]._id;
        productprice.insertMany([{
            _id:id,
            price:0
        }]).then(p=>{
            product.price = p.price;
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
    let id = req.body.id;
    let product = await Product.findById(id);
    if(!product) {res.status(404).json({msg:"Product not found"});return;}
    else {
        product.name = name;
        product.measurement=measurement;
        product.description=description;
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