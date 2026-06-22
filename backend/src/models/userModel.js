import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    cartData:{
        type:Object,
        default:{}
    },
    role:{
        type:String,
        default:"User",
        enum:["User","Admin"]
    }
},{timestamps:true ,minimize:false})//by default minimize:true , but minimize:false means it forces Mongoose to save fields even if they have an empty object.

const user = mongoose.models.user || mongoose.model("user",userSchema);

export default user;