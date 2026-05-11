import { useRef, useState } from 'react';
import { Card, SectionTitle, Button, MotionCard } from '@/src/components/ui';
import { Camera, MapPin, Plus, Loader2, AlertCircle, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { CATEGORIES } from '@/src/constants';

export default function StepForm({ formData, setFormData, selectedCategory, setSelectedCategory, handleNext, isSubmitting, error }) {
  const fileInputRef = useRef(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const detectLocation = () => {
    setIsDetectingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: prev.address || 'Detected Location'
          }));
          setIsDetectingLocation(false);
        },
        (error) => {
          console.error("Error detecting location:", error);
          setIsDetectingLocation(false);
        }
      );
    } else {
      setIsDetectingLocation(false);
    }
  };

  return (
    <MotionCard>
      <Card className="p-8 md:p-10 space-y-10 border-black/5 dark:border-white/5">
        <SectionTitle subtitle="Provide details for rapid resolution.">
          Observation Data
        </SectionTitle>

        <div className="space-y-8">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold uppercase tracking-tight">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-vision-slate-400 uppercase tracking-[0.2em] ml-1">Subject</label>
            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Brief title of the issue..."
              className="w-full px-5 py-4 glass border-none rounded-2xl focus:ring-1 focus:ring-vision-accent/50 outline-none transition-all text-sm placeholder:text-vision-slate-400 font-bold uppercase tracking-tight"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-vision-slate-400 uppercase tracking-[0.2em] ml-1">Category</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-300",
                    selectedCategory === cat.id
                      ? "border-vision-accent bg-vision-accent/10 shadow-lg shadow-blue-500/10 scale-[1.05]"
                      : "glass border-black/5 dark:border-white/5 text-vision-slate-400 hover:border-black/10 dark:hover:border-white/10"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    selectedCategory === cat.id ? "bg-vision-accent text-white shadow-lg" : "bg-black/5 dark:bg-white/5"
                  )}>
                    <Plus size={18} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-vision-slate-400 uppercase tracking-[0.2em] ml-1">Observation Log</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Insert detailed description here..."
              className="w-full px-5 py-4 glass border-none rounded-2xl focus:ring-1 focus:ring-vision-accent/50 outline-none transition-all resize-none text-sm placeholder:text-vision-slate-400 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-vision-slate-400 uppercase tracking-[0.2em] ml-1">Address</label>
              <input
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address..."
                className="w-full px-5 py-4 glass border-none rounded-2xl focus:ring-1 focus:ring-vision-accent/50 outline-none transition-all text-sm placeholder:text-vision-slate-400 font-medium"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-vision-slate-400 uppercase tracking-[0.2em] ml-1">Pincode</label>
              <input
                name="pincode"
                type="text"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="6-digit code..."
                className="w-full px-5 py-4 glass border-none rounded-2xl focus:ring-1 focus:ring-vision-accent/50 outline-none transition-all text-sm placeholder:text-vision-slate-400 font-medium"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-vision-slate-400 uppercase tracking-[0.2em] ml-1">Visual Evidence</label>
            <div className="flex gap-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
              {previewUrl ? (
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-vision-accent/30 shadow-lg">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => { setPreviewUrl(null); setFormData(prev => ({ ...prev, image: null })); }}
                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="flex flex-col items-center justify-center w-28 h-28 rounded-2xl glass border-black/5 dark:border-white/5 text-vision-slate-400 hover:border-vision-accent/50 hover:text-vision-accent transition-all duration-300 group"
                >
                  <Camera size={24} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] mt-2 font-bold uppercase tracking-widest">Add Media</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-5 glass border-black/5 dark:border-white/5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-vision-accent/10 text-vision-accent rounded-xl border border-vision-accent/10">
                <MapPin size={24} />
              </div>
              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-widest">Context Location</h5>
                <p className="text-[9px] font-bold text-vision-slate-400 uppercase tracking-widest mt-1">
                  {formData.lat ? `${formData.lat.toFixed(4)}, ${formData.lng.toFixed(4)}` : "Location not detected"}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-vision-accent font-bold text-[10px] uppercase tracking-widest"
              onClick={detectLocation}
              disabled={isDetectingLocation}
            >
              {isDetectingLocation ? <Loader2 size={14} className="animate-spin" /> : 'Detect'}
            </Button>
          </div>
        </div>

        <Button 
          onClick={handleNext} 
          isLoading={isSubmitting}
          size="lg"
          className="w-full"
          disabled={!selectedCategory || !formData.image || !formData.description || !formData.address || !formData.pincode}
        >
          Submit Observation
        </Button>
      </Card>
    </MotionCard>
  );
}
