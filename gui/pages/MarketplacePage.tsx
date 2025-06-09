
import React, { useState, useMemo } from 'react';
import { SectionHeader } from '../components/core/SectionHeader';
import { Card } from '../components/core/Card';
import { Button } from '../components/core/Button';
import { getMockGrantIdeas } from '../services/mockDataService';
import { GrantIdea } from '../types';
import { Tag, Users, DollarSign, CalendarDays, Eye, Filter, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom'; // Added import for Link

const GrantIdeaCard: React.FC<{ grant: GrantIdea }> = ({ grant }) => {
  const fundingProgress = grant.requestedFunding > 0 ? (grant.currentFunding / grant.requestedFunding) * 100 : 0;
  const daysAgo = Math.floor((new Date().getTime() - new Date(grant.postedDate).getTime()) / (1000 * 3600 * 24));

  return (
    <Card className="flex flex-col h-full hover:shadow-indigo-500/30 transition-shadow duration-300 transform hover:-translate-y-1">
      {grant.imageUrl && (
        <img src={grant.imageUrl} alt={grant.title} className="w-full h-40 object-cover rounded-t-lg mb-4" />
      )}
      <div className="flex-grow">
        <h3 className="text-xl font-semibold text-white mb-1 truncate" title={grant.title}>{grant.title}</h3>
        <p className="text-xs text-indigo-400 mb-2">
          By {grant.creatorName} in <span className="font-medium">{grant.category}</span>
        </p>
        <p className="text-sm text-gray-300 mb-3 h-16 overflow-hidden text-ellipsis">
          {grant.description}
        </p>
        
        <div className="mb-3">
          <p className="text-xs text-gray-400">Funding Goal:</p>
          <p className="text-lg font-bold text-green-400">${grant.requestedFunding.toLocaleString()}</p>
          {grant.requestedFunding > 0 && (
            <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${fundingProgress}%` }}
                title={`${fundingProgress.toFixed(0)}% Funded ($${grant.currentFunding.toLocaleString()})`}
              ></div>
            </div>
          )}
        </div>

        {grant.tags && grant.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {grant.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-gray-700 text-indigo-300 text-xs rounded-full flex items-center">
                <Tag size={12} className="mr-1" />{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-auto pt-3 border-t border-gray-700 flex justify-between items-center">
        <span className="text-xs text-gray-500 flex items-center">
            <CalendarDays size={14} className="mr-1"/> 
            {daysAgo <= 0 ? "Posted today" : `Posted ${daysAgo}d ago`}
        </span>
        <Button<typeof Link> // Specify Button renders as Link
          as={Link} 
          to={`/marketplace/${grant.id}`} // Navigation path
          size="sm" 
          variant="ghost" 
          rightIcon={<Eye size={16}/>}
        >
          View Details
        </Button>
      </div>
    </Card>
  );
};

export const MarketplacePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('postedDateDesc'); // e.g., 'requestedFundingAsc', 'titleAsc'

  const grantIdeas = useMemo(() => getMockGrantIdeas(), []);

  const categories = useMemo(() => {
    const allCategories = grantIdeas.map(idea => idea.category);
    return ['All', ...Array.from(new Set(allCategories))];
  }, [grantIdeas]);

  const filteredAndSortedIdeas = useMemo(() => {
    let result = grantIdeas;

    if (searchTerm) {
      result = result.filter(idea =>
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.creatorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(idea => idea.category === selectedCategory);
    }
    
    // Sorting logic
    return result.sort((a, b) => {
        switch (sortBy) {
            case 'postedDateAsc': return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
            case 'postedDateDesc': return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
            case 'fundingAsc': return a.requestedFunding - b.requestedFunding;
            case 'fundingDesc': return b.requestedFunding - a.requestedFunding;
            case 'titleAsc': return a.title.localeCompare(b.title);
            default: return 0;
        }
    });

  }, [grantIdeas, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="space-y-8">
      <SectionHeader title="Grant Ideas Marketplace" subtitle="Discover and support innovative projects seeking funding." />
      
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-800 rounded-lg">
          <input
            type="text"
            placeholder="Search ideas, creators..."
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search grant ideas"
          />
          <select
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by category"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
           <select
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort by"
          >
            <option value="postedDateDesc">Newest First</option>
            <option value="postedDateAsc">Oldest First</option>
            <option value="fundingDesc">Funding: High to Low</option>
            <option value="fundingAsc">Funding: Low to High</option>
            <option value="titleAsc">Title (A-Z)</option>
          </select>
        </div>

        {filteredAndSortedIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedIdeas.map(idea => (
              <GrantIdeaCard key={idea.id} grant={idea} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">
            No grant ideas found matching your criteria. Try adjusting your search or filters.
          </p>
        )}
      </Card>
      
      <div className="text-center mt-10">
        <Button variant="primary" size="lg" onClick={() => alert("Feature to create new grant idea coming soon!")}>
          <TrendingUp size={20} className="mr-2" />
          Propose Your Grant Idea
        </Button>
      </div>
    </div>
  );
};