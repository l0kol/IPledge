import React, { useState, useMemo } from 'react';
import { Project } from '../../types';
import { Card } from '../core/Card';
import { Button } from '../core/Button';
import { SectionHeader } from '../core/SectionHeader'; // Added import
import { mockDiversificationData } from '../../services/mockDataService';
import { PieChart as PieIcon, BarChart2, TrendingUp as TrendingUpIcon, AlertTriangle, GanttChartSquare, Calculator } from 'lucide-react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, Cell, CartesianGrid } from 'recharts'; // Added CartesianGrid
import { CHART_COLORS } from '../../constants';

interface PortfolioMetricsSuiteProps {
  projects: Project[]; // Full list of projects in portfolio
}

// Diversification Score (Bubble Chart)
const DiversificationScoreCard: React.FC<{ projects: Project[] }> = ({ projects }) => {
  // Use mockDiversificationData which has x, y, z structure
  // In a real app, this would be derived from 'projects' props
  const data = mockDiversificationData;
   const categories = Array.from(new Set(data.map(p => p.x)));
   const categoryColors = categories.reduce((acc, cat, idx) => {
    acc[cat] = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.tertiary, CHART_COLORS.quaternary, '#FBBF24'][idx % 5];
    return acc;
  }, {} as Record<string, string>);


  return (
    <Card title="Portfolio Diversification" className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid stroke={CHART_COLORS.grid}/>
            <XAxis type="category" dataKey="x" name="Category" stroke="#9CA3AF" tick={{ fontSize: 10 }}/>
            <YAxis type="number" dataKey="y" name="Funding Stage Progress (%)" unit="%" stroke="#9CA3AF" tick={{ fontSize: 10 }}/>
            <ZAxis type="number" dataKey="z" range={[100, 1000]} name="Funding Amount" unit="$" />
            <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                contentStyle={{ backgroundColor: CHART_COLORS.background, border: `1px solid ${CHART_COLORS.grid}`, borderRadius: '0.5rem' }}
                itemStyle={{ color: '#E5E7EB', fontSize: '12px' }}
                formatter={(value: any, name: string, props: any) => {
                    if (name === "Funding Amount") return [`$${(value as number).toLocaleString()}`, name];
                    if (name === "Funding Stage Progress (%)") return [`${value}%`, name];
                    return [value, name];
                }}
            />
            <Legend wrapperStyle={{fontSize: "10px"}} />
            <Scatter name="Projects" data={data} fill={CHART_COLORS.primary}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[entry.x]} />
                ))}
            </Scatter>
            </ScatterChart>
        </ResponsiveContainer>
    </Card>
  );
};

// ROI Projections
const ROICard: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const avgROI = projects.reduce((sum, p) => sum + (p.projectedROI || 0), 0) / (projects.filter(p => p.projectedROI).length || 1);
  return (
    <Card title="ROI Projections">
      <div className="text-center">
        <TrendingUpIcon className="mx-auto h-12 w-12 text-green-400" />
        <p className="mt-2 text-3xl font-bold text-white">{(avgROI * 100).toFixed(1)}%</p>
        <p className="text-sm text-gray-400">Average Projected ROI (Monte Carlo Simulated)</p>
        <p className="text-xs text-gray-500 mt-2">Based on {projects.length} projects in portfolio. Detailed breakdown per project available.</p>
      </div>
    </Card>
  );
};

// Risk Exposure Matrix (Simplified Table)
const RiskExposureMatrix: React.FC<{ projects: Project[] }> = ({ projects }) => {
  return (
    <Card title="Risk Exposure Matrix (Collateral Coverage)">
      <div className="overflow-x-auto max-h-60">
        <table className="min-w-full text-xs">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2 text-left text-gray-300">Project</th>
              <th className="p-2 text-left text-gray-300">Staked Value</th>
              <th className="p-2 text-left text-gray-300">Required</th>
              <th className="p-2 text-left text-gray-300">Coverage</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800">
            {projects.slice(0,5).map(p => { // Show first 5 for brevity
              const stakedValue = p.stakedIP.reduce((sum, ip) => sum + ip.valuation, 0);
              const coverage = p.collateralRequired > 0 ? (stakedValue / p.collateralRequired) : 0;
              return (
                <tr key={p.id} className="border-b border-gray-700 last:border-b-0">
                  <td className="p-2 text-gray-200 whitespace-nowrap">{p.title.substring(0,20)}...</td>
                  <td className="p-2 text-gray-200">${stakedValue.toLocaleString()}</td>
                  <td className="p-2 text-gray-200">${p.collateralRequired.toLocaleString()}</td>
                  <td className={`p-2 font-semibold ${coverage >= 1 ? 'text-green-400' : 'text-red-400'}`}>
                    {(coverage * 100).toFixed(0)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// Yield Waterfall Calculator (Simplified)
const YieldCalculator: React.FC = () => {
    const [revenue, setRevenue] = useState<number>(25000);
    const tiers = [
        { limit: 10000, creator: 0.70, investor: 0.25, protocol: 0.05 },
        { limit: 50000, creator: 0.60, investor: 0.35, protocol: 0.05 },
        { limit: Infinity, creator: 0.50, investor: 0.45, protocol: 0.05 },
    ];

    const calculatedYield = useMemo(() => {
        let remainingRevenue = revenue;
        let creatorShare = 0;
        let investorShare = 0;
        let protocolShare = 0;
        let lastLimit = 0;

        for (const tier of tiers) {
            if (remainingRevenue <= 0) break;
            const tierRevenue = Math.min(remainingRevenue, tier.limit - lastLimit);
            
            creatorShare += tierRevenue * tier.creator;
            investorShare += tierRevenue * tier.investor;
            protocolShare += tierRevenue * tier.protocol; // Added explicit semicolon
            
            remainingRevenue -= tierRevenue;
            lastLimit = tier.limit;
        }
        return { creatorShare, investorShare, protocolShare, total: revenue };
    }, [revenue, tiers]);


    return (
    <Card title="Yield Waterfall Calculator">
        <div className="space-y-3">
            <div>
                <label htmlFor="revenueInput" className="block text-sm font-medium text-gray-300 mb-1">Enter Gross Revenue:</label>
                <input 
                    type="number" 
                    id="revenueInput"
                    value={revenue}
                    onChange={(e) => setRevenue(Number(e.target.value))}
                    className="w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 25000"
                />
            </div>
            <div className="text-sm space-y-1 p-3 bg-gray-700 rounded-md">
                <p>Creator Share ({(calculatedYield.creatorShare / calculatedYield.total * 100 || 0).toFixed(1)}%): <span className="font-semibold text-green-400">${calculatedYield.creatorShare.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p>
                <p>Investor Share ({(calculatedYield.investorShare / calculatedYield.total * 100 || 0).toFixed(1)}%): <span className="font-semibold text-indigo-400">${calculatedYield.investorShare.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p>
                <p>Protocol Share ({(calculatedYield.protocolShare / calculatedYield.total * 100 || 0).toFixed(1)}%): <span className="font-semibold text-gray-400">${calculatedYield.protocolShare.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p>
            </div>
            <p className="text-xs text-gray-500">Note: Simplified model. Does not include gas costs or other fees.</p>
        </div>
    </Card>
    );
};


export const PortfolioMetricsSuite: React.FC<PortfolioMetricsSuiteProps> = ({ projects }) => {
  return (
    <div className="space-y-6">
      <SectionHeader title="Portfolio Deep Dive" subtitle="Advanced metrics and simulators for your investments."/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DiversificationScoreCard projects={projects} />
        <ROICard projects={projects} />
        <RiskExposureMatrix projects={projects} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <YieldCalculator />
        <Card title="Liquidity Horizon & Stress Tests (Conceptual)">
          <div className="space-y-4 text-center">
            <div>
              <GanttChartSquare className="mx-auto h-10 w-10 text-blue-400" />
              <p className="mt-1 text-sm text-gray-300">Liquidity Horizon Gantt Chart</p>
              <p className="text-xs text-gray-500">Visualizing milestone payouts, royalty vesting, and collateral release dates.</p>
            </div>
            <div>
              <AlertTriangle className="mx-auto h-10 w-10 text-yellow-400" />
              <p className="mt-1 text-sm text-gray-300">Portfolio Stress Test Simulator</p>
              <p className="text-xs text-gray-500">Simulating IP value fluctuations and milestone failure scenarios.</p>
            </div>
            <Button variant="secondary" size="sm">Run Simulations (Conceptual)</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};