import Device from "../models/Device.js";

export const getDevices = async (req, res) => {
  try {

    let devices;

    if (req.user.role === "admin") {
      devices = await Device.find();
    } else {
      devices = await Device.find({ farmerId: req.user.id });
    }

    res.json(devices);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateLocation = async (req, res) => {
  try {
    const { location } = req.body;

    await Device.updateMany(
      { farmerId: req.user.id },
      { currentLocation: location }
    );

    res.json({ message: "Location updated" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createDevice = async (req, res) => {

  const { deviceId, location } = req.body;

  try {

    const device = new Device({
      deviceId,
      location,
      farmerId: req.user.id
    });

    const savedDevice = await device.save();

    res.status(201).json(savedDevice);

  } catch (error) {

    res.status(400).json({ message: error.message });

  }
};