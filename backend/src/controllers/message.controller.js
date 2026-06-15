import Message from "../models/Message.js";
import User from "../models/User.js";

export const getAllContacts = async (req , res) => {
    try{
        const loggedUserId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne: loggedUserId}}).select("-password");

        res.status(200).json(filteredUsers);
    }
    catch(error){
        console.log("error in gatAllContacts",error);
        res.status(500).json({message:"Server error"});
    }
};

export const getMessagesByUserId = async (req,res)=>{
    try{
        const myId = req.user._id;
        const {id:userToChatId} = req.params;
        const messages = await Message.find({
            $or: [
                {senderId:myId,receiverId:userToChatId}, // here i am the sender so i send myid in senderId
                {senderId:userToChatId,receiverId:myId}, // here i am the receiver so i receive messages
                // totally i get the messages between me and a user
            ],
        });
        res.status(200).json({messages})
    }
    catch(error){
        console.log("error in gatAllContacts",error.message);
        res.status(500).json({message:"Internal Server error"});
    }
};

export const sendMessage = async (req , res) => {
    try{
       const {text, image} = req.body;
       const {id: receiverId} = req.params; // we can get it from parameter in the route "/send/:id"
       const senderId = req.user._id;
       if(!text && !image){
        return res.status(400).json({message: "Text or image i srequired"});
       }
       if(senderId.equals(receiverId)){
        return res.status(400).json({message: "cannot send messages to yourself"});
       }
       const receiverExists = await User.exists({_id: receiverId});
       if(!receiverExists){
        return res.status(404).json({message: "receiver not found"});
       }
       let imageUrl;
       if(image){
        const uploadResponse= await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
       }
       const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl,
       });
       await newMessage.save();
       res.status(201).json(newMessage);
    }
    catch(error){
        console.log("error in gatAllContacts", error.message);
        res.status(500).json({message:" Internal Server error"});
    }
};

//here we only get the chats that (sender is us , receiver is us)
export const getChatPartners = async (req,res) => {
    try{
        const loggedInUserId = req.user._id;
        //finding all the messages that the user is either a sender or receiver
                const messages = await Message.find({
            $or: [
                {senderId: loggedInUserId},{receiverId:loggedInUserId}, 
            ],
        });
        const chatPartnerIds = [
            ...new Set( // put this in a set to avoid duplicate partners
                messages.map((msg) => 
                    msg.senderId === loggedInUserId.toString() // it means if sender is us then we should fetch the receiver id 
                        ? msg.receiverId.toString()
                        : msg.senderId.toString())
    ),
    ];
    const chatPartners =  await User.find({_id: {$in: chatPartnerIds}});
    req.status(200).json(chatPartners); // get response as all partners
    }
    catch(error){
        console.error("Error in getChatPartners");
        res.status(500).json({error: "Internal server error"});
    }
};