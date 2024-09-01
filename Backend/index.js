import express from 'express'
import cors from 'cors'
const app=express();
const PORT=3002;
import { DBConnection } from './database/db.js';
import UrlRouter from './Router/UrlRouter.js';
import { rateLimiter } from './RateLimiter.js';
import AuthRouter from './Router/AuthRouter.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
dotenv.config()
DBConnection();

app.use(cors({ origin:process.env.origin, 
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization'
 }))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(rateLimiter);

app.get('/',(req,res)=>{
    res.send('Hello');
})

app.use('/api/HandleURL/',UrlRouter);
app.use('/api/auth/', AuthRouter)



app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})