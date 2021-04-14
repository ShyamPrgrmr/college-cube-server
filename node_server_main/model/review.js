const mongoose = require('mongoose');
const schema = mongoose.Schema;

const review = new schema({
    productid:{
        type:String,
        required:true
    },
    userid:{
        type:String,
        required:true
    },
    review:{
        type:Number,
        required:true
    },
    reviewText:{
        type:String
    }
},{timestamps:true});
module.exports =  mongoose.model('review',review);