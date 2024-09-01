import express from 'express';
import { createURL, generarteQR } from '../Controller/Shortener.js';
import { RedirectTo } from '../Controller/RedirectTo.js';
import { Analytics } from '../Controller/Analytics.js';
const UrlRouter = express.Router();

UrlRouter.post('/url/create/',createURL)
UrlRouter.post('/url/generate',generarteQR)
UrlRouter.get('/url/:shortId',RedirectTo)
UrlRouter.get('/analytics/:shortId',Analytics)

export default UrlRouter;