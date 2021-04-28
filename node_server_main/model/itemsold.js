const mongoose = require('mongoose');
const schema = mongoose.Schema;

const itemsold = new schema({
    _id:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    date:{
        type:String,
        required:true
    }
},{timestamps:true});
module.exports =  mongoose.model('itemsold',itemsold);