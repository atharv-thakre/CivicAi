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
  Phone,
  MapPin,
  UserCheck,
  Loader,
  Eye,
  EyeOff,
  Shield,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "password") {
      setPasswordStrength(validatePasswordStrength(value));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock success
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

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-300";
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">CivicAlert</h1>
            <p className="text-sm text-vision-slate-400 mt-1">
              Join the movement
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          <div
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all",
              step >= 1 ? "bg-vision-accent" : "bg-[var(--border)]",
            )}
          />
          <div
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all",
              step >= 2 ? "bg-vision-accent" : "bg-[var(--border)]",
            )}
          />
        </div>

        {/* Signup Card */}
        <div className="glass rounded-3xl p-8 mb-6 shadow-xl">
          <h2 className="text-xl font-bold mb-2">
            {step === 1 ? "Create Your Account" : "Secure Your Account"}
          </h2>
          <p className="text-sm text-vision-slate-400 mb-6">
            {step === 1 ? "Tell us about yourself" : "Set up your password"}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex gap-2 items-start">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex gap-2 items-start">
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
              {success}
            </div>
          )}

          <form
            onSubmit={
              step === 2
                ? handleSubmit
                : (e) => {
                    e.preventDefault();
                    handleNext();
                  }
            }
            className="space-y-4"
          >
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <>
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-semibold mb-2"
                    >
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vision-slate-400" />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className={cn(
                          "w-full pl-12 pr-4 py-3 rounded-2xl glass transition-all focus:outline-none focus:ring-2 focus:ring-vision-accent",
                          errors.firstName && "ring-2 ring-red-500/50",
                        )}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-semibold mb-2"
                    >
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vision-slate-400" />
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className={cn(
                          "w-full pl-12 pr-4 py-3 rounded-2xl glass transition-all focus:outline-none focus:ring-2 focus:ring-vision-accent",
                          errors.lastName && "ring-2 ring-red-500/50",
                        )}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vision-slate-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={cn(
                        "w-full pl-12 pr-4 py-3 rounded-2xl glass transition-all focus:outline-none focus:ring-2 focus:ring-vision-accent",
                        errors.email && "ring-2 ring-red-500/50",
                      )}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold mb-2"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vision-slate-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className={cn(
                        "w-full pl-12 pr-4 py-3 rounded-2xl glass transition-all focus:outline-none focus:ring-2 focus:ring-vision-accent",
                        errors.phone && "ring-2 ring-red-500/50",
                      )}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Address Field (Optional) */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-semibold mb-2"
                  >
                    Address (Optional)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vision-slate-400" />
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main St, City, State"
                      className="w-full pl-12 pr-4 py-3 rounded-2xl glass transition-all focus:outline-none focus:ring-2 focus:ring-vision-accent"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Password & Terms */}
            {step === 2 && (
              <>
                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vision-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={cn(
                        "w-full pl-12 pr-12 py-3 rounded-2xl glass transition-all focus:outline-none focus:ring-2 focus:ring-vision-accent",
                        errors.password && "ring-2 ring-red-500/50",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-vision-slate-400 hover:text-[var(--text)] transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2 space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-1 flex-1 rounded-full transition-colors",
                              i <= passwordStrength
                                ? getPasswordStrengthColor()
                                : "bg-[var(--border)]",
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-vision-slate-400">
                        Strength:{" "}
                        <span className="font-semibold">
                          {getPasswordStrengthText()}
                        </span>
                      </p>
                    </div>
                  )}

                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vision-slate-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={cn(
                        "w-full pl-12 pr-12 py-3 rounded-2xl glass transition-all focus:outline-none focus:ring-2 focus:ring-vision-accent",
                        errors.confirmPassword && "ring-2 ring-red-500/50",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-vision-slate-400 hover:text-[var(--text)] transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Terms Agreement */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border border-[var(--border)] cursor-pointer mt-0.5"
                    />
                    <span className="text-xs text-vision-slate-400">
                      I agree to the{" "}
                      <a
                        href="#"
                        className="text-vision-accent hover:underline"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-vision-accent hover:underline"
                      >
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                  {errors.agreeTerms && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.agreeTerms}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-[var(--border)] text-[var(--text)] font-bold py-3 px-4 rounded-2xl transition-all hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Back
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-2xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2",
                  step === 2 && "col-span-2",
                )}
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    {step === 1 ? "Continue..." : "Creating Account..."}
                  </>
                ) : (
                  <>
                    {step === 1 ? (
                      <>Continue</>
                    ) : (
                      <>
                        <UserCheck size={18} />
                        Create Account
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sign In Link */}
        <div className="text-center p-4 glass rounded-2xl">
          <p className="text-sm text-vision-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-vision-accent font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-vision-slate-400 text-center mt-6">
          We care about your privacy and data security
        </p>
      </div>
    </div>
  );
}
