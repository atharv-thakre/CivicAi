import { Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function SecurityStep({ 
  formData, 
  handleChange, 
  errors, 
  showPassword, 
  setShowPassword, 
  showConfirmPassword, 
  setShowConfirmPassword,
  passwordStrength,
  getPasswordStrengthColor,
  getPasswordStrengthText
}) {
  return (
    <>
      <div>
        <label htmlFor="password" className="block text-sm font-semibold mb-2">
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
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">
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
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-vision-slate-400 hover:text-[var(--text)] transition-colors"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
        )}
      </div>

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
            <a href="#" className="text-vision-accent hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-vision-accent hover:underline">
              Privacy Policy
            </a>
          </span>
        </label>
        {errors.agreeTerms && (
          <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>
        )}
      </div>
    </>
  );
}
