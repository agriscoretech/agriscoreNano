import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import deviceRoutes from "./routes/deviceRoutes.js";
import sensorRoutes from "./routes/sensorRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


//logger

app.use((req,res,next)=>{
  console.log(req.method,req.url);
  next();
});


app.get("/",(req,res)=>{
  res.send("agriScore Backend is working yeeeeyyyyy")
});

app.use("/api/devices",deviceRoutes);

app.use("/api/sensor-data", sensorRoutes);


//port 

const PORT = process.env.PORT ||2050;


//mongodb connection

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  console.log("MongoDB Connected");

  app.listen(PORT,()=>{
    console.log(`server Running on port ${PORT}`);
  });
})
.catch(err => console.log(err));
