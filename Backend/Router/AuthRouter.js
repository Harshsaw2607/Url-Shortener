import express from 'express';
const AuthRouter = express.Router()
import Register from '../Controller/Register.js';
import LogIn from '../Controller/LogIn.js';
import { Profile, Logout } from '../Controller/Profile.js'
AuthRouter.post('/register', Register)
AuthRouter.post('/login', LogIn)
AuthRouter.get('/profile', Profile)
AuthRouter.post('/logout', Logout)

export default AuthRouter;