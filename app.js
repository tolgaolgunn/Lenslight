import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connection from './db.js';
import { checkUser } from './middlewares/authMiddleware.js';
import pageRoutes from './routes/pageRoute.js'
import photoRoutes from './routes/photoRoute.js'
import userRoute from './routes/userRoute.js'

dotenv.config();

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

//routes
app.get("*",checkUser);
app.use("/",pageRoutes);
app.use("/photos",photoRoutes);
app.use("/users",userRoute);

app.listen(port,()=>{
    console.log(`Application running on port:${port}`);
})