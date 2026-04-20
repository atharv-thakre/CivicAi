import { UserColor } from './types';

export const USER_COLORS: UserColor[] = [
  { bg: '#EFF6FF', text: '#1E40AF', light: '#DBEAFE', hex: '#2563EB' }, // Blue
  { bg: '#FDF2F8', text: '#9D174D', light: '#FCE7F3', hex: '#DB2777' }, // Pink
  { bg: '#ECFDF5', text: '#065F46', light: '#D1FAE5', hex: '#059669' }, // Emerald
  { bg: '#FFF7ED', text: '#9A3412', light: '#FFEDD5', hex: '#EA580C' }, // Orange
  { bg: '#F0F9FF', text: '#075985', light: '#E0F2FE', hex: '#0284C7' }, // Sky
  { bg: '#F5F3FF', text: '#5B21B6', light: '#EDE9FE', hex: '#7C3AED' }, // Violet
];

export const getInitials = (name: string) => {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};

const userColorMap: Record<string, UserColor> = {};
let colorIndex = 0;

export const getUserColor = (user: string): UserColor => {
  if (!userColorMap[user]) {
    userColorMap[user] = USER_COLORS[colorIndex % USER_COLORS.length];
    colorIndex++;
  }
  return userColorMap[user];
};
