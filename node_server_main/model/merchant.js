const mongoose = require('mongoose');
const schema = mongoose.Schema;

const merchant = new schema({
    name:{
        type:String,
        required:true
    },
	tradersid:{
        type:String,
        required:false        
    },
	address:{
        type:String,
        required:true
    },
	mobile:{
        type:Number,
        required:true
    },
	email:{
        type:String,
        required:true
    }

},{timestamps:true});
module.exports =  mongoose.model('merchant',merchant);