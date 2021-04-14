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
        },{_id:false}
    ],
    totalprice:{
        type:Number,
        required:true
    },
    status:{
        type:Number,
        required:true
    },
    ordertype:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    }

},{timestamps:true});
module.exports =  mongoose.model('order',order);