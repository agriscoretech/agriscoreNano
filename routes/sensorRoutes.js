import express from "express";
import { getDeviceData, createSensorData } from "../controllers/sensorController.js";
import SensorData from "../models/SensorData.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// IoT route (NO auth needed)
router.post("/iot/data", createSensorData);

// Get ALL sensor data (admin only)
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const data = await SensorData.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get data for specific device (admin only)
router.get("/:deviceId", verifyToken, verifyAdmin, getDeviceData);

export default router;