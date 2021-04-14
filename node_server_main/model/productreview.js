const mongoose = require('mongoose');
const schema = mongoose.Schema;

const productreview = new schema({
    _id:{
        type:String,
        required:true
    },
    totalreview:[
        {type:Number}
    ],
    count:{
        type:Number,
        required:true
    },
    final:{type:Number},
    userreviews:[
        {type:String}
    ]
},{timestamps:true});
module.exports =  mongoose.model('productreview',productreview);