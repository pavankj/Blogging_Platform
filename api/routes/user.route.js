import express from "express";
import {  checkSubscription, getAllUsers, subscribe, unsubscribe, updateUser } from "../controllers/user.controller.js";

const router = express.Router();


router.get('/get', getAllUsers)
router.post('/update', updateUser)
router.post('/subscribe', subscribe)
router.delete('/unsubscribe', unsubscribe)
router.post('/issubscribed', checkSubscription)


export default router