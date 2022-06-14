import express from "express";
import { getData, postData, deleteData } from "../controller/Sensor.js";

const router = express.Router();
router.get("/data", getData);
router.post("/data", postData)
router.delete("/data", deleteData)


export default router;