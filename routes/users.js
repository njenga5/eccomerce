import express from "express";

import { createNewUser, getOneUser } from "../controllers/users.js";

const router = express.Router();

router.route('/new').post(createNewUser).get((req, res)=>{
    res.render('pages/register.html')
});
router.route('/login').post(getOneUser).get((req, res)=>{
    res.render('pages/login.html')
});

export default router;
