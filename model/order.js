const mongoose = require('mongoose');
const schema = mongoose.Schema;

const order = new schema({
    userid:{
        type:String,
        required:true
    },
    products:[
        {
            productid:{
                type:String,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            price:{
                type:Number,
                required:true
            }
        }
    ],
    totalprice:{
        type:Number,
        required:true
    }

},{timestamps:true});
module.exports =  mongoose.model('order',order);