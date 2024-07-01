import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connection = () => {
    mongoose
    .connect(process.env.DB_URI, {
        dbName: 'lenslight',
    }).then(() => {
        console.log("Connected to database successfully");
    }).catch((err) => {
        console.log(`DB connection error: ${err}`);
    });
};

export default connection;