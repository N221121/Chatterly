import React from 'react';
import {Route , Routes} from "react-router";
import ChatPage from "./pages/ChatPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import { useAuthStore } from "./store/useAuthStore.js"

function App() {

  const {authUser,  login , isLoggedIn} = useAuthStore();

  console.log("auth user", authUser);
  console.log("isLoggedIn", isLoggedIn);
  return (
    <div className="min-h-screen flex items-center justify-center 
bg-slate-900 
bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] 
bg-[size:20px_20px]
relative overflow-hidden
before:content-[''] before:absolute before:inset-0 
before:bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15),transparent_60%)] 
before:blur-2xl before:opacity-70" >
  <button 
  onClick={login} 
  className="relative z-10 btn btn-primary"
>
  login
</button>
    <Routes>
      <Route path="/" element={<ChatPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
    </Routes>
    </div>
  );
}

export default App
