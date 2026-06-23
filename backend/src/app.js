import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';

import trackingRouter from './routes/trackingRouter.js';
import analyticsRouter from './routes/analyticsRouter.js';

import path from 'path';
import { fileURLToPath } from 'url';

let app = express()

// Middleware that converts JSON string (if we got from req.body of each req) → JS object
app.use(express.json({limit:"1mb"}))

//middlewares 
const corsOrigins = process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174';
const allowedOrigins = corsOrigins.split(',').map(o => o.trim().replace(/\/+$/, ''));
console.log('CORS allowed origins:', allowedOrigins);

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn('CORS blocked origin:', origin);
            callback(null, false); // Reject without crashing — sends proper CORS denial
        }
    },
    credentials: true, // This is essential for sending cookies
};


app.use(cors(corsOptions));



app.use(express.static('public'))

app.use(cookieParser())

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running successfully!"
    });
});

//user Routes 
app.use("/api/user",userRouter);

//product Routes
app.use("/api/product",productRouter);

app.use('/api/tracking', trackingRouter);
app.use('/api/analytics', analyticsRouter);

// This part is new:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/images', express.static(path.join(__dirname, '../public/images')));

export {app};