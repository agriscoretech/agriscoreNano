import SensorData from "../models/SensorData.js";

export const getDeviceData = async(req,res)=>{
    const {deviceId} = req.params;
    try{
        const data = await SensorData.find({deviceId})
        .sort({timeStamp:-1});
        res.json(data);
    }catch (error){
        res.status(500).json({message:error.message});
    }
}

export const createSensorData = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const sensor = new SensorData(req.body);

    console.log("Before saving to MongoDB");

    const saved = await sensor.save();

    console.log("Saved document:", saved);

    res.status(201).json(saved);
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};