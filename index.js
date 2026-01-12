import express from "express";
import db from "./config/Database.js";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// import Books from "./models/ModelBook.js";
// import Users from "./models/ModelUser.js";
// import Logs from "./models/ModelLog.js";
import dotenv from "dotenv";

dotenv.config();
const app = express()

try {   
    await db.authenticate();
    console.log(`Database Perpustakaan Sudah Terhubung`);
    // await Books.sync();
    // await Users.sync();
    // await Logs.sync();
} catch (error) {
    console.log(error);
}   

app.use(cors ({Credential:true, origin:"http://localhost:3000"}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.listen(3000, () => {
    console.log(`Sudah masuk ke database`)
});

