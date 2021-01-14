//modules import
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require("multer");
const path = require('path');

//file import
const auth = require('./controller/auth');
const product = require("./controller/product");
const admin = require("./controller/admin");
const isAuth = require("./middleware/isAuth").isAuthenticate;
const isAdmin = require("./middleware/isAuth").isadmin;

const app = express();
const port = 8080;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/product')
    },
    filename: function (req, file, cb) {
      cb(null, new Date().getTime()+"-"+ file.originalname );
    }
});

   
const upload = multer({storage: storage});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","OPTIONS,GET,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers","Content-Type,Authorization");
    next();
});


app.use('/images',express.static(path.join(__dirname,'images')));

app.get('/', (req, res, next) => {res.status(200).json({msg:"Server is up..."}); } );

//admin operation
app.post('/admin/login',auth.adminlogin);

//user operations
app.post('/user/signup',auth.signupuser);
app.post('/user/login',auth.userlogin);

//product operation
app.post('/admin/addproduct', upload.array('file',4), (req, res, next) => {
    const file = req.files;
    if (!file) {
        res.status(400).json({err:"Please Upload File!"});
    }else{
        next();
    }  

},isAuth,isAdmin,admin.addproduct);
app.put('/admin/updateproduct',isAuth,isAdmin,admin.updateproduct);
app.delete('/admin/deleteproduct',isAuth,isAdmin,admin.deleteproduct);
app.get('/product/getproduct',isAuth,product.getproduct);
app.put('/admin/updateproductprice',isAuth,isAdmin,admin.updateproductprice);


//error handling
app.use((err,req,res,next)=>{
    let code  = err.code;
    let msg   = err.msg; 
    res.status(code).json({error : msg});
});


mongoose.connect(
    "mongodb://127.0.0.1:27017/shop",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(result=>{
    console.log("running");
    app.listen(port);
}).catch(err=>{
    console.log(err);
})
