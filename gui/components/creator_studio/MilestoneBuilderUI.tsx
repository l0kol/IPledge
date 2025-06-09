import React, { useState, useCallback } from 'react';
import { Project, Milestone } from '../../types';
import { Button } from '../core/Button';
import { Card } from '../core/Card'; // Added import
import { CalendarDays, CheckCircle, Clock, DollarSign, Edit3, Trash2, PlusCircle, AlertTriangle } from 'lucide-react';

interface MilestoneBuilderUIProps {
  project: Project;
}

const MilestoneCardDisplay: React.FC<{ milestone: Milestone, onEdit: (id: string) => void, onDelete: (id: string) => void }> = ({ milestone, onEdit, onDelete }) => {
  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'Completed': return 'text-green-400';
      case 'In Progress': return 'text-blue-400';
      case 'Pending': return 'text-yellow-400';
      case 'Requires Attention': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'Completed': return <CheckCircle size={16} className="mr-1" />;
      case 'In Progress': return <Clock size={16} className="mr-1" />;
      case 'Pending': return <CalendarDays size={16} className="mr-1" />;
      case 'Requires Attention': return <AlertTriangle size={16} className="mr-1" />;
      default: return null;
    }
  };
  
  const progressPercentage = milestone.totalFunding > 0 ? (milestone.fundingReleased / milestone.totalFunding) * 100 : 0;

  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-md font-semibold text-white">{milestone.name}</h4>
          <p className={`text-xs flex items-center ${getStatusColor(milestone.status)}`}>
            {getStatusIcon(milestone.status)} {milestone.status}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="ghost" onClick={() => onEdit(milestone.id)} aria-label="Edit milestone">
            <Edit3 size={14} />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(milestone.id)} aria-label="Delete milestone">
            <Trash2 size={14} className="text-red-400" />
          </Button>
        </div>
      </div>
      <p className="text-xs text-gray-300 leading-relaxed">{milestone.description}</p>
      
      <div className="text-xs text-gray-400 space-y-1">
        <div className="flex items-center">
            <CalendarDays size={14} className="mr-2 text-indigo-400"/> Due: {new Date(milestone.dueDate).toLocaleDateString()}
        </div>
        <div className="flex items-center">
            <DollarSign size={14} className="mr-2 text-green-400"/>
            Funding: ${milestone.fundingReleased.toLocaleString()} / ${milestone.totalFunding.toLocaleString()}
        </div>
      </div>
      
      <div>
        <div className="w-full bg-gray-600 rounded-full h-1.5">
          <div
            className="bg-indigo-500 h-1.5 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};


export const MilestoneBuilderUI: React.FC<MilestoneBuilderUIProps> = ({ project }) => {
  const [milestones, setMilestones] = useState<Milestone[]>(project.milestones);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);

  // In a real app, these would interact with a backend or smart contract
  const handleAddMilestone = () => {
    const newMilestone: Milestone = {
      id: `mNew${Date.now()}`, // Differentiate new milestones for form title
      name: 'New Milestone',
      description: 'Define specifics...',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pending',
      fundingReleased: 0,
      totalFunding: project.requestedFunding / (milestones.length + 1 || 1) // Example allocation
    };
    setMilestones([...milestones, newMilestone]);
    setEditingMilestone(newMilestone); // Open editor for new milestone
  };

  const handleEdit = (id: string) => {
    const milestoneToEdit = milestones.find(m => m.id === id);
    if (milestoneToEdit) setEditingMilestone(milestoneToEdit);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this milestone?")) {
        setMilestones(milestones.filter(m => m.id !== id));
    }
  };

  const handleSaveMilestone = (updatedMilestone: Milestone) => {
    setMilestones(milestones.map(m => m.id === updatedMilestone.id ? updatedMilestone : m));
    setEditingMilestone(null);
  };

  // Automated funding terms generation (conceptual)
  const generateFundingTerms = useCallback(() => {
    // This would be a more complex logic, potentially calling an AI service
    // or using historical data from `project.stakedIP`.
    // For now, it's a placeholder.
    alert("Automated funding terms generation initiated (conceptual).\nThis would analyze historical IP performance and market data to suggest terms.");
    // Example: Could adjust milestone funding based on risk or IP revenue projections
  }, [project.stakedIP]);


  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Project Milestones</h3>
            <div className="space-x-2">
                <Button onClick={generateFundingTerms} variant="ghost" size="sm">
                    Generate Terms (AI)
                </Button>
                <Button onClick={handleAddMilestone} leftIcon={<PlusCircle size={16}/>} size="sm">
                    Add Milestone
                </Button>
            </div>
        </div>

      {editingMilestone && (
        <EditMilestoneForm
          milestone={editingMilestone}
          onSave={handleSaveMilestone}
          onCancel={() => setEditingMilestone(null)}
        />
      )}

      {milestones.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {milestones.map(m => (
            <MilestoneCardDisplay key={m.id} milestone={m} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-4">No milestones defined yet. Click "Add Milestone" to start.</p>
      )}

      {/* Visual Timeline Placeholder */}
      <div className="mt-8 pt-6 border-t border-gray-700">
        <h4 className="text-md font-semibold text-gray-300 mb-3">Visual Timeline (Conceptual)</h4>
        <div className="flex space-x-2 overflow-x-auto pb-4">
          {milestones.sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map((m, index) => (
            <div key={m.id} className="min-w-[150px] bg-gray-700 p-3 rounded-md shadow flex-shrink-0">
              <p className="text-xs font-semibold text-indigo-300">{m.name}</p>
              <p className="text-xxs text-gray-400">{new Date(m.dueDate).toLocaleDateString()}</p>
              <p className={`text-xxs ${m.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}`}>{m.status}</p>
            </div>
          ))}
          {milestones.length === 0 && <p className="text-sm text-gray-500">Add milestones to see timeline.</p>}
        </div>
      </div>
    </div>
  );
};


// Inner component for editing a milestone
interface EditMilestoneFormProps {
  milestone: Milestone;
  onSave: (milestone: Milestone) => void;
  onCancel: () => void;
}

const EditMilestoneForm: React.FC<EditMilestoneFormProps> = ({ milestone, onSave, onCancel }) => {
  const [formState, setFormState] = useState<Milestone>(milestone);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: name === 'totalFunding' || name === 'fundingReleased' ? parseFloat(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formState);
  };

  return (
    <Card title={formState.id.startsWith('mNew') ? "Add New Milestone" : `Edit Milestone: ${milestone.name}`} className="mb-6 border border-indigo-500">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs font-medium text-gray-300">Name</label>
          <input type="text" name="name" id="name" value={formState.name} onChange={handleChange} className="mt-1 block w-full bg-gray-600 border-gray-500 rounded-md shadow-sm p-2 text-sm text-white focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div>
          <label htmlFor="description" className="block text-xs font-medium text-gray-300">Description</label>
          <textarea name="description" id="description" value={formState.description} onChange={handleChange} rows={3} className="mt-1 block w-full bg-gray-600 border-gray-500 rounded-md shadow-sm p-2 text-sm text-white focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dueDate" className="block text-xs font-medium text-gray-300">Due Date</label>
            <input type="date" name="dueDate" id="dueDate" value={formState.dueDate} onChange={handleChange} className="mt-1 block w-full bg-gray-600 border-gray-500 rounded-md shadow-sm p-2 text-sm text-white focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <div>
            <label htmlFor="status" className="block text-xs font-medium text-gray-300">Status</label>
            <select name="status" id="status" value={formState.status} onChange={handleChange} className="mt-1 block w-full bg-gray-600 border-gray-500 rounded-md shadow-sm p-2 text-sm text-white focus:border-indigo-500 focus:ring-indigo-500">
              {(['Pending', 'In Progress', 'Completed', 'Requires Attention'] as Milestone['status'][]).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="totalFunding" className="block text-xs font-medium text-gray-300">Total Funding Allocation</label>
                <input type="number" name="totalFunding" id="totalFunding" value={formState.totalFunding} onChange={handleChange} className="mt-1 block w-full bg-gray-600 border-gray-500 rounded-md shadow-sm p-2 text-sm text-white focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
                <label htmlFor="fundingReleased" className="block text-xs font-medium text-gray-300">Funding Released</label>
                <input type="number" name="fundingReleased" id="fundingReleased" value={formState.fundingReleased} onChange={handleChange} className="mt-1 block w-full bg-gray-600 border-gray-500 rounded-md shadow-sm p-2 text-sm text-white focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
        </div>
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save Milestone</Button>
        </div>
      </form>
    </Card>
  );
};
