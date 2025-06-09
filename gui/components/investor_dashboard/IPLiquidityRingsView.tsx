
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Project, LiquidityRingsData } from '../../types';
import { mockLiquidityRingsData } from '../../services/mockDataService';
import { Layers } from 'lucide-react';

interface IPLiquidityRingsViewProps {
  project: Project; // Selected project might influence this data in a real app
}

export const IPLiquidityRingsView: React.FC<IPLiquidityRingsViewProps> = ({ project }) => {
  // Using general mock data, but it could be tailored by project
  const data: LiquidityRingsData = mockLiquidityRingsData;

  // For concentric rings, we'll render multiple Pie components.
  // This is a simplified representation.
  const outerRadiusBase = 80;
  const radiusStep = 30; // Step for inner/outer radius of each ring

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <h5 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
        <Layers size={16} className="mr-2 text-indigo-400"/>Liquidity Overview
      </h5>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Tooltip 
             contentStyle={{ backgroundColor: '#374151', border: '1px solid #4B5563', borderRadius: '0.5rem' }}
             itemStyle={{ color: '#E5E7EB', fontSize: '12px' }}
          />
          {data.layers.map((layer, index) => (
            <Pie
              key={layer.name}
              data={[{ name: layer.name, value: layer.value }]} // Each Pie represents one layer
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={outerRadiusBase - (index + 1) * radiusStep + 5} // Smaller index = outer ring
              outerRadius={outerRadiusBase - index * radiusStep}
              fill={layer.color}
              paddingAngle={2}
              label={({ name, value }) => `${name}: $${(value/1000).toFixed(0)}k`} // Simple label
              labelLine={false}
            >
                <Cell fill={layer.color} />
            </Pie>
          ))}
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 text-xs text-center text-gray-400">
        {data.layers.map(l => (
            <span key={l.name} className="inline-flex items-center mr-3">
                <span className="w-2 h-2 rounded-full mr-1" style={{backgroundColor: l.color}}></span>
                {l.name}
            </span>
        ))}
      </div>
    </div>
  );
};
