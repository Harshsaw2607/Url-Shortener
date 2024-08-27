// const Url = require('../models/Url');
import Url from '../models/Url.js';
import { nanoid } from 'nanoid'
import validator from 'validator';

function isValidUrl(longUrl){
    return validator.isURL(longUrl, {
        protocols: ['http', 'https'],
        require_tld: true,
        require_protocol: true
    });
}

const createURL = async (req, res) => {
    const { longUrl, alias } = req.body;
    try {
        if(!longUrl){
            return res.status(400).json({
                message : 'Empty URL',
                success: false
            });
        }

        if(!isValidUrl(longUrl)){
            console.log("Invalid URL");
            return res.status(400).json({
                message : 'Invalid URL',
                success: false
            });
        }


        if(alias){
            const existing = await Url.findOne({shortID: alias}); 
            if(existing){
                console.log("Alias already exists");
                return res.status(400).json({
                    message : 'Alias already exists',
                    success: false
                });
            }
            else{
                const url=await Url.create({
                    shortID: alias,
                    longUrl,
                    visitHistory: []
                
                });
                return res.status(200).json({
                    message : 'URL Created',
                    success: true,
                    data : url
                });
            }
        }
        else{
            const shortID = nanoid(8);
            const url= await Url.create({
                shortID,
                longUrl,
                visitHistory: []
            
            });
            return res.status(200).json({
                message : 'URL Created',
                success: true,
                data : url
            });
        }
        


    } catch (error) {
        console.log("Error in creating URL = ", error);
        return res.status(500).json({
            message : 'Internal Server Error',
            success: false,
            error:error
        });
    }
}

export  { createURL };