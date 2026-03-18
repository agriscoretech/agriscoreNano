import express from"express";
import { getDeviceData, createSensorData } from "../controllers/sensorController.js";
const router = express.Router();

router.post("/iot/data", createSensorData);
router.get("/:deviceId",getDeviceData);
router.get("/", async (req, res) => {
  try {
    const data = await SensorData.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
