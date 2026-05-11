import { AlertCircle, CheckCircle, Loader, UserCheck } from "lucide-react";
import PersonalInfoStep from "./PersonalInfoStep";
import SecurityStep from "./SecurityStep";
import { cn } from "@/src/lib/utils";

export default function SignupForm({
  step,
  formData,
  handleChange,
  handleNext,
  handleSubmit,
  loading,
  errors,
  error,
  success,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  passwordStrength,
  getPasswordStrengthColor,
  getPasswordStrengthText,
  setStep
}) {
  return (
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
        {step === 1 ? (
          <PersonalInfoStep 
            formData={formData} 
            handleChange={handleChange} 
            errors={errors} 
          />
        ) : (
          <SecurityStep 
            formData={formData} 
            handleChange={handleChange} 
            errors={errors}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            passwordStrength={passwordStrength}
            getPasswordStrengthColor={getPasswordStrengthColor}
            getPasswordStrengthText={getPasswordStrengthText}
          />
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
  );
}
