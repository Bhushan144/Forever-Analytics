import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';

import path from 'path';
import { fileURLToPath } from 'url';

let app = express()

//middlewares 
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // This is essential for sending cookies
};

app.use(cors(corsOptions));

// Middleware that converts JSON string (if we got from req.body of each req) → JS object
app.use(express.json({limit:"16kb"}))

app.use(express.static('public'))

app.use(cookieParser())
 
//user Routes 
app.use("/api/user",userRouter);

//product Routes
app.use("/api/product",productRouter);

// This part is new:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/images', express.static(path.join(__dirname, '../public/images')));

export {app};