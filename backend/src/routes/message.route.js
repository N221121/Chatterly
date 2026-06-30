import express from "express";
import  { getAllContacts, getMessagesByUserId ,sendMessage, getChatPartners} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import {arcjetProtection} from "../middleware/arcjet.middleware.js";
//for message routes like send, delete 

//the middlewares execute in order - so requests get rate-limited first , then authenticated using(protectRoute)
//this is actually more efficient since unauthenticated requests get blocked by ratelimiting before hitting the aith middleware
const router = express.Router();
router.use(arcjetProtection,protectRoute);//middlewares
router.get("/contacts" , getAllContacts); // for getting all friends/contacts
router.get("/chats", getChatPartners); // for getting only the chat parteners 
router.get("/:id", getMessagesByUserId); // for gettig the messages or chat of a specific user when we click on that specific contact/friend

router.post("/send/:id", sendMessage);//for sending messages to a specific friend


export default router;