//modules import
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require("multer");
const path = require('path');
const helmet = require('helmet');

//file import
const auth = require('./controller/auth');
const product = require("./controller/product");
const admin = require("./controller/admin");
const isAuth = require("./middleware/isAuth").isAuthenticate;
const isAdmin = require("./middleware/isAuth").isadmin;
const isSameUser = require("./middleware/isAuth").isSameUser;
const user = require('./controller/user');
const shop = require('./controller/shop');
const merchant = require('./controller/merchant');
const inventory = require('./controller/inventory');

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

const strg = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/avatar')
    },
    filename: function (req, file, cb) {
      cb(null, new Date().getTime()+"-"+ file.originalname );
    }
});

   
const upload = multer({storage: storage});
const uploadavatar = multer({storage: strg});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","OPTIONS,GET,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers","Content-Type,Authorization");
    next();
});


app.use('/images',express.static(path.join(__dirname,'images')));

app.use(helmet({
    referrerPolicy:{policy:'no-referrer'}
}));

app.get('/', (req, res, next) => {res.status(200).json({msg:"Server is up..."}); } );

//log
app.use('/',(req,res,next)=>{
    console.log("Endpoint : " + req.url);
    console.log('Date & Time : ',new Date().toDateString(),"/",new Date().getHours(),":",new Date().getMinutes(),":",new Date().getSeconds());
   // console.log('Body : ',req.body);
    next();
});

//merchant operation
app.post('/admin/inventory/addvendor',isAuth,isAdmin,merchant.addmerchant);
app.put('/admin/inventory/updatevendor',isAuth,isAdmin,merchant.updatemerchant);
app.delete('/admin/inventory/deletevendor',isAuth,isAdmin,merchant.deletemerchant);
app.get('/admin/inventory/getvendors',isAuth,isAdmin,merchant.getmerchants);

//inventory operation
app.post('/admin/inventory/addproductstoinventory',isAuth,isAdmin,inventory.addproductstoinventory);
app.get('/admin/inventory/viewproductsininventory',isAuth,isAdmin,inventory.viewproductdataininventory);


//shop operation
app.post('/shop/addorder',isAuth,shop.addorder);
app.get('/shop/getorders',isAuth,shop.getorders);
app.get('/shop/getorderdata',isAuth,shop.getorderdata);
app.put('/shop/updateorder',isAuth,shop.updateproduct);
app.delete('/shop/deleteorder',isAuth,shop.deleteorder);

//admin operation
app.post('/admin/login',auth.adminlogin);

//user operations
app.post('/user/signup',auth.signupuser);
app.post('/user/login',auth.userlogin);
app.post('/user/setuserdata',isAuth,user.setuserdata);
app.put('/user/updateuserdata',isAuth,user.updateuserdata);
app.get('/user/getuserdata',isAuth,user.getuserdata);
app.put('/user/updateuseravatar',uploadavatar.single('file'),isAuth,(req,res,next)=>{
    const file = req.file;
    if (!file) {
        res.status(400).json({err:"Please Upload File!"});
    }else{
        next();
    }  
},user.setuseravtar);

//product operation
app.post('/admin/addproduct', upload.array('file',4),isAuth,isAdmin,(req, res, next) => {
    const file = req.files;
    if (!file) {
        res.status(400).json({err:"Please Upload File!"});
    }else{
        next();
    }  

},admin.addproduct);
app.put('/admin/updateproduct',isAuth,isAdmin,admin.updateproduct);
app.delete('/admin/deleteproduct',isAuth,isAdmin,admin.deleteproduct);
app.get('/product/getproducts',isAuth,product.getproduct);
app.put('/admin/updateproductprice',isAuth,isAdmin,admin.updateproductprice);


//delivery service
app.get('/admin/order/getallorders',isAuth,isAdmin,admin.getAllOrders);
app.post('/admin/order/setdelivery',isAuth,isAdmin,admin.setorder);
app.put('/admin/order/outfordeliver',isAuth,isAdmin,admin.outForDelivery);
app.put('/admin/order/delivered',isAuth,isAdmin,admin.delivered);


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
