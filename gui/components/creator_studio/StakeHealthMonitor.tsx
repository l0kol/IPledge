
import React from 'react';
import { Project, IPAsset } from '../../types';
import { DualAxisLineRechart } from '../charts/DualAxisLineRechart';
import { RiskMeter } from '../shared/RiskMeter';
import { mockStakeHealthData } from '../../services/mockDataService';
import { ShieldCheck, TrendingDown } from 'lucide-react';

interface StakeHealthMonitorProps {
  project: Project;
}

export const StakeHealthMonitor: React.FC<StakeHealthMonitorProps> = ({ project }) => {
  const chartData = mockStakeHealthData(project); // Uses project data or fallback mock
  const totalStakedValue = project.stakedIP.reduce((sum, ip) => sum + ip.valuation, 0);
  const collateralSufficiency = totalStakedValue / project.collateralRequired; // Ratio

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-md font-medium text-gray-300 mb-2 flex items-center">
            <ShieldCheck size={18} className="mr-2 text-indigo-400"/>
            Stake Health & Revenue
        </h4>
        <DualAxisLineRechart data={chartData} title="IP Revenue vs. Collateral Threshold (Sample 6-Month)" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <RiskMeter score={1 - Math.min(1, Math.max(0, collateralSufficiency))} label="Collateral Risk (Lower is Better)" />
          <p className="text-xs text-gray-400 mt-1">
            Collateral Sufficiency: <span className={collateralSufficiency >= 1 ? "text-green-400" : "text-red-400"}>{(collateralSufficiency * 100).toFixed(1)}%</span>
            (Value: ${totalStakedValue.toLocaleString()} vs Required: ${project.collateralRequired.toLocaleString()})
          </p>
        </div>

        {project.stakedIP.length > 0 && project.stakedIP[0].riskScore !== undefined && (
          <div>
            <RiskMeter score={project.stakedIP[0].riskScore} label={`${project.stakedIP[0].name} Risk`} />
            <p className="text-xs text-gray-400 mt-1">Primary staked IP risk assessment.</p>
          </div>
        )}
      </div>

      <div>
        <h5 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
            <TrendingDown size={16} className="mr-2 text-indigo-400"/>
            Staked IP Assets ({project.stakedIP.length})
        </h5>
        {project.stakedIP.length > 0 ? (
          <ul className="space-y-2">
            {project.stakedIP.map(ip => (
              <li key={ip.id} className="p-3 bg-gray-700 rounded-md text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-200">{ip.name} ({ip.type})</span>
                  <span className="text-indigo-400 font-semibold">${ip.valuation.toLocaleString()}</span>
                </div>
                {ip.riskScore !== undefined && <RiskMeter score={ip.riskScore} />}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No IP assets staked for this project.</p>
        )}
      </div>
    </div>
  );
};
