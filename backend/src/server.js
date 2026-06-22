import { app } from "./app.js";
import connectCloudinary from "./config/cloudinary.js";
import connectDB from "./db/index.js";
import dotenv from 'dotenv'

dotenv.config();

let port = process.env.PORT || 4000;

connectDB()
.then(()=>{
    connectCloudinary()
    app.listen(port,()=>{
        console.log(`app listening on port ${port}`)
    })
})
.catch((error)=>{
    console.log("mongo db connection failed: ",error)
})
