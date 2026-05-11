import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield } from "lucide-react";
import SignupForm from "./SignupForm";
import { cn } from "@/src/lib/utils";
import { useAuth } from "@/src/contexts/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
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
    handle: "",
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
    if (!formData.handle.trim()) {
      newErrors.handle = "Username is required";
    } else if (formData.handle.length < 2 || formData.handle.length > 16) {
      newErrors.handle = "Username must be between 2 and 16 characters";
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
      const result = await signup({
        email: formData.email,
        password: formData.password,
        handle: formData.handle,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        role: "user"
      });

      if (result.success) {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError(result.error);
      }
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
            <p className="text-sm text-vision-slate-400 mt-1">Join the movement</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          <div className={cn("h-1.5 flex-1 rounded-full transition-all", step >= 1 ? "bg-vision-accent" : "bg-[var(--border)]")} />
          <div className={cn("h-1.5 flex-1 rounded-full transition-all", step >= 2 ? "bg-vision-accent" : "bg-[var(--border)]")} />
        </div>

        <SignupForm 
          step={step}
          formData={formData}
          handleChange={handleChange}
          handleNext={handleNext}
          handleSubmit={handleSubmit}
          loading={loading}
          errors={errors}
          error={error}
          success={success}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          passwordStrength={passwordStrength}
          getPasswordStrengthColor={getPasswordStrengthColor}
          getPasswordStrengthText={getPasswordStrengthText}
          setStep={setStep}
        />

        {/* Sign In Link */}
        <div className="text-center p-4 glass rounded-2xl">
          <p className="text-sm text-vision-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-vision-accent font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
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
