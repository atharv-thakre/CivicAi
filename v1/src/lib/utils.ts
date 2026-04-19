import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const LANGUAGES = [
  { label: 'English', value: 'English' },
  { label: 'Hindi (हिन्दी)', value: 'Hindi' },
  { label: 'Marathi (मराठी)', value: 'Marathi' },
  { label: 'Gujarati (ગુજરાતી)', value: 'Gujarati' },
  { label: 'Tamil (தமிழ்)', value: 'Tamil' },
  { label: 'Telugu (తెలుగు)', value: 'Telugu' },
  { label: 'Kannada (ಕನ್ನಡ)', value: 'Kannada' },
  { label: 'Malayalam (മലയാളം)', value: 'Malayalam' },
  { label: 'Bengali (বাংলা)', value: 'Bengali' },
];

export const COMPLAINT_CATEGORIES = [
  'Potholes & Roads',
  'Garbage & Sanitation',
  'Street Lights',
  'Water Supply',
  'Encroachment',
  'Public Transport',
  'Others'
];
