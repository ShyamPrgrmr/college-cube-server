const mongoose = require('mongoose');
const schema = mongoose.Schema;

const filters = new schema({
    name:{
        type:String
    }
});
module.exports =  mongoose.model('filters',filters);