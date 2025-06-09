
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../../constants';

interface DataPoint {
  name: string; // e.g., month
  revenue: number;
  threshold: number;
}

interface DualAxisLineRechartProps {
  data: DataPoint[];
  title?: string;
}

export const DualAxisLineRechart: React.FC<DualAxisLineRechartProps> = ({ data, title }) => {
  return (
    <div className="h-80 w-full">
      {title && <h4 className="text-lg font-medium text-gray-300 mb-4 text-center">{title}</h4>}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
          <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" stroke={CHART_COLORS.primary} tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" stroke={CHART_COLORS.secondary} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: CHART_COLORS.background, border: `1px solid ${CHART_COLORS.grid}`, borderRadius: '0.5rem' }}
            itemStyle={{ color: '#E5E7EB' }}
             cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
          />
          <Legend wrapperStyle={{ color: '#D1D5DB', fontSize: '12px', paddingTop: '10px' }} />
          <Line yAxisId="left" type="monotone" dataKey="revenue" stroke={CHART_COLORS.primary} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Historical Revenue"/>
          <Line yAxisId="right" type="monotone" dataKey="threshold" stroke={CHART_COLORS.secondary} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Collateral Threshold" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
