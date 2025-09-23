import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, Calendar, Trash2 } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  date: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export const ProjectTimelineViewer: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: '1', title: 'Project Kickoff', date: '2024-01-15', status: 'completed' },
    { id: '2', title: 'Requirements Gathering', date: '2024-02-01', status: 'completed' },
    { id: '3', title: 'Development Phase 1', date: '2024-03-01', status: 'in-progress' },
    { id: '4', title: 'Testing Phase', date: '2024-04-15', status: 'pending' },
    { id: '5', title: 'Project Delivery', date: '2024-05-30', status: 'pending' },
  ]);

  const [newMilestone, setNewMilestone] = useState({ title: '', date: '' });

  const addMilestone = () => {
    if (newMilestone.title && newMilestone.date) {
      const milestone: Milestone = {
        id: Date.now().toString(),
        title: newMilestone.title,
        date: newMilestone.date,
        status: 'pending'
      };
      setMilestones([...milestones, milestone]);
      setNewMilestone({ title: '', date: '' });
    }
  };

  const deleteMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">📅 Project Timeline Viewer</h2>
        <p className="text-gray-600">Visualize and manage your project milestones</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Milestone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Milestone title"
              value={newMilestone.title}
              onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
              className="flex-1"
            />
            <Input
              type="date"
              value={newMilestone.date}
              onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
            />
            <Button onClick={addMilestone}>Add</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {milestones.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((milestone) => (
          <Card key={milestone.id} className="relative">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${getStatusColor(milestone.status)}`}></div>
                  <div>
                    <h3 className="font-semibold">{milestone.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(milestone.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                    milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {milestone.status.replace('-', ' ')}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMilestone(milestone.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectTimelineViewer;