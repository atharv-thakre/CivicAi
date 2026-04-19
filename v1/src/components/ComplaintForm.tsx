import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, 
  Languages, 
  Wand2, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown,
  Info,
  Image as ImageIcon,
  Trash2,
  Camera,
  Plus
} from "lucide-react";
import { cn, LANGUAGES, COMPLAINT_CATEGORIES } from "../lib/utils";
import { polishComplaint } from "../services/gemini";
import { getCurrentLocation, LocationData } from "../utils/location";

const complaintSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().min(20, "Please describe the issue in more detail (min 20 chars)").max(2000),
  category: z.string().min(1, "Please select a category"),
  language: z.string(),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  address: z.string().min(10, "Please provide a more specific address"),
  images: z.array(z.string()).optional(),
});

type ComplaintFormData = z.infer<typeof complaintSchema>;

export default function ComplaintForm() {
  const [isPolishing, setIsPolishing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [success, setSuccess] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      language: "English",
      category: COMPLAINT_CATEGORIES[0]
    }
  });

  const description = watch("description");
  const currentLanguage = watch("language");

  const handleAutoLocate = async () => {
    setIsLocating(true);
    try {
      const loc = await getCurrentLocation();
      setLocation(loc);
      // In a real app, we'd reverse geocode here. 
      // For this demo, we'll just set a placeholder or let them know it's captured.
    } catch (error) {
      console.error(error);
    } finally {
      setIsLocating(false);
    }
  };

  const handleAIPolish = async () => {
    const titleValue = watch("title");
    const descValue = watch("description");

    if (!titleValue || !descValue) return;

    setIsPolishing(true);
    try {
      const polished = await polishComplaint({
        title: titleValue,
        description: descValue,
        language: currentLanguage
      });
      setValue("title", polished.title);
      setValue("description", polished.description);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPolishing(false);
    }
  };

  const onSubmit = async (data: ComplaintFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 2000));
    console.log("Submitted:", { ...data, location, images: imagePreviews });
    setIsSubmitting(false);
    setSuccess(true);
    reset();
    setLocation(null);
    setImagePreviews([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file as Blob);
    });
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto card-form text-center"
      >
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-accent" />
        </div>
        <h2 className="text-2xl font-black text-ink mb-2 uppercase tracking-tight">Report Received</h2>
        <p className="text-muted mb-8 font-medium">
          Your complaint ID is #CIV-{Math.floor(Math.random() * 100000)}. 
          Thank you for taking action in your community.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="btn-primary"
        >
          <span>Submit Another</span>
          <span>→</span>
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="card-form space-y-6">
        {/* Language & Header */}
        <div>
          <label className="label-caps">Language Support</label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.slice(0, 6).map(lang => (
              <button
                key={lang.value}
                type="button"
                onClick={() => setValue("language", lang.value)}
                className={cn(
                  "px-[14px] py-[6px] rounded-full text-[13px] font-semibold border transition-all",
                  currentLanguage === lang.value 
                    ? "bg-primary text-white border-primary" 
                    : "bg-bg text-ink border-border hover:border-primary/50"
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Complaint Details */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="label-caps">Category</label>
              <select 
                {...register("category")}
                className="input-styled appearance-none"
              >
                {COMPLAINT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="label-caps">Pincode</label>
              <input 
                {...register("pincode")}
                placeholder="6-digit pincode"
                className={cn("input-styled", errors.pincode && "border-red-500")}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="label-caps">Subject of Complaint</label>
            <input 
              {...register("title")}
              placeholder="e.g. Sewage overflow near park gate"
              className={cn("input-styled font-semibold", errors.title && "border-red-500")}
            />
            {errors.title && <p className="text-[10px] uppercase font-bold text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div className="space-y-1 relative">
            <div className="flex justify-between items-center mb-1">
              <label className="label-caps mb-0">Description</label>
            </div>
            <div className="relative">
              <textarea 
                {...register("description")}
                rows={4}
                placeholder="Tell us what's happening..."
                className={cn("input-styled resize-none", errors.description && "border-red-500")}
              />
              <button 
                type="button"
                onClick={handleAIPolish}
                disabled={isPolishing || !description}
                className="absolute right-3 top-3 bg-ink text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-primary transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {isPolishing ? <Loader2 className="w-3 h-3 animate-spin" /> : "✨ AI Summarize"}
              </button>
              <div className="text-[10px] text-muted text-right mt-1 font-mono">
                {description?.length || 0} / 2000
              </div>
            </div>
            {errors.description && <p className="text-[10px] uppercase font-bold text-red-500 mt-1">{errors.description.message}</p>}
          </div>
        </section>

        {/* Location Section */}
        <section className="space-y-4">
          <div className="space-y-1">
            <label className="label-caps">Evidence (Photos)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <AnimatePresence>
                {imagePreviews.map((src, idx) => (
                  <motion.div 
                    key={src}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative aspect-square rounded-xl overflow-hidden border border-border group"
                  >
                    <img src={src} alt="Upload preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1.5 bg-ink/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {imagePreviews.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-muted hover:text-primary">
                  <Camera className="w-6 h-6" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Add Photo</span>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                  />
                </label>
              )}
            </div>
            <p className="text-[10px] text-muted italic mt-2">Up to 5 images clearly showing the issue.</p>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center mb-1">
              <label className="label-caps mb-0">Street Address / Area</label>
              <button 
                type="button"
                onClick={handleAutoLocate}
                disabled={isLocating}
                className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-wider"
              >
                {isLocating ? "Detecting..." : "Autodetect"}
              </button>
            </div>
            <input 
              {...register("address")}
              placeholder="Near building X, cross road Y..."
              className={cn("input-styled", errors.address && "border-red-500")}
            />
          </div>
        </section>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? (
            <span className="mx-auto flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </span>
          ) : (
            <>
              <span>SUBMIT REPORT</span>
              <span>→</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
