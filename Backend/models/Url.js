// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema({
    shortID: {
        type : String,
        required : true,
        unique : true
    },
    longUrl: {
        type : String,
        required : true
    },
    visitHistory: [{
        type : Number
    }],  
    
},{ timestamps: true })

export default mongoose.model('Url', UrlSchema)
