
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMockGrantById } from '../services/mockDataService';
import { GrantIdea, SimpleMilestone } from '../types';
import { SectionHeader } from '../components/core/SectionHeader';
import { Card } from '../components/core/Card';
import { Button } from '../components/core/Button';
import { LoadingSpinner } from '../components/core/LoadingSpinner';
import { ArrowLeft, Tag, Users, DollarSign, CalendarDays, CheckCircle, ListChecks, MessageSquare, Award } from 'lucide-react';

const SimpleMilestoneDisplay: React.FC<{ milestone: SimpleMilestone }> = ({ milestone }) => {
    const statusColors = {
        Planned: 'bg-yellow-500',
        'In Progress': 'bg-blue-500',
        Achieved: 'bg-green-500',
    };
    return (
        <div className="p-3 bg-gray-700 rounded-md">
            <div className="flex items-center justify-between mb-1">
                <h5 className="text-sm font-semibold text-white">{milestone.name}</h5>
                <span className={`px-2 py-0.5 text-xs text-white rounded-full ${statusColors[milestone.status]}`}>{milestone.status}</span>
            </div>
            <p className="text-xs text-gray-300">{milestone.description}</p>
        </div>
    );
};


export const GrantDetailPage: React.FC = () => {
  const { grantId } = useParams<{ grantId: string }>();
  const [grant, setGrant] = React.useState<GrantIdea | null | undefined>(undefined); // undefined for loading, null for not found

  React.useEffect(() => {
    if (grantId) {
      const foundGrant = getMockGrantById(grantId);
      setGrant(foundGrant);
    }
  }, [grantId]);

  if (grant === undefined) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner message="Loading grant details..." /></div>;
  }

  if (!grant) {
    return (
      <div className="text-center py-10">
        <SectionHeader title="Grant Not Found" subtitle="Sorry, we couldn't find the grant idea you're looking for." />
        <Button as={Link} to="/marketplace" variant="primary" leftIcon={<ArrowLeft size={18}/>}>
          Back to Marketplace
        </Button>
      </div>
    );
  }

  const fundingProgress = grant.requestedFunding > 0 ? (grant.currentFunding / grant.requestedFunding) * 100 : 0;
  const daysAgo = Math.floor((new Date().getTime() - new Date(grant.postedDate).getTime()) / (1000 * 3600 * 24));


  return (
    <div className="space-y-8">
      <div className="mb-6">
        <Button<typeof Link> as={Link} to="/marketplace" variant="ghost" size="sm" leftIcon={<ArrowLeft size={16}/>}>
          Back to Marketplace
        </Button>
      </div>

      <SectionHeader title={grant.title} subtitle={`An innovative idea by ${grant.creatorName}`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column / Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {grant.imageUrl && (
            <Card>
              <img src={grant.imageUrl} alt={grant.title} className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-lg" />
            </Card>
          )}
          <Card title="About this Grant Idea">
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">
              {grant.longDescription || grant.description}
            </p>
          </Card>

          {grant.simpleMilestones && grant.simpleMilestones.length > 0 && (
            <Card title="Project Milestones" icon={<ListChecks size={20} />}>
              <div className="space-y-3">
                {grant.simpleMilestones.map(m => <SimpleMilestoneDisplay key={m.id} milestone={m} />)}
              </div>
            </Card>
          )}

          <Card title="Updates & Discussions (Placeholder)" icon={<MessageSquare size={20} />}>
            <p className="text-gray-500 italic">Updates and a comment section will be available here soon.</p>
            {/* Placeholder for comments or updates feed */}
          </Card>
        </div>

        {/* Right Column / Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="Funding Status" icon={<DollarSign size={20} />}>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Requested Amount</p>
                <p className="text-2xl font-bold text-indigo-400">${grant.requestedFunding.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Currently Funded</p>
                <p className="text-xl font-semibold text-green-400">${grant.currentFunding.toLocaleString()}</p>
              </div>
              {grant.requestedFunding > 0 && (
                <div>
                  <div className="w-full bg-gray-600 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${fundingProgress}%` }}
                      title={`${fundingProgress.toFixed(1)}% Funded`}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 text-right mt-1">{fundingProgress.toFixed(1)}% Funded</p>
                </div>
              )}
              {grant.mockBackersCount !== undefined && (
                <div className="flex items-center text-sm text-gray-400">
                  <Users size={16} className="mr-2 text-indigo-400"/> {grant.mockBackersCount} Backers (mock data)
                </div>
              )}
              <Button 
                variant="primary" 
                className="w-full" 
                onClick={() => alert(`Funding for "${grant.title}" coming soon!`)}
                leftIcon={<Award size={18}/>}
              >
                Fund This Grant Idea
              </Button>
            </div>
          </Card>

          <Card title="Details" icon={<ListChecks size={20} />}>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <CalendarDays size={16} className="mr-2 text-indigo-400"/> 
                Posted: <span className="ml-1 text-gray-300">{new Date(grant.postedDate).toLocaleDateString()} ({daysAgo <= 0 ? "today" : `${daysAgo} days ago`})</span>
              </li>
              <li className="flex items-center">
                <Tag size={16} className="mr-2 text-indigo-400"/> 
                Category: <span className="ml-1 text-gray-300">{grant.category}</span>
              </li>
               <li className="flex items-center">
                <Users size={16} className="mr-2 text-indigo-400"/> 
                Creator: <span className="ml-1 text-gray-300">{grant.creatorName}</span>
              </li>
              <li className="flex items-center">
                <CheckCircle size={16} className="mr-2 text-indigo-400"/> 
                Status: <span className={`ml-1 font-medium ${grant.status === 'Open' ? 'text-green-400' : 'text-yellow-400'}`}>{grant.status}</span>
              </li>
            </ul>
            {grant.tags && grant.tags.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-gray-400 mb-1">TAGS:</h4>
                <div className="flex flex-wrap gap-2">
                  {grant.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-700 text-indigo-300 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
