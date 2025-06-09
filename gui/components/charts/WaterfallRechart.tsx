
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { CHART_COLORS } from '../../constants';
import { FundingStageData } from '../../types';

interface WaterfallRechartProps {
  data: FundingStageData[]; // Expecting data structured for waterfall
  title?: string;
}

// This is a simplified waterfall. True waterfall often requires more complex data manipulation.
// Here, we'll represent different aspects as stacked or grouped bars.
// For a true waterfall, one might use multiple Bar components or custom shapes.

export const WaterfallRechart: React.FC<WaterfallRechartProps> = ({ data, title }) => {
  return (
    <div className="h-80 w-full">
      {title && <h4 className="text-lg font-medium text-gray-300 mb-4 text-center">{title}</h4>}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
          <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
          <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: CHART_COLORS.background, border: `1px solid ${CHART_COLORS.grid}`, borderRadius: '0.5rem' }}
            itemStyle={{ color: '#E5E7EB' }}
            cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
          />
          <Legend wrapperStyle={{ color: '#D1D5DB', fontSize: '12px', paddingTop: '10px' }}/>
          <Bar dataKey="committed" stackId="a" fill={CHART_COLORS.primary} name="Committed" />
          <Bar dataKey="released" stackId="a" fill={CHART_COLORS.secondary} name="Released" />
          <Bar dataKey="escrow" fill={CHART_COLORS.tertiary} name="In Escrow" />
          <Bar dataKey="royaltiesAllocated" fill={CHART_COLORS.quaternary} name="Royalties Allocated" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
