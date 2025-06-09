
import React from 'react';
import { Project, BackerSegment, BackerType, GeographicDataPoint } from '../../types';
import { RadialProgressChart } from '../charts/RadialProgressChart';
import { mockBackerSegments, mockGeographicData } from '../../services/mockDataService'; // Using general mock data for now
import { Users, Globe, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CHART_COLORS } from '../../constants';

interface BackerAnalyticsPanelProps {
  project: Project;
}

const DemographicFunnel: React.FC = () => {
  const funnelData = [
    { name: 'Visited Site', value: 1000, color: '#A78BFA' }, // violet-400
    { name: 'Viewed Project', value: 600, color: '#8B5CF6' }, // violet-500
    { name: 'Pledged Funds', value: 250, color: '#7C3AED' },  // violet-600
    { name: 'Funded', value: 150, color: '#6D28D9' },       // violet-700
  ];

  return (
    <div className="mt-6">
      <h5 className="text-sm font-medium text-gray-300 mb-2 flex items-center"><TrendingUp size={16} className="mr-2 text-indigo-400"/>Demographic Funnel</h5>
      <div className="space-y-2">
        {funnelData.map((stage, index) => (
          <div key={stage.name} className="flex items-center">
            <div className="w-28 text-xs text-gray-400 truncate pr-2">{stage.name}</div>
            <div className="flex-1 bg-gray-700 rounded h-6">
              <div
                style={{ width: `${(stage.value / funnelData[0].value) * 100}%`, backgroundColor: stage.color }}
                className="h-6 rounded text-white text-xs flex items-center justify-end pr-2"
              >
                {stage.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export const BackerAnalyticsPanel: React.FC<BackerAnalyticsPanelProps> = ({ project }) => {
  const totalBackers = project.backers.individuals + project.backers.daos + project.backers.vcs;

  // Transform project.backers into BackerSegment[]
  const backerSegmentsData: BackerSegment[] = [
    { name: BackerType.INDIVIDUAL, value: project.backers.individuals },
    { name: BackerType.DAO, value: project.backers.daos },
    { name: BackerType.VC, value: project.backers.vcs },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-md font-medium text-gray-300 mb-2 flex items-center"><Users size={18} className="mr-2 text-indigo-400"/>Backer Segmentation</h4>
        <RadialProgressChart data={backerSegmentsData} />
        <p className="text-center text-sm text-gray-400 mt-2">Total Backers: {totalBackers}</p>
      </div>
      
      <div className="mt-6">
        <h5 className="text-sm font-medium text-gray-300 mb-2 flex items-center"><Globe size={16} className="mr-2 text-indigo-400"/>Geographic Distribution (Sample)</h5>
        <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockGeographicData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false}/>
                    <XAxis type="number" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="region" type="category" stroke="#9CA3AF" tick={{ fontSize: 10, width: 80 }} width={80} />
                    <Tooltip
                        contentStyle={{ backgroundColor: CHART_COLORS.background, border: `1px solid ${CHART_COLORS.grid}`, borderRadius: '0.5rem' }}
                        itemStyle={{ color: '#E5E7EB' }}
                        cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                    />
                    <Bar dataKey="backers" fill={CHART_COLORS.primary} barSize={10} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
      
      <DemographicFunnel />
    </div>
  );
};
