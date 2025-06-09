
import React from 'react'; // Required for JSX, even if not directly used in simple constants

export const APP_NAME = "IPFlow";

export const CHART_COLORS = {
  primary: '#8B5CF6', // violet-500
  secondary: '#EC4899', // pink-500
  tertiary: '#10B981', // emerald-500
  quaternary: '#F59E0B', // amber-500
  neutral: '#6B7280', // gray-500
  background: '#374151', // gray-700 (for chart backgrounds)
  grid: '#4B5563', // gray-600 (for chart grids)
};

export const RISK_LEVEL_COLORS: { [key: string]: string } = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
};

// Example Icon (can be expanded)
export const InfoIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);
