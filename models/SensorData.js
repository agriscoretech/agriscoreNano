import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema({
    deviceId:String,
    location:String,
    temperature:Number,
    humidity:Number,
    ph:Number,
    nitrogen:Number,
    phosphorus:Number,
    potassium:Number,
    timestamp:{
        type:Date,
        default : Date.now
    }
});
export default mongoose.model("sensorData",sensorSchema);
