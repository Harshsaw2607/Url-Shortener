// const Url = require('../models/Url');
import Url from '../models/Url.js';
import { nanoid } from 'nanoid'
import validator from 'validator';
import QRCode from 'qrcode';

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
        console.log("longUrl = ", longUrl);
        if(!longUrl){
            return res.status(400).json({
                message : 'Empty URL',
                from:'URL',
                success: false,
                status: 400
            });
        }

        if(!isValidUrl(longUrl)){
            console.log("Invalid URL");
            return res.status(400).json({
                message : 'URL format is invalid',
                from:'URL',
                success: false,
                status: 400
            });
        }


        if(alias){
            const existing = await Url.findOne({shortID: alias}); 
            if(existing){
                console.log("Alias already exists");
                return res.status(400).json({
                    message : 'Alias already exists',
                    from:'Alias',
                    success: false,
                    status: 400
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
                    data : url,
                    status: 200
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
                data : url,
                status: 200
            });
        }
        


    } catch (error) {
        console.log("Error in creating URL = ", error);
        return res.status(500).json({
            message : 'Internal Server Error',
            from:'Server',
            success: false,
            error:error,
            status: 500
        });
    }
}

const generarteQR = async (req, res) => {
    const { longUrl } = req.body;
    try {
        if(!longUrl){
            return res.status(400).json({
                message : 'Empty URL',
                from:'URL',
                success: false,
                status: 400
            });
        }
        if(!isValidUrl(longUrl)){
            console.log("Invalid URL");
            return res.status(400).json({
                message : 'Invalid URL',
                from:'URL',
                success: false,
                status: 400
            });
        }
        const QRCODE = await QRCode.toDataURL(longUrl);
        res.status(200).json({
            message : 'QR Code Generated',
            from:'URL',
            success: true,
            data : QRCODE,
            status: 200
        })
    } catch (error) {
        console.log("Error in generating QR Code = ", error);
        res.status(500).json({
            message : 'Internal Server Error',
            from:'Server',
            success: false,
            error:error,
            status: 500
        })
    }
    

    
}

export  { createURL, generarteQR } ;