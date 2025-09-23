import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Plus, Trash2, TrendingUp } from 'lucide-react';

interface Sprint {
  id: string;
  name: string;
  planned: number;
  completed: number;
  startDate: string;
  endDate: string;
}

export const VelocityTracker: React.FC = () => {
  const [sprints, setSprints] = useState<Sprint[]>([
    {
      id: '1',
      name: 'Sprint 1',
      planned: 25,
      completed: 23,
      startDate: '2024-01-01',
      endDate: '2024-01-14'
    },
    {
      id: '2',
      name: 'Sprint 2',
      planned: 30,
      completed: 28,
      startDate: '2024-01-15',
      endDate: '2024-01-28'
    },
    {
      id: '3',
      name: 'Sprint 3',
      planned: 27,
      completed: 31,
      startDate: '2024-01-29',
      endDate: '2024-02-11'
    }
  ]);

  const [newSprint, setNewSprint] = useState<Partial<Sprint>>({
    name: '',
    planned: 0,
    completed: 0,
    startDate: '',
    endDate: ''
  });

  const addSprint = () => {
    if (newSprint.name && newSprint.planned && newSprint.completed) {
      const sprint: Sprint = {
        id: Date.now().toString(),
        name: newSprint.name,
        planned: newSprint.planned,
        completed: newSprint.completed,
        startDate: newSprint.startDate || '',
        endDate: newSprint.endDate || ''
      };
      setSprints([...sprints, sprint]);
      setNewSprint({ name: '', planned: 0, completed: 0, startDate: '', endDate: '' });
    }
  };

  const removeSprint = (id: string) => {
    setSprints(sprints.filter(sprint => sprint.id !== id));
  };

  const calculateMetrics = () => {
    if (sprints.length === 0) return { avgVelocity: 0, avgCommitment: 0, predictability: 0 };
    
    const avgVelocity = sprints.reduce((sum, s) => sum + s.completed, 0) / sprints.length;
    const avgCommitment = sprints.reduce((sum, s) => sum + s.planned, 0) / sprints.length;
    const predictability = sprints.reduce((sum, s) => sum + Math.abs(s.completed - s.planned), 0) / sprints.length;
    
    return { avgVelocity, avgCommitment, predictability };
  };

  const metrics = calculateMetrics();
  const maxPoints = Math.max(...sprints.map(s => Math.max(s.planned, s.completed)), 10);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📈</span>
            Velocity Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Metrics Overview */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{metrics.avgVelocity.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Avg Velocity</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{metrics.avgCommitment.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Avg Commitment</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{metrics.predictability.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Avg Variance</div>
              </CardContent>
            </Card>
          </div>

          {/* Velocity Chart */}
          <div className="bg-white p-4 border rounded-lg">
            <h3 className="font-semibold mb-4">Velocity Trend</h3>
            <svg width="100%" height="200" viewBox="0 0 500 200">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line key={i} x1="50" y1={30 + i * 30} x2="450" y2={30 + i * 30} stroke="#e5e7eb" strokeWidth="1" />
              ))}
              
              {/* Bars */}
              {sprints.map((sprint, index) => {
                const x = 70 + index * 80;
                const plannedHeight = (sprint.planned / maxPoints) * 120;
                const completedHeight = (sprint.completed / maxPoints) * 120;
                
                return (
                  <g key={sprint.id}>
                    {/* Planned bar */}
                    <rect
                      x={x - 15}
                      y={150 - plannedHeight}
                      width="12"
                      height={plannedHeight}
                      fill="#94a3b8"
                      opacity="0.7"
                    />
                    {/* Completed bar */}
                    <rect
                      x={x + 3}
                      y={150 - completedHeight}
                      width="12"
                      height={completedHeight}
                      fill="#3b82f6"
                    />
                    {/* Sprint label */}
                    <text x={x} y="170" fontSize="10" fill="#666" textAnchor="middle">
                      {sprint.name}
                    </text>
                    {/* Values */}
                    <text x={x} y="185" fontSize="8" fill="#666" textAnchor="middle">
                      {sprint.planned}/{sprint.completed}
                    </text>
                  </g>
                );
              })}
            </svg>
            
            <div className="flex gap-4 mt-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-gray-400 opacity-70"></div>
                <span>Planned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-blue-500"></div>
                <span>Completed</span>
              </div>
            </div>
          </div>

          {/* Add New Sprint */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add New Sprint</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sprint-name">Sprint Name</Label>
                  <Input
                    id="sprint-name"
                    value={newSprint.name || ''}
                    onChange={(e) => setNewSprint({...newSprint, name: e.target.value})}
                    placeholder="Sprint 4"
                  />
                </div>
                <div>
                  <Label htmlFor="planned-points">Planned Points</Label>
                  <Input
                    id="planned-points"
                    type="number"
                    value={newSprint.planned || ''}
                    onChange={(e) => setNewSprint({...newSprint, planned: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="completed-points">Completed Points</Label>
                  <Input
                    id="completed-points"
                    type="number"
                    value={newSprint.completed || ''}
                    onChange={(e) => setNewSprint({...newSprint, completed: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newSprint.startDate || ''}
                    onChange={(e) => setNewSprint({...newSprint, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={newSprint.endDate || ''}
                    onChange={(e) => setNewSprint({...newSprint, endDate: e.target.value})}
                  />
                </div>
              </div>
              
              <Button onClick={addSprint} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Sprint
              </Button>
            </CardContent>
          </Card>

          {/* Sprint History */}
          <div className="space-y-2">
            <h3 className="font-semibold">Sprint History</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {sprints.map(sprint => {
                const variance = sprint.completed - sprint.planned;
                const varianceColor = variance > 0 ? 'text-green-600' : variance < 0 ? 'text-red-600' : 'text-gray-600';
                
                return (
                  <div key={sprint.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex-1">
                      <div className="font-medium">{sprint.name}</div>
                      <div className="text-sm text-gray-600">
                        {sprint.startDate} - {sprint.endDate}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium">{sprint.planned}</div>
                        <div className="text-xs text-gray-500">Planned</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{sprint.completed}</div>
                        <div className="text-xs text-gray-500">Completed</div>
                      </div>
                      <div className={`text-center ${varianceColor}`}>
                        <div className="text-sm font-medium">{variance > 0 ? '+' : ''}{variance}</div>
                        <div className="text-xs">Variance</div>
                      </div>
                      <Button
                        onClick={() => removeSprint(sprint.id)}
                        size="sm"
                        variant="outline"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VelocityTracker;