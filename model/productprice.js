const mongoose = require('mongoose');
const schema = mongoose.Schema;

const productprice = new schema({
    _id:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
},{_id:false,timestamps:true});
module.exports =  mongoose.model('productprice',productprice);