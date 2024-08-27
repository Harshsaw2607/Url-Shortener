import express from 'express'
const app=express();
const PORT=3002;
import { DBConnection } from './database/db.js';
import UrlRouter from './Router/UrlRouter.js';
DBConnection();


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.send('Hello');
})

app.use('/api/',UrlRouter);



app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})