import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookie from 'cookie-parser';

import users from './Routers/Router-Users.js';
import cookieConfig from './middleWare/Cookie.js';

const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie(process.env.COOKIE_SECRET));
const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN || '*',
    credentials: true,
  };
app.use(cors(corsOptions));
app.use(cookieConfig);

//Routers
app.use('/users' ,users);


// Port
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`running on port ${port}`);
});