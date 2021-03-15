const mongoose = require('mongoose');
const schema = mongoose.Schema;


const product = new schema({
   name:{
       type:String,
       required:true
   },
   description:{
       type:String,
       required:false
   },
   measurement:{
       type:String,
       required:false
   },
   manufacturer:{
       type:String,
       required:true
   },
   imgsrc:[
        {
            type:String,
            required:false
        }
   ],
   category:{
       type:String,
       required:true
   }
},{timestamps:true});


module.exports =  mongoose.model('product',product);
