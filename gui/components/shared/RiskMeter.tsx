
import React from 'react';
import { RISK_LEVEL_COLORS } from '../../constants';

interface RiskMeterProps {
  score: number; // 0 to 1
  label?: string;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ score, label = "Risk Level" }) => {
  const percentage = Math.max(0, Math.min(100, Math.round(score * 100)));
  let riskCategory: 'low' | 'medium' | 'high' = 'low';
  let color = RISK_LEVEL_COLORS.low;

  if (percentage > 70) {
    riskCategory = 'high';
    color = RISK_LEVEL_COLORS.high;
  } else if (percentage > 40) {
    riskCategory = 'medium';
    color = RISK_LEVEL_COLORS.medium;
  }

  return (
    <div className="w-full">
      {label && <div className="text-sm font-medium text-gray-400 mb-1">{label}</div>}
      <div className="flex items-center space-x-2">
        <div className="w-full bg-gray-600 rounded-full h-2.5">
          <div
            className={`${color} h-2.5 rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className={`text-sm font-semibold ${
            riskCategory === 'high' ? 'text-red-400' : riskCategory === 'medium' ? 'text-yellow-400' : 'text-green-400'
          }`}>{percentage}%</span>
      </div>
      <div className="text-xs text-gray-500 mt-1 capitalize text-right">{riskCategory} Risk</div>
    </div>
  );
};
