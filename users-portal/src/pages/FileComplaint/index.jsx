import { useState } from 'react';
import StepDetermination from './StepDetermination';
import StepForm from './StepForm';
import StepConfirmation from './StepConfirmation';
import StepProgress from './StepProgress';
import { useAuth } from '@/src/contexts/AuthContext';
import { API_BASE_URL } from '@/src/constants';

export default function FileComplaint() {
  const [step, setStep] = useState('DETERMINATION');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lat: 28.6139,
    lng: 77.2090,
    address: '',
    pincode: '',
    category: '',
    image: null
  });

  const [error, setError] = useState(null);

  // Mock duplicate data
  const duplicates = [
    { id: '342', title: 'Streetlight out', location: '12th Cross, Sector 4', status: 'Under Review' },
    { id: '112', title: 'Low voltage issues', location: 'Sector 4', status: 'Resolved' },
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('title', formData.title || searchQuery);
      data.append('description', formData.description);
      data.append('lat', formData.lat.toString());
      data.append('lng', formData.lng.toString());
      data.append('address', formData.address);
      data.append('pincode', formData.pincode);
      data.append('category', selectedCategory);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await fetch(`${API_BASE_URL}/complaint/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to submit complaint');
      }

      setStep('CONFIRMATION');
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step === 'DETERMINATION') {
      setFormData(prev => ({ ...prev, title: searchQuery }));
      setStep('FORM');
    }
    else if (step === 'FORM') {
      handleSubmit();
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 lg:py-12 pb-24">
      <StepProgress step={step} />

      {step === 'DETERMINATION' && (
        <StepDetermination 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleNext={handleNext}
          duplicates={duplicates}
        />
      )}

      {step === 'FORM' && (
        <StepForm 
          formData={formData}
          setFormData={setFormData}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          handleNext={handleNext}
          isSubmitting={isSubmitting}
          error={error}
        />
      )}

      {step === 'CONFIRMATION' && (
        <StepConfirmation setStep={setStep} />
      )}
    </div>
  );
}

