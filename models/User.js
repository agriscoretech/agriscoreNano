import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:String,
    pin:String
});
export default mongoose.model("User",userSchema);
