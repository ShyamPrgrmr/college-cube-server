const mongoose = require('mongoose');
const schema = mongoose.Schema;

const orderstatus = new schema({
    _id:{
        type:String,
        required:true
    },
    status:{
        type:Number,
        required:true
    }
});
module.exports =  mongoose.model('orderstatus',orderstatus);