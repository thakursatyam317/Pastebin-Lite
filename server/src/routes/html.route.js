import  express from "express";
import { getHTMLPastes } from "../controllers/pastebinLite.controller.js";

const router = express.Router();


router.get('/:id', getHTMLPastes);
export default router;