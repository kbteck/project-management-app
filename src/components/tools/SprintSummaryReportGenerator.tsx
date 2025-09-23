import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Download, Plus, Trash2, FileText } from 'lucide-react';

interface SprintMetrics {
  sprintName: string;
  startDate: string;
  endDate: string;
  plannedPoints: number;
  completedPoints: number;
  completedStories: number;
  totalStories: number;
  bugsFound: number;
  bugsFixed: number;
}

interface SprintHighlight {
  id: string;
  type: 'achievement' | 'challenge' | 'learning';
  description: string;
}

const SprintSummaryReportGenerator: React.FC = () => {
  const [metrics, setMetrics] = useState<SprintMetrics>({
    sprintName: 'Sprint 5',
    startDate: '2024-01-15',
    endDate: '2024-01-28',
    plannedPoints: 32,
    completedPoints: 28,
    completedStories: 8,
    totalStories: 10,
    bugsFound: 3,
    bugsFixed: 2
  });

  const [highlights, setHighlights] = useState<SprintHighlight[]>([
    {
      id: '1',
      type: 'achievement',
      description: 'Successfully implemented user authentication system'
    },
    {
      id: '2', 
      type: 'challenge',
      description: 'Database performance issues caused delays in API development'
    },
    {
      id: '3',
      type: 'learning',
      description: 'Team learned new testing framework which will improve future velocity'
    }
  ]);

  const [newHighlight, setNewHighlight] = useState<Partial<SprintHighlight>>({
    type: 'achievement',
    description: ''
  });

  const [teamFeedback, setTeamFeedback] = useState('Overall positive sprint with good collaboration. Need to improve estimation accuracy.');
  const [nextSprintGoals, setNextSprintGoals] = useState('Focus on API optimization and complete remaining user stories from current sprint.');

  const addHighlight = () => {
    if (newHighlight.description && newHighlight.type) {
      const highlight: SprintHighlight = {
        id: Date.now().toString(),
        type: newHighlight.type as any,
        description: newHighlight.description
      };
      setHighlights([...highlights, highlight]);
      setNewHighlight({ type: 'achievement', description: '' });
    }
  };

  const removeHighlight = (id: string) => {
    setHighlights(highlights.filter(h => h.id !== id));
  };

  const calculateVelocity = () => {
    return metrics.plannedPoints > 0 ? (metrics.completedPoints / metrics.plannedPoints * 100).toFixed(1) : '0';
  };

  const calculateStoryCompletion = () => {
    return metrics.totalStories > 0 ? (metrics.completedStories / metrics.totalStories * 100).toFixed(1) : '0';
  };

  const generateReport = () => {
    const report = `
SPRINT SUMMARY REPORT
=====================

Sprint: ${metrics.sprintName}
Duration: ${metrics.startDate} to ${metrics.endDate}

METRICS
-------
Planned Story Points: ${metrics.plannedPoints}
Completed Story Points: ${metrics.completedPoints}
Velocity Achievement: ${calculateVelocity()}%

Stories Completed: ${metrics.completedStories}/${metrics.totalStories} (${calculateStoryCompletion()}%)

Bugs Found: ${metrics.bugsFound}
Bugs Fixed: ${metrics.bugsFixed}

HIGHLIGHTS
----------
${highlights.map(h => `${h.type.toUpperCase()}: ${h.description}`).join('\n')}

TEAM FEEDBACK
-------------
${teamFeedback}

NEXT SPRINT GOALS
-----------------
${nextSprintGoals}

Generated on: ${new Date().toLocaleDateString()}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${metrics.sprintName}-Summary-Report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getHighlightColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'bg-green-100 text-green-800';
      case 'challenge': return 'bg-red-100 text-red-800';
      case 'learning': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📊</span>
            Sprint Summary Report Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sprint Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sprint Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sprint-name">Sprint Name</Label>
                  <Input
                    id="sprint-name"
                    value={metrics.sprintName}
                    onChange={(e) => setMetrics({...metrics, sprintName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={metrics.startDate}
                    onChange={(e) => setMetrics({...metrics, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={metrics.endDate}
                    onChange={(e) => setMetrics({...metrics, endDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="planned-points">Planned Points</Label>
                  <Input
                    id="planned-points"
                    type="number"
                    value={metrics.plannedPoints}
                    onChange={(e) => setMetrics({...metrics, plannedPoints: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="completed-points">Completed Points</Label>
                  <Input
                    id="completed-points"
                    type="number"
                    value={metrics.completedPoints}
                    onChange={(e) => setMetrics({...metrics, completedPoints: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="completed-stories">Completed Stories</Label>
                  <Input
                    id="completed-stories"
                    type="number"
                    value={metrics.completedStories}
                    onChange={(e) => setMetrics({...metrics, completedStories: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="total-stories">Total Stories</Label>
                  <Input
                    id="total-stories"
                    type="number"
                    value={metrics.totalStories}
                    onChange={(e) => setMetrics({...metrics, totalStories: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bugs-found">Bugs Found</Label>
                  <Input
                    id="bugs-found"
                    type="number"
                    value={metrics.bugsFound}
                    onChange={(e) => setMetrics({...metrics, bugsFound: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="bugs-fixed">Bugs Fixed</Label>
                  <Input
                    id="bugs-fixed"
                    type="number"
                    value={metrics.bugsFixed}
                    onChange={(e) => setMetrics({...metrics, bugsFixed: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{calculateVelocity()}%</div>
                <div className="text-sm text-gray-600">Velocity Achievement</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{calculateStoryCompletion()}%</div>
                <div className="text-sm text-gray-600">Story Completion</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{metrics.bugsFixed}/{metrics.bugsFound}</div>
                <div className="text-sm text-gray-600">Bugs Resolved</div>
              </CardContent>
            </Card>
          </div>

          {/* Sprint Highlights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sprint Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <select
                  value={newHighlight.type}
                  onChange={(e) => setNewHighlight({...newHighlight, type: e.target.value as any})}
                  className="px-3 py-2 border rounded"
                >
                  <option value="achievement">Achievement</option>
                  <option value="challenge">Challenge</option>
                  <option value="learning">Learning</option>
                </select>
                <Input
                  value={newHighlight.description || ''}
                  onChange={(e) => setNewHighlight({...newHighlight, description: e.target.value})}
                  placeholder="Describe the highlight..."
                  className="flex-1"
                />
                <Button onClick={addHighlight}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {highlights.map(highlight => (
                  <div key={highlight.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <Badge className={getHighlightColor(highlight.type)}>
                        {highlight.type}
                      </Badge>
                      <span>{highlight.description}</span>
                    </div>
                    <Button
                      onClick={() => removeHighlight(highlight.id)}
                      size="sm"
                      variant="outline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Sections */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="team-feedback">Team Feedback</Label>
              <Textarea
                id="team-feedback"
                value={teamFeedback}
                onChange={(e) => setTeamFeedback(e.target.value)}
                placeholder="Overall team feedback and observations..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="next-sprint-goals">Next Sprint Goals</Label>
              <Textarea
                id="next-sprint-goals"
                value={nextSprintGoals}
                onChange={(e) => setNextSprintGoals(e.target.value)}
                placeholder="Goals and focus areas for next sprint..."
                rows={4}
              />
            </div>
          </div>

          {/* Generate Report */}
          <div className="flex justify-center">
            <Button onClick={generateReport} size="lg" className="px-8">
              <Download className="w-4 h-4 mr-2" />
              Generate & Download Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SprintSummaryReportGenerator;