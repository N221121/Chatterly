import jwt from "jsonwebtoken";
import {ENV} from "./env.js";

export const generateToken = (userId , res)=>{
    console.log("generateToken called");
    const token = jwt.sign({userId},ENV.JWT_SECRET,{
        expiresIn:"7d",
    });
       console.log("Token created");
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: ENV.NODE_ENV !== "development",
        sameSite: ENV.NODE_ENV === "development" ? "lax" : "none",
    });
    console.log("Cookie set");
};