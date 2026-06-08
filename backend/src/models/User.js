import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    fullName:{
        type:String,
        required:true,
        
    },
   password:{
        type:String,
        required:true,
        minlength:6,
    },
   profilePhoto:{
        type:String,
        default:""
    }
},{timestamps: true});//timestamps is used to show the account created at and updated at

const User = mongoose.model("User", userSchema);
export default User;