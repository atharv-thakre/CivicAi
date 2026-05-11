import { User, Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function PersonalInfoStep({ formData, handleChange, errors }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-semibold mb-2">
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
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-semibold mb-2">
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
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold mb-2">
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

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold mb-2">
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

      <div>
        <label htmlFor="address" className="block text-sm font-semibold mb-2">
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
  );
}
