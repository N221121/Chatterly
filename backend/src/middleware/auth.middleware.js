import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {ENV} from "../lib/env.js";


export const protectRoute = async (req,res,next) =>{
    try{
        // protected (checking the authorizations)
        const token = req.cookies.jwt;
        if(!token) return res.status(401).json({message: "Unauthorized -  No token Provided"});
        const decoded =  jwt.verify(token,ENV.JWT_SECRET);
        if(!decoded) return res.status(401).json({message: "Unauthorized -  No token Provided"});
        const user = await User.findById(decoded.userId).select("-password");
        if(!user) return res.status(404).json({message: "User not found"});
        req.user = user;
        next(); // update profile 
    }
    catch(error){
        console.log("error in protectRoute middleware", error);
        res.status(500).json({message: "Internal server error"});
    }
};