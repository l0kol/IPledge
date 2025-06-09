
import React from 'react';
import { Project, ValuationPoint } from '../../types';
import { mockValuationTimelineData } from '../../services/mockDataService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../../constants';
import { TrendingUp } from 'lucide-react';

interface IPValuationTimelineViewProps {
  project: Project; // Selected project might influence this data
}

export const IPValuationTimelineView: React.FC<IPValuationTimelineViewProps> = ({ project }) => {
  // Using general mock data, could be tailored by project's IP assets
  const data: ValuationPoint[] = mockValuationTimelineData;

  return (
    <div className="h-96 w-full">
      <h5 className="text-md font-medium text-gray-300 mb-4 flex items-center">
        <TrendingUp size={18} className="mr-2 text-indigo-400"/>
        IP Valuation Over Time (Sample)
      </h5>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF" 
            tick={{ fontSize: 10 }}
            tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
          />
          <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ backgroundColor: CHART_COLORS.background, border: `1px solid ${CHART_COLORS.grid}`, borderRadius: '0.5rem' }}
            itemStyle={{ color: '#E5E7EB', fontSize: '12px' }}
            formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
            labelFormatter={(label: string) => new Date(label).toLocaleDateString()}
            cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
          />
          <Legend wrapperStyle={{ color: '#D1D5DB', fontSize: '12px', paddingTop: '10px' }}/>
          <Line type="monotone" dataKey="historical" stroke={CHART_COLORS.primary} strokeWidth={2} dot={{r:3}} name="Historical Revenue"/>
          <Line type="monotone" dataKey="projected" stroke={CHART_COLORS.secondary} strokeDasharray="5 5" strokeWidth={2} dot={{r:3}} name="Projected Returns"/>
          <Line type="monotone" dataKey="marketComparable" stroke={CHART_COLORS.tertiary} strokeDasharray="2 8" strokeWidth={2} dot={{r:3}} name="Market Comparables"/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
