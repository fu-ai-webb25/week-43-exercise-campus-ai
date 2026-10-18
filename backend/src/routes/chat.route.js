import { Router } from "express";
import {llm} from "../config/ollama.config.js";

const router = Router();

router.post('/', async (req, res) => {
    const { question, history = [] } = req.body;
    console.log("Received question:", question);
    console.log(llm);
    const answer = await llm.invoke([
        ...history,
        question
    ]);
    console.log('Answered:', answer.content )
    res.json({ answer : answer.content });
});

export default router;