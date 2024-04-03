import express from "express";
import { askAIAgent } from "../controllers/agent.controller.js";


const router = express.Router();


router.get('/askagent', askAIAgent)



export default router