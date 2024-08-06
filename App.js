import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookie from 'cookie-parser';
import users from './Routers/Router-Users.js';


const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie(process.env.COOKIE_SECRET));

app.use(cors());


//Routers
app.use('/users' ,users);


// Port
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`running on port ${port}`);
});