const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userdata = new schema({
    _id:{
        type:String,
        required:true
    },
    name:{
       firstname:{
           type:String,
           required:true
       },
       lastname:{
            type:String,
            required:true
       }
    },
    mobile:{
        mob_1:{
            type:String,
            required:true
        },
        mob_2:{
            type:String,
            required:false
        }
    },
    address:{
        route:{
            type:String,
            required:true
        },
        pincode:{
            type:Number,
            required:true
        },
        landmark:{
            type:String,
            required:false
        }       
    },
    avatar:{
        type:String,
        required:false
    }
},{_id:false});
module.exports =  mongoose.model('userdata',userdata);