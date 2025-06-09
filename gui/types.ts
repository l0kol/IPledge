export interface Milestone {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Requires Attention';
  fundingReleased: number;
  totalFunding: number;
}

export interface IPAsset {
  id: string;
  name: string;
  type: 'Patent' | 'Trademark' | 'Copyright' | 'Trade Secret';
  valuation: number;
  historicalRevenue: number[]; // e.g., last 6 months
  riskScore?: number; // 0-1
  revenueDependency?: number; // 0-1 for network graph
}

export interface Project {
  id: string;
  title: string;
  description: string;
  requestedFunding: number;
  currentFunding: number;
  backers: { individuals: number; daos: number; vcs: number };
  milestones: Milestone[];
  stakedIP: IPAsset[];
  collateralRequired: number;
  projectedROI?: number;
}

export enum BackerType {
  INDIVIDUAL = 'Individuals',
  DAO = 'DAOs',
  VC = 'VCs',
}

export interface BackerSegment {
  name: BackerType;
  value: number;
}

export interface FundingStageData {
  name: string;
  committed: number;
  released: number;
  escrow: number;
  royaltiesAllocated: number;
}

export interface GeographicDataPoint {
  region: string;
  backers: number;
}

// For IP Risk Constellation (Simplified 2D)
export interface ConstellationNode {
  id: string;
  name: string;
  type: 'project' | 'ip_asset';
  value: number; // e.g., funding amount or IP valuation
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface ConstellationLink {
  source: string; // id of source node
  target: string; // id of target node
  strength?: number; // e.g., revenue dependency
}

export interface IPConstellationData {
  nodes: ConstellationNode[];
  links: ConstellationLink[];
}

// For IP Liquidity Rings
export interface LiquidityRingLayer {
  name: string; // e.g., 'Active Projects', 'Staked IP', 'Revenue Streams'
  value: number;
  color: string;
}

export interface LiquidityRingsData {
  layers: LiquidityRingLayer[];
}

// For Valuation Timeline
export interface ValuationPoint {
  date: string; // or Date object
  historical: number;
  projected?: number;
  marketComparable?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface SimpleMilestone {
  id: string;
  name: string;
  description: string;
  status: 'Planned' | 'In Progress' | 'Achieved';
}

export interface GrantIdea {
  id: string;
  title: string;
  creatorName: string;
  description: string; // Short summary
  longDescription?: string; // Detailed description
  requestedFunding: number;
  currentFunding: number; // For progress, defaults to 0
  category: 'Art' | 'Tech' | 'DeFi' | 'Gaming' | 'Social Impact' | 'Science' | 'Other';
  tags?: string[];
  status: 'Open' | 'Funded' | 'Expired' | 'In Progress';
  postedDate: string; // ISO date string
  imageUrl?: string; // Optional image for the grant idea card
  mockBackersCount?: number; // Added for detail page
  simpleMilestones?: SimpleMilestone[]; // Added for detail page
}