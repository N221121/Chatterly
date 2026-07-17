import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000":import.meta.env.VITE_API_URL;

export const useAuthStore = create((set,get)=>({
   authUser: null,
   isCheckingAuth:true,
   isSigningUp:false,
   isLoggingIn:false,
   socket: null,
   onlineUsers: [],

   checkAuth: async ( )=>{
    try{
        const res= await axiosInstance.get("/auth/check");
        set({authUser: res.data});
        get().connectSocket();
    }
    catch(error){
        console.log("Error in authCheck",error);
        set({authUser:null});
    }finally{
        set({isCheckingAuth:false});
    }
   },
   signup: async(data)=>{
    set({isSigningUp:true});
    try{
         const res= await axiosInstance.post("/auth/signup",data);
         set({authUser:res.data});

         toast.success("Account created Successfully");
         get().connectSocket();
    }
    catch(error){
        toast.error(error.response.data.message);
    }
    finally{
        set({isSigningUp:false});
    }
   },

   login: async(data)=>{
    set({isLoggingIn:true});
    try{
         const res= await axiosInstance.post("/auth/login",data);
         set({authUser:res.data});

         toast.success("Logged in Successfully");
         get().connectSocket();
    }
    catch(error){
        toast.error(error.response?.data?.message || "Login failed");
    }
    finally{
        set({isLoggingIn:false});
    }
   },
   logout: async()=>{
    try{
         await axiosInstance.post("/auth/logout");
         set({authUser:null});

         toast.success("Logout in Successfully");  
         get().disconnectSocket();      
    }
    catch(error){
        toast.error("Error in logging out");
        console.log("logout error",error);
    }
   },

   updateProfile: async(data)=>{
    try{
        const res = await axiosInstance.put("/auth/update-profile",data);
        set({authUser:res.data});
        toast.success("profile updated successfully")
    }
    catch(error){
        console.log("error in updating profile",error);
        toast.error(error.response.data.messages);
    }
   },
connectSocket: () => {
    const { authUser } = get();

    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
        console.log("✅ Socket Connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
        console.log("❌ Socket Error:", err.message);
    });

    socket.on("disconnect", (reason) => {
        console.log("❌ Socket Disconnected:", reason);
    });

    socket.on("getOnlineUsers", (userIds) => {
        console.log("ONLINE USERS:", userIds);
        set({ onlineUsers: userIds });
    });

    // Optional
    // socket.connect();

    set({ socket });
},
   disconnectSocket:()=>{
    if(get().socket?.connected) get().socket.disconnect();
   }
}));