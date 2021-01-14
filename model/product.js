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
   imgsrc:[
        {
            type:String,
            required:false
        }
   ]
},{timestamps:true});


module.exports =  mongoose.model('product',product);