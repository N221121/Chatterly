import express from "express";
//for message routes like send, delete 
const router = express.Router();


router.get("/send",(req,res)=>{
    res.send("send");
});


export default router;