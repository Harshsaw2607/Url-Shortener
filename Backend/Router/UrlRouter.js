import express from 'express';
import { createURL } from '../Controller/Shortener.js';
import { RedirectTo } from '../Controller/RedirectTo.js';
import { Analytics } from '../Controller/Analytics.js';
const UrlRouter = express.Router();

UrlRouter.post('/url/create/',createURL)
UrlRouter.get('/url/:shortId',RedirectTo)
UrlRouter.get('/analytics/:shortId',Analytics)

export default UrlRouter;