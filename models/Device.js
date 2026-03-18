import mongoose from "mongoose"
const deviceSchema = new mongoose.Schema({
    deviceId:{
        type:String,
        required:true,
        unique:true,

    },
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
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

