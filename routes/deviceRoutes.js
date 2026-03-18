import express from "express";

import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import { getDevices, createDevice, updateLocation } from "../controllers/deviceController.js";
const router = express.Router();
// Admin routes
router.get("/", verifyToken, verifyAdmin, getDevices);
router.post("/", verifyToken, verifyAdmin, createDevice);

// Farmer routes (no admin check)
router.get("/farmer", verifyToken, getDevices);
router.post("/farmer", verifyToken, createDevice);
router.put("/update-location", verifyToken, updateLocation);

export default router;