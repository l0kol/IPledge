
import React from 'react';
import { Project, IPConstellationData } from '../../types';
import { getMockIPConstellationData } from '../../services/mockDataService';
import { Zap, Link, ShieldAlert, Package, Info } from 'lucide-react'; // Removed 'Tooltip as LucideTooltip'
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { CHART_COLORS, RISK_LEVEL_COLORS } from '../../constants';

interface IPRiskConstellationViewProps {
  project: Project;
}

const CustomTooltipContent: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-700 p-3 rounded-md shadow-lg border border-gray-600 text-xs">
        <p className="font-bold text-indigo-400">{data.name}</p>
        <p>Type: <span className="capitalize">{data.type.replace('_', ' ')}</span></p>
        <p>Value: ${data.value.toLocaleString()}</p>
        {data.riskLevel && <p>Risk: <span className={`capitalize font-semibold ${data.riskLevel === 'high' ? 'text-red-400' : data.riskLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>{data.riskLevel}</span></p>}
      </div>
    );
  }
  return null;
};


export const IPRiskConstellationView: React.FC<IPRiskConstellationViewProps> = ({ project }) => {
  const constellationData = getMockIPConstellationData(project);

  // Simple 2D projection for ScatterChart
  const chartData = constellationData.nodes.map((node, index) => ({
    x: Math.random() * 100, // Random positions for visualization
    y: Math.random() * 100,
    z: node.value, // Size of bubble based on value
    ...node,
  }));
  
  const riskColorMapping = {
    low: 'fill-green-500',
    medium: 'fill-yellow-500',
    high: 'fill-red-500',
  };


  return (
    <div className="h-full w-full flex flex-col">
        <div className="flex items-center text-xs text-gray-400 mb-2">
            <Info size={14} className="mr-1 text-indigo-400"/>
            Conceptual 2D representation of IP risk network. Bubble size indicates value.
        </div>
        <ResponsiveContainer width="100%" height="90%">
            <ScatterChart
            margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
            }}
            >
            <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3"/>
            <XAxis type="number" dataKey="x" name="X Dimension" unit="" hide/>
            <YAxis type="number" dataKey="y" name="Y Dimension" unit="" hide/>
            <ZAxis type="number" dataKey="z" range={[100, 1000]} name="Value" unit="$" />
            <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltipContent />} />
            <Legend wrapperStyle={{fontSize: "10px"}}/>
            <Scatter name="Project" data={chartData.filter(d => d.type === 'project')} fill={CHART_COLORS.primary}>
                {chartData.filter(d => d.type === 'project').map((entry, index) => (
                    <circle key={`cell-${index}`} />
                ))}
            </Scatter>
            <Scatter name="IP Assets" data={chartData.filter(d => d.type === 'ip_asset')} fill={CHART_COLORS.secondary}>
                 {chartData.filter(d => d.type === 'ip_asset').map((entry, index) => (
                    <circle key={`cell-${index}`} className={entry.riskLevel ? riskColorMapping[entry.riskLevel] : CHART_COLORS.secondary} />
                ))}
            </Scatter>
            {/* Lines for links - This is tricky in Recharts Scatter, often needs custom SVG or a different library like D3 for proper network graphs.
                For simplicity, links are not visually drawn here but are part of constellationData. */}
            </ScatterChart>
        </ResponsiveContainer>
        <div className="text-xs text-gray-500 mt-2">
            Central Node: {constellationData.nodes.find(n=>n.type==='project')?.name}.
            Orbiting Nodes: {constellationData.nodes.filter(n=>n.type==='ip_asset').length} IP Assets.
            Link strength (not visually represented): based on revenue dependency.
        </div>
    </div>
  );
};
