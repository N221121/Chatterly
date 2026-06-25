import React from 'react';
import {Route , Routes, Navigate} from "react-router-dom";
import ChatPage from "./pages/ChatPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import {useAuthStore} from "./store/useAuthStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader.jsx";
import {Toaster} from "react-hot-toast"
function App() {
  const {checkAuth ,  isCheckingAuth, authUser} = useAuthStore()

  useEffect( ()=>{
    checkAuth()
  },[checkAuth]);
  console.log(authUser);

  if(isCheckingAuth) return <PageLoader />
  return (
    <div className="min-h-screen flex items-center justify-center 
bg-slate-900 
bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] 
bg-[size:20px_20px]
relative overflow-hidden
before:content-[''] before:absolute before:inset-0 
before:bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15),transparent_60%)] 
before:blur-2xl before:opacity-70" >

    <Routes>
      <Route path="/" element={authUser ? <ChatPage />: <Navigate to={"/login"} />} />{/* if user not authenticated then login page appears*/}
      <Route path="/login" element={!authUser ? <LoginPage />: <Navigate to={"/"} />} /> {/* if user is authenticated then it shows home page means chatpage*/}
      <Route path="/signup" element={!authUser ? <SignUpPage />: <Navigate to={"/"} />} />
    </Routes>
    <Toaster/>
    </div>
  );
}

export default App
