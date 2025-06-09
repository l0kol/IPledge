
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode; // e.g., buttons or links in the card header
  icon?: React.ReactNode; // Optional icon for the card header
}

export const Card: React.FC<CardProps> = ({ title, children, className, actions, icon }) => {
  return (
    <div className={`bg-gray-800 shadow-lg rounded-xl p-6 ${className || ''}`}>
      {(title || actions || icon) && (
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            {icon && <span className="mr-2 text-indigo-400">{icon}</span>}
            {title && <h3 className="text-xl font-semibold text-white">{title}</h3>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
