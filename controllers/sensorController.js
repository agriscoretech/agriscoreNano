import SensorData from "../models/SensorData.js";
import Device from "../models/Device.js";

export const getDeviceData = async(req,res)=>{
    const {deviceId} = req.params;
    const device = await Device.findOne({ deviceId, farmerId: req.user.id });

    if (!device) {
      return res.status(403).json({ message: "Not authorized for this device" });
    }

    try{
        const data = await SensorData.find({
          deviceId,
          farmerId: req.user.id
        })
        .sort({timestamp:-1});
        res.json(data);
    }catch (error){
        res.status(500).json({message:error.message});
    }
}

export const createSensorData = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const { deviceId } = req.body;

    const device = await Device.findOne({ deviceId });

    if (!device) {
      return res.status(404).json({ message: "Device not registered" });
    }

    // Attach farmerId, but allow dynamic location from request
    const sensor = new SensorData({
      ...req.body,
      farmerId: device.farmerId,
      location: req.body.location || device.location
    });

    // Update device status + last seen
    await Device.findOneAndUpdate(
      { deviceId },
      {
        lastSeen: new Date(),
        status: "online"
      }
    );

    console.log("Before saving to MongoDB");

    const saved = await sensor.save();

    console.log("Saved document:", saved);

    res.status(201).json(saved);
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};