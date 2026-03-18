import mongoose from "mongoose"
const deviceSchema = new mongoose.Schema({
    deviceId:{
        type:String,
        required:true,
        unique:true,

    },

    location:{
        type:String,
        required:true,

    },

    status:{
        type:String,
        default:"offline"

    },
    lastSeen:{
        type:Date,
        default:Date.now
    }
},
    
    { timestamps:true}

);
export default mongoose.model("Device",deviceSchema)

