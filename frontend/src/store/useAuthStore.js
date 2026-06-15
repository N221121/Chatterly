import {create} from "zustand";

export const useAuthStore = create((set)=>({
    authUser: {name:"john", _id:123 , age:25},
    isLoading:false,
    isLoggedIn: false,
    isLoading: false,

    login: ()=>{
        console.log("we just logged in");
        set({isLoggedIn: true, isLoading:true});
    },
}));