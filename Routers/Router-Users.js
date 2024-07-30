import express from 'express';
import user from '../Controllers/Controll-Users.js';
const router = express.Router();

router.post("/sign-up", user.sign_up);
router.post("/log-in", user.login);
router.get("/getusers", user.Allusers);


export default router;