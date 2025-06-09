
import React from 'react';
import { SectionHeader } from '../core/SectionHeader';
import { Card } from '../core/Card';
import { IPRiskConstellationView } from './IPRiskConstellationView';
import { IPLiquidityRingsView } from './IPLiquidityRingsView';
import { IPValuationTimelineView } from './IPValuationTimelineView';
import { PortfolioMetricsSuite } from './PortfolioMetricsSuite';
import { mockProjects, getMockProjectById } from '../../services/mockDataService';
import { Project } from '../../types';

export const InvestorDashboardView: React.FC = () => {
  const [selectedProject, setSelectedProject] = React.useState<Project>(mockProjects[0] || getMockProjectById('proj1')!);

  if (!selectedProject) {
    return <div className="text-center p-8">No project data available for investor view.</div>;
  }

  return (
    <div className="space-y-8">
      <SectionHeader title="Investor Dashboard" subtitle="Analyze your IP-backed investments and portfolio health." />
      
      <div className="mb-6">
        <label htmlFor="investor-project-select" className="block text-sm font-medium text-gray-300 mb-1">Analyze Project:</label>
        <select
          id="investor-project-select"
          className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
          value={selectedProject.id}
          onChange={(e) => setSelectedProject(getMockProjectById(e.target.value) || mockProjects[0])}
        >
          {mockProjects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="IP Risk Constellation (Conceptual)" className="lg:col-span-2 h-[450px]">
          <IPRiskConstellationView project={selectedProject} />
        </Card>
        <Card title="IP Liquidity Rings" className="lg:col-span-1 h-[450px]">
          <IPLiquidityRingsView project={selectedProject}/>
        </Card>
      </div>

      <Card title="Time-Warped IP Valuation Timeline">
        <IPValuationTimelineView project={selectedProject} />
      </Card>
      
      <PortfolioMetricsSuite projects={mockProjects} />

    </div>
  );
};
