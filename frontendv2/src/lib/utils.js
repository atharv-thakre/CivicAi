import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function getStatusColor(status) {
  switch (status) {
    case 'Resolved':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'Under Review':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Filed':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Rejected':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'In Progress':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
}
