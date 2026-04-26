/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  AtSign,
  Loader,
  Eye,
  EyeOff,
  Shield,
  AlertCircle,
  CheckCircle,
  UserCheck
} from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    email: "",
    password: "",
    role: "user"
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }
    if (!formData.handle.trim()) {
      newErrors.handle = "Username handle is required";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.handle)) {
      newErrors.handle = "Handle can only contain letters, numbers, and underscores";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setError("");

    try {
      // Simulate API call with the specified fields
      console.log('Registering user:', formData);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess("Account created successfully! Redirecting to login...");
      localStorage.setItem("userEmail", formData.email);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 py-20">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">CivicAlert</h1>
            <p className="text-sm text-vision-slate-400 mt-1 uppercase tracking-widest font-bold">
              Community Governance
            </p>
          </div>
        </div>

        {/* Signup Card */}
        <div className="glass rounded-3xl p-8 mb-6 shadow-xl border border-black/5 dark:border-white/5">
          <h2 className="text-xl font-bold mb-2 uppercase tracking-tight">Create Account</h2>
          <p className="text-[10px] font-bold text-vision-slate-400 mb-6 uppercase tracking-[0.2em]">
            Join the community to report and track issues
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex gap-2 items-start uppercase font-bold">
              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs flex gap-2 items-start uppercase font-bold">
              <CheckCircle size={14} className="mt-0.5 flex-shrink-0" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-[10px] font-bold text-vision-slate-400 uppercase tracking-widest mb-2 ml-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-vision-slate-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="JOHN DOE"
                  className={cn(
                    "w-full pl-12 pr-4 py-3 rounded-2xl glass transition-all focus:outline-none focus:ring-1 focus:ring-vision-accent text-sm font-bold uppercase tracking-tight",
                    errors.name && "ring-1 ring-red-500/50",
                  )}
                />
              </div>
              {errors.name && <p className="text-red-500 text-[9px] font-bold mt-1 uppercase ml-1">{errors.name}</p>}
            </div>

            {/* Handle Field */}
            <div>
              <label htmlFor="handle" className="block text-[10px] font-bold text-vision-slate-400 uppercase tracking-widest mb-2 ml-1">
                Username Handle
              </label>
              <div className="relative">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-vision-slate-400" />
                <input
                  type="text"
                  id="handle"
                  name="handle"
                  value={formData.handle}
                  onChange={handleChange}
                  placeholder="JOHNDOE_CIVIC"
                  className={cn(
                    "w-full pl-12 pr-4 py-3 rounded-2xl glass transition-all focus:outline-none focus:ring-1 focus:ring-vision-accent text-sm font-bold uppercase tracking-tight",
                    errors.handle && "ring-1 ring-red-500/50",
                  )}
                />
              </div>
              {errors.handle && <p className="text-red-500 text-[9px] font-bold mt-1 uppercase ml-1">{errors.handle}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-vision-slate-400 uppercase tracking-widest mb-2 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-vision-slate-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="YOU@EXAMPLE.COM"
                  className={cn(
                    "w-full pl-12 pr-4 py-3 rounded-2xl glass transition-all focus:outline-none focus:ring-1 focus:ring-vision-accent text-sm font-bold uppercase tracking-tight",
                    errors.email && "ring-1 ring-red-500/50",
                  )}
                />
              </div>
              {errors.email && <p className="text-red-500 text-[9px] font-bold mt-1 uppercase ml-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-[10px] font-bold text-vision-slate-400 uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-vision-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={cn(
                    "w-full pl-12 pr-12 py-3 rounded-2xl glass transition-all focus:outline-none focus:ring-1 focus:ring-vision-accent text-sm font-bold",
                    errors.password && "ring-1 ring-red-500/50",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-vision-slate-400 hover:text-vision-accent transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[9px] font-bold mt-1 uppercase ml-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-2xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 mt-6 uppercase tracking-widest text-xs"
            >
              {loading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Initialising...
                </>
              ) : (
                <>
                  <UserCheck size={16} />
                  Join CivicAlert
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sign In Link */}
        <div className="text-center p-6 glass rounded-3xl border border-black/5 dark:border-white/5">
          <p className="text-[10px] font-bold text-vision-slate-400 uppercase tracking-widest">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-vision-accent font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
