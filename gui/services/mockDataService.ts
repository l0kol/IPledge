import { Project, IPAsset, Milestone, BackerType, BackerSegment, FundingStageData, GeographicDataPoint, IPConstellationData, LiquidityRingsData, ValuationPoint, GrantIdea, SimpleMilestone } from '../types';
import { CHART_COLORS } from '../constants';

const generateRandomNumber = (min: number, max: number, decimals: number = 0): number => {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
};

const generateHistoricalRevenue = (months: number = 6, base: number = 1000, variance: number = 500): number[] => {
  return Array.from({ length: months }, () => generateRandomNumber(base - variance, base + variance));
};

const generateMilestones = (count: number = 3, totalProjectFunding: number): Milestone[] => {
  const statuses: Milestone['status'][] = ['Pending', 'In Progress', 'Completed', 'Requires Attention'];
  const baseFundingPerMilestone = totalProjectFunding / count;
  return Array.from({ length: count }, (_, i) => ({
    id: `m${i + 1}`,
    name: `Milestone ${i + 1}`,
    description: `Description for milestone ${i + 1}`,
    dueDate: new Date(Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: statuses[generateRandomNumber(0, statuses.length - 1)],
    totalFunding: generateRandomNumber(baseFundingPerMilestone * 0.8, baseFundingPerMilestone * 1.2),
    fundingReleased: generateRandomNumber(0, baseFundingPerMilestone * 0.8),
  }));
};

const generateIPAssets = (count: number = 2): IPAsset[] => {
  const types: IPAsset['type'][] = ['Patent', 'Copyright', 'Trademark'];
  return Array.from({ length: count }, (_, i) => ({
    id: `ip${i + 1}`,
    name: `Amazing IP Asset ${i + 1}`,
    type: types[generateRandomNumber(0, types.length - 1)],
    valuation: generateRandomNumber(50000, 200000),
    historicalRevenue: generateHistoricalRevenue(),
    riskScore: Math.random(),
    revenueDependency: Math.random() * 0.5 + 0.2,
  }));
};

export const mockProjects: Project[] = Array.from({ length: 5 }, (_, i) => {
  const requestedFunding = generateRandomNumber(10000, 100000);
  const stakedIP = generateIPAssets(generateRandomNumber(1,3));
  return {
    id: `proj${i + 1}`,
    title: `Project ${i + 1}: The Next Big Thing`,
    description: `This is a revolutionary project aimed at solving problem X with solution Y. Project about creating innovative content for the decentralized web.`,
    requestedFunding,
    currentFunding: generateRandomNumber(0, requestedFunding),
    backers: {
      individuals: generateRandomNumber(10, 50),
      daos: generateRandomNumber(1, 5),
      vcs: generateRandomNumber(0, 3),
    },
    milestones: generateMilestones(generateRandomNumber(3,5), requestedFunding),
    stakedIP,
    collateralRequired: requestedFunding * 1.5,
    projectedROI: generateRandomNumber(1.5, 5.0, 2)
  };
});

export const getMockProjectById = (id: string): Project | undefined => {
  return mockProjects.find(p => p.id === id) || mockProjects[0]; // Fallback to first project
};


export const mockBackerSegments: BackerSegment[] = [
  { name: BackerType.INDIVIDUAL, value: 400 },
  { name: BackerType.DAO, value: 300 },
  { name: BackerType.VC, value: 300 },
];

export const mockFundingFlowData: FundingStageData[] = [
  { name: 'Q1', committed: 50000, released: 20000, escrow: 30000, royaltiesAllocated: 5000 },
  { name: 'Q2', committed: 70000, released: 35000, escrow: 35000, royaltiesAllocated: 7000 },
  { name: 'Q3', committed: 40000, released: 15000, escrow: 25000, royaltiesAllocated: 4000 },
  { name: 'Q4', committed: 90000, released: 50000, escrow: 40000, royaltiesAllocated: 9000 },
];

export const mockStakeHealthData = (project?: Project) => {
    const p = project || mockProjects[0];
    return p.stakedIP[0]?.historicalRevenue.map((rev, index) => ({
        name: `Month ${index + 1}`,
        revenue: rev,
        threshold: p.collateralRequired / 6 // Assuming threshold is spread over 6 months for example
    })) || [
      { name: 'Jan', revenue: 1200, threshold: 1500 },
      { name: 'Feb', revenue: 1800, threshold: 1500 },
      { name: 'Mar', revenue: 1500, threshold: 1500 },
      { name: 'Apr', revenue: 2200, threshold: 1600 },
      { name: 'May', revenue: 1900, threshold: 1600 },
      { name: 'Jun', revenue: 2500, threshold: 1600 },
    ];
};

export const mockGeographicData: GeographicDataPoint[] = [
    { region: 'North America', backers: 150 },
    { region: 'Europe', backers: 200 },
    { region: 'Asia', backers: 120 },
    { region: 'South America', backers: 50 },
    { region: 'Africa', backers: 30 },
    { region: 'Oceania', backers: 50 },
];


export const getMockIPConstellationData = (project?: Project): IPConstellationData => {
  const p = project || mockProjects[0];
  const nodes: IPConstellationData['nodes'] = [
    { id: p.id, name: p.title, type: 'project', value: p.requestedFunding, riskLevel: 'medium' }
  ];
  const links: IPConstellationData['links'] = [];

  p.stakedIP.forEach(ip => {
    nodes.push({ id: ip.id, name: ip.name, type: 'ip_asset', value: ip.valuation, riskLevel: ip.riskScore && ip.riskScore > 0.6 ? 'high' : (ip.riskScore && ip.riskScore < 0.3 ? 'low' : 'medium') });
    links.push({ source: p.id, target: ip.id, strength: ip.revenueDependency });
  });

  return { nodes, links };
};

export const mockLiquidityRingsData: LiquidityRingsData = {
  layers: [
    { name: 'Active Funded Projects', value: 1200000, color: CHART_COLORS.primary },
    { name: 'Staked IP Assets', value: 1800000, color: CHART_COLORS.secondary },
    { name: 'Revenue Streams', value: 350000, color: CHART_COLORS.tertiary },
  ]
};


export const mockValuationTimelineData: ValuationPoint[] = Array.from({length: 12}, (_, i) => {
    const date = new Date(2023, i, 1).toISOString().split('T')[0];
    const historicalBase = 50000 + i * 2000 + generateRandomNumber(-5000, 5000);
    return {
        date,
        historical: historicalBase,
        projected: i > 5 ? historicalBase * (1 + generateRandomNumber(0.05, 0.2)) : undefined,
        marketComparable: historicalBase * (1 + generateRandomNumber(-0.1, 0.1))
    };
});

export const mockDiversificationData = [
    { x: 'Tech', y: 30, z: 200000, name: 'Project Alpha' }, // x: category, y: funding stage (1-5), z: amount
    { x: 'Art', y: 15, z: 150000, name: 'Project Beta' },
    { x: 'Media', y: 60, z: 500000, name: 'Project Gamma' },
    { x: 'DeFi', y: 80, z: 300000, name: 'Project Delta' },
    { x: 'Gaming', y: 45, z: 250000, name: 'Project Epsilon' },
];

const grantCategories: GrantIdea['category'][] = ['Art', 'Tech', 'DeFi', 'Gaming', 'Social Impact', 'Science'];
const grantStatuses: GrantIdea['status'][] = ['Open', 'Funded', 'In Progress', 'Expired'];
const sampleTags = ['NFT', 'DAO', 'Metaverse', 'Sustainability', 'Education', 'Research', 'Community'];
const sampleImageUrls = [
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=300&q=60',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVjaHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=300&q=60',
  'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZWR1Y2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60',
  'https://images.unsplash.com/photo-1582053079ставлять-52de840678e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z2FtaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60',
  'https://images.unsplash.com/photo-1605705700050-9ab0d60393e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFydHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=300&q=60'
];

const generateSimpleMilestones = (count: number = 3): SimpleMilestone[] => {
  const statuses: SimpleMilestone['status'][] = ['Planned', 'In Progress', 'Achieved'];
  return Array.from({ length: count }, (_, i) => ({
    id: `sm-${i + 1}`,
    name: `Phase ${i + 1}: Concept & Planning`,
    description: `Detailing the objective for phase ${i + 1} of this grant.`,
    status: statuses[generateRandomNumber(0, statuses.length -1)]
  }));
};

export const mockGrantIdeas: GrantIdea[] = Array.from({ length: 8 }, (_, i) => {
  const requestedFunding = generateRandomNumber(500, 25000);
  const currentFunding = generateRandomNumber(0, requestedFunding * 0.7); // Can be 0 up to 70% of requested for demo
  const postedDate = new Date(Date.now() - generateRandomNumber(1, 60) * 24 * 60 * 60 * 1000).toISOString();
  
  return {
    id: `grant${i + 1}`,
    title: `Innovative Grant Idea ${i + 1}`,
    creatorName: `Creator ${String.fromCharCode(65 + i)}`, // Creator A, Creator B, etc.
    description: `A brief description of grant idea ${i + 1}, focusing on its unique impact and potential for the community. This grant aims to revolutionize approach X.`,
    longDescription: `This is a more detailed explanation of Grant Idea ${i + 1}. It covers the project's objectives, methodology, expected outcomes, and how the funds will be utilized. The project team is composed of experienced individuals passionate about this domain. We believe this grant will foster significant innovation and provide valuable contributions to the ecosystem. This idea involves exploring new frontiers in decentralized technology, creating engaging art projects, or developing tools that benefit the broader Web3 community. We plan to deliver X, Y, and Z outputs.`,
    requestedFunding,
    currentFunding,
    category: grantCategories[generateRandomNumber(0, grantCategories.length - 1)],
    tags: Array.from({ length: generateRandomNumber(1, 3) }, () => sampleTags[generateRandomNumber(0, sampleTags.length - 1)]),
    status: grantStatuses[generateRandomNumber(0, grantStatuses.length - 1)],
    postedDate,
    imageUrl: sampleImageUrls[i % sampleImageUrls.length],
    mockBackersCount: generateRandomNumber(5, 150),
    simpleMilestones: generateSimpleMilestones(generateRandomNumber(2,4)),
  };
});

export const getMockGrantIdeas = (): GrantIdea[] => {
  return mockGrantIdeas;
};

export const getMockGrantById = (id: string): GrantIdea | undefined => {
  return mockGrantIdeas.find(grant => grant.id === id);
};