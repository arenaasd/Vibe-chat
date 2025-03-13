import React, { useState } from 'react';
import { useAuthStore } from '../Store/useAuthStore';
import { Link } from 'react-router-dom';
import { MessageSquare, Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import AuthImagePattern from '../components/AuthImagePattern';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLogingin } = useAuthStore();

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Email is required!");
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return toast.error("Invalid email address!");
    if (!formData.password) return toast.error("Password is required!");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) login(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Login Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 min-h-[500px]">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Log in to continue</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email Address</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/60" />
                </div>
                <input
                  type="email"
                  className="input focus:outline-none input-bordered w-full pl-10"
                  placeholder="johndoe@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/60" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input focus:outline-none input-bordered w-full pl-10 pr-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-base-content/60"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button className="btn btn-primary w-full" type="submit" disabled={isLogingin}>
              {isLogingin ? (
                <>
                  <Loader className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-base-content/60">
              Don't have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Animated Pattern */}
      <AuthImagePattern
        title="Welcome Back"
        subtitle="Connect with your friends and enjoy seamless conversations."
      />
    </div>
  );
};

export default LoginPage;
