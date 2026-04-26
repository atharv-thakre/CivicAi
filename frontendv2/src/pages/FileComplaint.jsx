import React, { useState, useRef } from 'react';
import { Card, SectionTitle, Button, MotionCard, Badge } from '@/src/components/ui';
import { Search, MapPin, Camera, CheckCircle, AlertCircle, ChevronRight, FileText, Plus } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { CATEGORIES } from '@/src/constants';

export default function FileComplaint() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: 'en',
    lat: '',
    lng: '',
    address: '',
    pincode: '',
    category: '',
    customCategory: '',
    media: null
  });
  const [step, setStep] = useState('DETERMINATION');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Mock duplicate data
  const duplicates = [
    { id: '342', title: 'Streetlight out', location: '12th Cross, Sector 4', status: 'Under Review' },
    { id: '112', title: 'Low voltage issues', location: 'Sector 4', status: 'Resolved' },
  ];

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, media: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setFormData(prev => ({ ...prev, media: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const latStr = latitude.toString();
      const lngStr = longitude.toString();
      
      setFormData(prev => ({ ...prev, lat: latStr, lng: lngStr }));

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        if (data) {
          setFormData(prev => ({
            ...prev,
            address: data.display_name || '',
            pincode: data.address?.postcode || ''
          }));
        }
      } catch (error) {
        console.error("Error detecting address:", error);
      } finally {
        setLocationLoading(false);
      }
    }, (error) => {
      console.error("Geolocation error:", error);
      setLocationLoading(false);
    });
  };

  const handleNext = () => {
    if (step === 'DETERMINATION') {
      setStep('FORM');
      detectLocation(); // Auto detect when moving to form
    } else if (step === 'FORM') {
      setIsSubmitting(true);
      // Simulate API call with the form data
      console.log('Submitting Complaint Data:', formData);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep('CONFIRMATION');
      }, 1500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 lg:py-12 pb-24">
      {/* Step Progress */}
      <div className="flex items-center justify-between mb-12 px-6">
        {[
          { icon: Search, label: 'Search' },
          { icon: FileText, label: 'Details' },
          { icon: CheckCircle, label: 'Done' }
        ].map((s, i) => (
          <React.Fragment key={s.label}>
            <div className="flex flex-col items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-lg",
                (i === 0 && step === 'DETERMINATION') || (i === 1 && step === 'FORM') || (i === 2 && step === 'CONFIRMATION')
                  ? "bg-vision-accent border-vision-accent text-white shadow-blue-500/20"
                  : i < (step === 'DETERMINATION' ? 0 : step === 'FORM' ? 1 : 2)
                    ? "bg-green-500 border-green-500 text-white"
                    : "glass border-black/5 dark:border-white/5 text-vision-slate-400"
              )}>
                <s.icon size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-vision-slate-400">{s.label}</span>
            </div>
            {i < 2 && <div className="flex-1 h-px bg-black/5 dark:bg-white/5 mx-6 -mt-8" />}
          </React.Fragment>
        ))}
      </div>

      {step === 'DETERMINATION' && (
        <MotionCard>
          <Card className="p-8 md:p-10 border-black/5 dark:border-white/5">
            <SectionTitle subtitle="Check if this issue has already been reported in your area.">
              Conflict Detection
            </SectionTitle>
            
            <div className="relative mt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vision-slate-400" />
              <input
                type="text"
                placeholder="Analyze issue... (e.g. Broken pipe)"
                className="w-full pl-12 pr-4 py-4 glass border-none rounded-2xl focus:ring-1 focus:ring-vision-accent/50 outline-none transition-all text-sm placeholder:text-vision-slate-400 uppercase tracking-tight font-bold"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            {formData.title.length > 2 && (
              <div className="mt-10 space-y-4 animate-in slide-in-from-top-4 duration-500">
                <p className="text-[10px] font-bold text-amber-500 flex items-center gap-2 uppercase tracking-[0.2em]">
                  <AlertCircle size={14} className="text-amber-500" />
                  Potential Overlap Detected
                </p>
                {duplicates.map((dup) => (
                  <div key={dup.id} className="p-5 rounded-2xl glass border-amber-500/20 bg-amber-500/5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-bold uppercase tracking-tight truncate">{dup.title}</p>
                      <p className="text-[10px] text-vision-slate-400 font-bold uppercase tracking-widest mt-1 truncate">{dup.location}</p>
                    </div>
                    <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none font-bold shrink-0">
                      {dup.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-10 flex flex-col gap-4">
              <Button onClick={handleNext} size="lg">
                Continue Setup
                <ChevronRight size={18} />
              </Button>
              <Button variant="outline" className="w-full text-vision-slate-400">
                Follow Existing Entry
              </Button>
            </div>
          </Card>
        </MotionCard>
      )}

      {step === 'FORM' && (
        <MotionCard>
          <Card className="p-8 md:p-10 space-y-10 border-black/5 dark:border-white/5">
            <SectionTitle subtitle="Provide details for rapid resolution.">
              Observation Data
            </SectionTitle>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-vision-slate-400 uppercase tracking-[0.2em] ml-1">Category</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                      className={cn(
                        "flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-300",
                        formData.category === cat.id
                          ? "border-vision-accent bg-vision-accent/10 shadow-lg shadow-blue-500/10 scale-[1.05]"
                          : "glass border-black/5 dark:border-white/5 text-vision-slate-400 hover:border-black/10 dark:hover:border-white/10"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                        formData.category === cat.id ? "bg-vision-accent text-white shadow-lg" : "bg-black/5 dark:bg-white/5"
                      )}>
                        <Plus size={18} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {formData.category === 'others' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-bold text-vision-slate-400 uppercase tracking-[0.2em] ml-1">Custom Category</label>
                  <input
                    type="text"
                    placeholder="Enter custom category name..."
                    className="w-full px-5 py-4 glass border-none rounded-2xl focus:ring-1 focus:ring-vision-accent/50 outline-none transition-all text-sm placeholder:text-vision-slate-400 font-medium"
                    value={formData.customCategory}
                    onChange={(e) => setFormData(prev => ({ ...prev, customCategory: e.target.value }))}
                  />
                </div>
              )}

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-vision-slate-400 uppercase tracking-[0.2em] ml-1">Observation Log</label>
                <textarea
                  rows={4}
                  placeholder="Insert detailed description here..."
                  className="w-full px-5 py-4 glass border-none rounded-2xl focus:ring-1 focus:ring-vision-accent/50 outline-none transition-all resize-none text-sm placeholder:text-vision-slate-400 font-medium"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-vision-slate-400 uppercase tracking-[0.2em] ml-1">Visual Evidence</label>
                <div className="flex flex-wrap gap-4">
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleMediaChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {!formData.media ? (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center w-28 h-28 rounded-2xl glass border-black/5 dark:border-white/5 text-vision-slate-400 hover:border-vision-accent/50 hover:text-vision-accent transition-all duration-300 group"
                    >
                      <Camera size={24} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[8px] mt-2 font-bold uppercase tracking-widest">Add Media</span>
                    </button>
                  ) : (
                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-vision-accent/30 group">
                      <img src={formData.media} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={removeMedia}
                        className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Plus size={12} className="rotate-45" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-vision-slate-400 uppercase tracking-[0.2em] ml-1">Location Details</label>
                <div className="space-y-3">
                  <div className="p-5 glass border-black/5 dark:border-white/5 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 bg-vision-accent/10 text-vision-accent rounded-xl border border-vision-accent/10">
                        <MapPin size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-[10px] font-bold uppercase tracking-widest">Address</h5>
                        <input 
                          className="bg-transparent border-none outline-none text-[10px] font-bold text-vision-slate-400 uppercase tracking-widest mt-1 w-full"
                          value={formData.address || (locationLoading ? 'Detecting...' : 'Not detected')}
                          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Detected Address"
                        />
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={detectLocation}
                      isLoading={locationLoading}
                      className="text-vision-accent font-bold text-[10px] uppercase tracking-widest"
                    >
                      Detect
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-4 glass border-black/5 dark:border-white/5 rounded-2xl">
                      <h5 className="text-[8px] font-bold text-vision-slate-400 uppercase tracking-widest">Pincode</h5>
                      <input 
                        className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest mt-1 w-full"
                        value={formData.pincode}
                        onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                        placeholder="Pincode"
                      />
                    </div>
                    <div className="p-4 glass border-black/5 dark:border-white/5 rounded-2xl">
                      <h5 className="text-[8px] font-bold text-vision-slate-400 uppercase tracking-widest">Latitude</h5>
                      <input 
                        className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest mt-1 w-full"
                        value={formData.lat}
                        readOnly
                        placeholder="Lat"
                      />
                    </div>
                    <div className="p-4 glass border-black/5 dark:border-white/5 rounded-2xl">
                      <h5 className="text-[8px] font-bold text-vision-slate-400 uppercase tracking-widest">Longitude</h5>
                      <input 
                        className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest mt-1 w-full"
                        value={formData.lng}
                        readOnly
                        placeholder="Lng"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleNext} 
              isLoading={isSubmitting}
              size="lg"
              className="w-full"
            >
              Submit Observation
            </Button>
          </Card>
        </MotionCard>
      )}

      {step === 'CONFIRMATION' && (
        <MotionCard>
          <Card className="p-10 text-center space-y-8 border-black/5 dark:border-white/5 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-vision-accent to-transparent"></div>
            <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20 border border-green-500/20">
              <CheckCircle size={48} className="animate-in zoom-in duration-500" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold uppercase tracking-tight">Report Received</h2>
              <p className="text-vision-slate-400 text-xs font-bold uppercase tracking-widest max-w-sm mx-auto leading-loose">
                Data initialized successfully. Your report is now active in the system.
              </p>
            </div>
            
            <div className="py-6 px-10 glass rounded-3xl inline-block">
              <p className="text-[8px] font-bold text-vision-slate-400 uppercase tracking-[0.3em] mb-1">Ticket Reference</p>
              <p className="text-2xl font-bold text-vision-accent tracking-tighter uppercase">#VX-829472</p>
            </div>

            <div className="pt-6 flex flex-col gap-4">
              <Button onClick={() => window.location.href = '/complaints'} size="lg">
                View Status
              </Button>
              <Button variant="outline" onClick={() => setStep('DETERMINATION')} className="w-full text-vision-slate-400 text-xs font-bold uppercase tracking-widest">
                New Report
              </Button>
            </div>
          </Card>
        </MotionCard>
      )}
    </div>
  );
}
