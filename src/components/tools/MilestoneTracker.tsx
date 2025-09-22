import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Plus, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
}

export const MilestoneTracker: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: '1',
      title: 'Requirements Analysis Complete',
      description: 'Finalize all project requirements',
      dueDate: '2024-02-15',
      status: 'completed',
      priority: 'high',
      assignee: 'John Doe'
    },
    {
      id: '2',
      title: 'Design Phase Complete',
      description: 'Complete UI/UX design mockups',
      dueDate: '2024-03-01',
      status: 'in-progress',
      priority: 'high',
      assignee: 'Jane Smith'
    },
    {
      id: '3',
      title: 'Development Milestone 1',
      description: 'Core functionality implementation',
      dueDate: '2024-03-15',
      status: 'not-started',
      priority: 'medium',
      assignee: 'Mike Johnson'
    }
  ]);

  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as const,
    assignee: ''
  });

  const addMilestone = () => {
    if (newMilestone.title && newMilestone.dueDate) {
      const milestone: Milestone = {
        id: Date.now().toString(),
        ...newMilestone,
        status: 'not-started'
      };
      setMilestones([...milestones, milestone]);
      setNewMilestone({ title: '', description: '', dueDate: '', priority: 'medium', assignee: '' });
    }
  };

  const updateStatus = (id: string, status: Milestone['status']) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'overdue': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Calendar className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">🎯 Milestone Tracker</h2>
        <p className="text-gray-600">Track and manage project milestones</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Milestone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="Milestone title"
              value={newMilestone.title}
              onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
            />
            <Input
              placeholder="Assignee"
              value={newMilestone.assignee}
              onChange={(e) => setNewMilestone({ ...newMilestone, assignee: e.target.value })}
            />
            <Input
              type="date"
              value={newMilestone.dueDate}
              onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
            />
            <select
              value={newMilestone.priority}
              onChange={(e) => setNewMilestone({ ...newMilestone, priority: e.target.value as 'low' | 'medium' | 'high' })}
              className="px-3 py-2 border rounded-md"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <Input
            placeholder="Description"
            value={newMilestone.description}
            onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
            className="mb-4"
          />
          <Button onClick={addMilestone}>Add Milestone</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {milestones.map((milestone) => (
          <Card key={milestone.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(milestone.status)}
                  <CardTitle className="text-lg">{milestone.title}</CardTitle>
                </div>
                <Badge className={getPriorityColor(milestone.priority)}>
                  {milestone.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                </div>
                <div>Assignee: {milestone.assignee}</div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant={milestone.status === 'in-progress' ? 'default' : 'outline'}
                  onClick={() => updateStatus(milestone.id, 'in-progress')}
                >
                  In Progress
                </Button>
                <Button
                  size="sm"
                  variant={milestone.status === 'completed' ? 'default' : 'outline'}
                  onClick={() => updateStatus(milestone.id, 'completed')}
                >
                  Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};