import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export const register = async (req, res) => {
  try {
    const { email, pin } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPin = await bcrypt.hash(pin, 10);

    const user = new User({
      email,
      pin: hashedPin
    });

    await user.save();

    res.json({ message: "User created" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const { email, pin } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(pin, user.pin);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Determine role
    const role = email === ADMIN_EMAIL ? "admin" : "farmer";

    const token = jwt.sign(
      { id: user._id, email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};