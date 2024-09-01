import express from 'express'
const app=express();
import validator from 'validator';
import bcrypt from 'bcryptjs' 
import jwt from 'jsonwebtoken'
import cookie from 'cookie-parser'
import User from '../models/User.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()
import UserRoles from './UserRoles.json' assert { type: 'json' };

app.use(express.json())
app.use(express.urlencoded({extended:true}))

function isValidEmail(email){
    return validator.isEmail(email);
}



const LogIn = async (req,res) =>{
    try {
        const{email,password}=req.body
        if(!(email && password)){
            return res.status(401).send("All fields are required")
        }

        if(!isValidEmail(email)){
            return res.status(400).send("Format is incorrect");
        }

        const userExists=await User.findOne({email})
        if(!userExists){
            return res.status(400).send("User doesn't exist")
        }

        const validPassword=await bcrypt.compare(password, userExists.password);

        if(!validPassword){
            return res.status(400).send("Password is incorrect")
        }

        userExists.password=undefined
        userExists.code=undefined
        let roles
        const foundUser = UserRoles.find(person => person.username === email)
        if(foundUser){
            roles=Object.values(foundUser.roles)
        }
        else{
            roles=[2001]
        }

        const token=jwt.sign({id:userExists._id,email,roles},process.env.SECRET_KEY,{
            expiresIn : "1d"
        })

        res.status(201).cookie("token",token,{
            expires : new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }).json({
            message:"You have successfully Logged in",
            success : true,
            userExists,
            token,
            roles
        })
    }catch (error) {
        console.log(error);
    }
    
}

export default LogIn