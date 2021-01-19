const mongoose = require('mongoose');
const schema = mongoose.Schema;

const inventoryproduct = new schema({
    _id:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    }

},{timestamps:true});
module.exports =  mongoose.model('inventoryproduct',inventoryproduct);