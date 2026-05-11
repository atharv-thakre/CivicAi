import { useState } from 'react';
import StepDetermination from './StepDetermination';
import StepForm from './StepForm';
import StepConfirmation from './StepConfirmation';
import StepProgress from './StepProgress';

export default function FileComplaint() {
  const [step, setStep] = useState('DETERMINATION');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock duplicate data
  const duplicates = [
    { id: '342', title: 'Streetlight out', location: '12th Cross, Sector 4', status: 'Under Review' },
    { id: '112', title: 'Low voltage issues', location: 'Sector 4', status: 'Resolved' },
  ];

  const handleNext = () => {
    if (step === 'DETERMINATION') setStep('FORM');
    else if (step === 'FORM') {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep('CONFIRMATION');
      }, 1500);
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
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          handleNext={handleNext}
          isSubmitting={isSubmitting}
        />
      )}

      {step === 'CONFIRMATION' && (
        <StepConfirmation setStep={setStep} />
      )}
    </div>
  );
}
