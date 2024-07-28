import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import users from './Routers/Router-Users.js';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routers
app.use('/users' ,users);


// Port
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`running on port ${port}`);
});