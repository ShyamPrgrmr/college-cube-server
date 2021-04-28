const mongoose = require('mongoose');
const schema = mongoose.Schema;

const otp = new schema({
    _id:{
        type:String,
        required:true
    },
    number:{
        type:String,
        required:true
    },
    confirm:{
        type:Boolean
    }
},{timestamps:true});
module.exports =  mongoose.model('otp',otp);