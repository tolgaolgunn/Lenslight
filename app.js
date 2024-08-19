import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import method_override from 'method-override';
import connection from './db.js';
import fileUpload from 'express-fileupload';
import { v2 as cloudinary} from 'cloudinary';
import { checkUser } from './middlewares/authMiddleware.js';
import pageRoutes from './routes/pageRoute.js'
import photoRoutes from './routes/photoRoute.js'
import userRoute from './routes/userRoute.js'

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

//connection to the DB
connection();

const app=express();
const port=process.env.PORT;

//ejs template engine
app.set("view engine","ejs");
//static files middleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(fileUpload({useTempFiles:true}));
app.use(method_override("_method",{
    methods:['POST','GET'],
}))


//routes
app.use("*",checkUser);
app.use("/",pageRoutes);
app.use("/photos",photoRoutes);
app.use("/users",userRoute);

app.listen(port,()=>{
    console.log(`Application running on port:${port}`);
})