
import React from 'react';
import { SectionHeader } from '../core/SectionHeader';
import { Card } from '../core/Card';
import { BackerAnalyticsPanel } from './BackerAnalyticsPanel';
import { FundingFlowMatrix } from './FundingFlowMatrix';
import { StakeHealthMonitor } from './StakeHealthMonitor';
import { MilestoneBuilderUI } from './MilestoneBuilderUI';
import { mockProjects, getMockProjectById } from '../../services/mockDataService';
import { Project } from '../../types';
import { List, LayoutGrid } from 'lucide-react';

export const CreatorStudioView: React.FC = () => {
  const [selectedProject, setSelectedProject] = React.useState<Project>(mockProjects[0] || getMockProjectById('proj1')!); // Ensure a project is selected
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  if (!selectedProject) {
    return <div className="text-center p-8">No project data available.</div>;
  }

  return (
    <div className="space-y-8">
      <SectionHeader title="Creator Studio" subtitle={`Manage your IP-backed funding for "${selectedProject.title}"`} />
      
      <div className="mb-6">
        <label htmlFor="project-select" className="block text-sm font-medium text-gray-300 mb-1">Select Project:</label>
        <select
          id="project-select"
          className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
          value={selectedProject.id}
          onChange={(e) => setSelectedProject(getMockProjectById(e.target.value) || mockProjects[0])}
        >
          {mockProjects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Backer Analytics" className="lg:col-span-1">
          <BackerAnalyticsPanel project={selectedProject} />
        </Card>
        <Card title="Funding Flow Matrix" className="lg:col-span-2">
          <FundingFlowMatrix project={selectedProject} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Stake Health Monitor" className="lg:col-span-2">
          <StakeHealthMonitor project={selectedProject} />
        </Card>
        <Card title="Quick Stats" className="lg:col-span-1">
            <div className="space-y-4">
                <div>
                    <p className="text-sm text-gray-400">Total Requested</p>
                    <p className="text-2xl font-semibold text-indigo-400">${selectedProject.requestedFunding.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Current Funding</p>
                    <p className="text-2xl font-semibold text-green-400">${selectedProject.currentFunding.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Collateral Required</p>
                    <p className="text-xl font-semibold text-yellow-400">${selectedProject.collateralRequired.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Staked IP Value</p>
                    <p className="text-xl font-semibold text-teal-400">${selectedProject.stakedIP.reduce((sum, ip) => sum + ip.valuation, 0).toLocaleString()}</p>
                </div>
            </div>
        </Card>
      </div>
      
      <Card title="Milestone Management">
        <MilestoneBuilderUI project={selectedProject} />
      </Card>
    </div>
  );
};
