
import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, className }) => {
  return (
    <div className={`mb-8 ${className || ''}`}>
      <h2 className="text-3xl font-bold text-white tracking-tight">{title}</h2>
      {subtitle && <p className="mt-2 text-lg text-gray-400">{subtitle}</p>}
    </div>
  );
};
