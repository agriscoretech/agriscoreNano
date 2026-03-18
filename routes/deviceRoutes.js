import express from "express";
import { getDevices, createDevice } from "../controllers/deviceController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
// Admin routes
router.get("/", verifyToken, verifyAdmin, getDevices);
router.post("/", verifyToken, verifyAdmin, createDevice);

// Farmer routes (no admin check)
router.get("/farmer", verifyToken, getDevices);
router.post("/farmer", verifyToken, createDevice);
router.put("/update-location", verifyToken, updateLocation);

export default router;