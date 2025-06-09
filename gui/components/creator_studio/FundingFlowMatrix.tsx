
import React from 'react';
import { Project, FundingStageData } from '../../types';
import { WaterfallRechart } from '../charts/WaterfallRechart';
import { mockFundingFlowData }  from '../../services/mockDataService'; // Using general mock data for flow stages

interface FundingFlowMatrixProps {
  project: Project;
}

export const FundingFlowMatrix: React.FC<FundingFlowMatrixProps> = ({ project }) => {
  // For this example, we'll use general mockFundingFlowData.
  // A more detailed implementation might derive this from project milestones.
  const dataForChart: FundingStageData[] = mockFundingFlowData.map(stage => ({
    ...stage, // Use existing mock structure for committed, released, escrow etc.
    name: stage.name, // Q1, Q2 etc.
     // These could be scaled by project funding if needed, but for now use mock directly.
  }));
  
  return (
    <div>
      <WaterfallRechart data={dataForChart} title="Funding Stages Overview" />
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-400">Total Committed</p>
          <p className="text-lg font-semibold text-indigo-400">${dataForChart.reduce((sum, s) => sum + s.committed, 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Total Released</p>
          <p className="text-lg font-semibold text-pink-500">${dataForChart.reduce((sum, s) => sum + s.released, 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Currently in Escrow</p>
          <p className="text-lg font-semibold text-emerald-500">${dataForChart.reduce((sum, s) => sum + s.escrow, 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Total Royalties Allocated</p>
          <p className="text-lg font-semibold text-amber-500">${dataForChart.reduce((sum, s) => sum + s.royaltiesAllocated, 0).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
