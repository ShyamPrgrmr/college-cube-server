const mongoose = require('mongoose');
const schema = mongoose.Schema;

const delivery = new schema({
    name:{
        type:String,
        required:true
    },
    

});
module.exports =  mongoose.model('delivery',delivery);