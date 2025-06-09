
import React from 'react';
import { SectionHeader } from '../components/core/SectionHeader';
import { Card } from '../components/core/Card';
import { Button } from '../components/core/Button';
import { Link } from 'react-router-dom';
import { Lightbulb, Users, BarChart3, ArrowRight, Lock } from 'lucide-react'; // Replaced BarChart3 with Lock for smart contract implication

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      <header className="text-center py-12 bg-gray-800 rounded-xl shadow-2xl">
        <Lightbulb className="mx-auto h-20 w-20 text-indigo-400 mb-6 animate-pulse" />
        <h1 className="text-5xl font-extrabold text-white tracking-tight">
          Welcome to <span className="text-indigo-400">IPFlow</span>
        </h1>
        <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
          The decentralized platform bridging creators and investors through IP-backed funding, transparent royalties, and community-driven growth.
        </p>
        <div className="mt-10 flex justify-center space-x-4">
          <Button<typeof Link> size="lg" as={Link} to="/creator">
            Creator Studio <ArrowRight size={20} className="ml-2"/>
          </Button>
          <Button<typeof Link> size="lg" variant="secondary" as={Link} to="/investor">
            Investor Dashboard <ArrowRight size={20} className="ml-2"/>
          </Button>
        </div>
      </header>

      <SectionHeader title="How IPFlow Works" subtitle="A seamless flow from idea to impact." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="hover:shadow-indigo-500/30 transition-shadow duration-300">
          <div className="flex items-center text-indigo-400 mb-3">
            <Users size={28} className="mr-3" />
            <h3 className="text-2xl font-semibold text-white">1. Creators & Ideas</h3>
          </div>
          <p className="text-gray-400">
            Creators propose innovative projects, staking existing IP assets (via Story Protocol) as collateral to build trust and demonstrate value.
          </p>
        </Card>

        <Card className="hover:shadow-indigo-500/30 transition-shadow duration-300">
          <div className="flex items-center text-indigo-400 mb-3">
            <Lock size={28} className="mr-3" /> {/* Changed icon to Lock */}
            <h3 className="text-2xl font-semibold text-white">2. Funding & Milestones</h3>
          </div>
          <p className="text-gray-400">
            Investors and the community fund projects. Funds are managed by our smart contracts and released incrementally as milestones are met, based on validated proof of completion.
          </p>
        </Card>

        <Card className="hover:shadow-indigo-500/30 transition-shadow duration-300">
          <div className="flex items-center text-indigo-400 mb-3">
            <Lightbulb size={28} className="mr-3" />
            <h3 className="text-2xl font-semibold text-white">3. Royalties & Growth</h3>
          </div>
          <p className="text-gray-400">
            Successful projects generate revenue. Royalties are transparently distributed to creators and investors based on a pre-defined waterfall managed by our smart contracts.
          </p>
        </Card>
      </div>

      <SectionHeader title="Key Integrations" subtitle="Powered by leading Web3 protocols." />
      <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
        <span className="text-lg font-medium">Story Protocol</span>
        <span className="text-lg font-medium">The Graph</span>
      </div>
      
      <div className="text-center mt-12">
        <Button<typeof Link> size="lg" variant="ghost" as={Link} to="/analyzer">
            Try our AI Project Analyzer <ArrowRight size={20} className="ml-2"/>
        </Button>
      </div>

    </div>
  );
};
