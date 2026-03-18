import express from "express";
import { getDevices, createDevice } from "../controllers/deviceController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", verifyToken, verifyAdmin, getDevices);
router.post("/", verifyToken, verifyAdmin, createDevice);


export default router;