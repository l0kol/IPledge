
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CHART_COLORS } from '../../constants';
import { BackerSegment } from '../../types';

interface RadialProgressChartProps {
  data: BackerSegment[];
  title?: string;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = <T extends { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number; index: number; name: string }>(
    { cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: T
) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't render label if too small

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12">
            {`${name} (${(percent * 100).toFixed(0)}%)`}
        </text>
    );
};


export const RadialProgressChart: React.FC<RadialProgressChartProps> = ({ data, title }) => {
  const colors = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.tertiary, CHART_COLORS.quaternary];

  return (
    <div className="h-72 w-full">
      {title && <h4 className="text-lg font-medium text-gray-300 mb-2 text-center">{title}</h4>}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            contentStyle={{ backgroundColor: CHART_COLORS.background, border: `1px solid ${CHART_COLORS.grid}`, borderRadius: '0.5rem' }}
            itemStyle={{ color: '#E5E7EB' }}
          />
          <Legend iconType="circle" wrapperStyle={{ color: '#D1D5DB', fontSize: '12px', paddingTop: '10px' }} />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
