import React from 'react';
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js"
import BorderAnimatedContainer from '../components/BorderAnimated.jsx';
import { MessageCircleIcon, MailIcon,LockIcon, LoaderIcon } from "lucide-react";
import { Link } from "react-router-dom";

function LoginPage() {

  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login , isLoggingIn } = useAuthStore();
  const handleSubmit = (e) => {
    e.preventDefault();

    login(formData);
  }

return (<div className="w-full min-h-screen flex items-center justify-center p-4">
    <div className="relative w-full max-w-4xl md:h-[650px] h-[550px]">
      <BorderAnimatedContainer>
        <div className="w-full flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <h2 className="text-2xl font-bold text-slate-400 mb-2">Welcome /back</h2>
                <p className="text-slate-400">Login to access your account</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">


                <div>
                  <label className="auth-input-label">Email</label>
                  <div className="relative">
                    <MailIcon className="auth-input-icon" />
                    <input type="email" value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                      placeholder="Enter your Email"
                    />
                  </div>
                </div>

                <div>
                  <label className="auth-input-label">Password</label>
                  <div className="relative">
                    <LockIcon className="auth-input-icon" />
                    <input type="password" value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="input"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <button className="auth-btn" type="submit" disabled={isLoggingIn}>
                  {
                    isLoggingIn ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                      "Sign In"
                    )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/signup" className="auth-link">
                  Don't have an account? Sign Up
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
            <div>
              <img src="login.png"
                alt="people using mobile devices"
                className="w-full h-auto object-contain"
              />
              <div className="mt-6 text-center">
                <h3 className="text-xl font-medium text-cyan-400">Connect anytime, anywhere</h3>
                <div className="mt-4 flex justify-center gap-5">
                  <span className="auth-badge">Free</span>
                  <span className="auth-badge">Easy setup</span>
                  <span className="auth-badge">Private</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BorderAnimatedContainer>
    </div>
  </div>
  )
}

export default LoginPage
