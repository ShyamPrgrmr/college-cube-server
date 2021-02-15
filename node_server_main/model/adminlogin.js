const mongoose = require('mongoose');
const schema = mongoose.Schema;

const adminlogin = new schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});
module.exports =  mongoose.model('adminlogin',adminlogin);