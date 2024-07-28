import express from 'express';
import SignIn from '../Controllers/Controll-Users.js';
const router = express.Router();

router.post("/sign-in", SignIn.sign_in);


export default router;