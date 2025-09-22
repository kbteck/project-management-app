import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Calendar, Target, Users, TrendingUp } from 'lucide-react';

interface UserStory {
  id: string;
  title: string;
  description: string;
  storyPoints: number;
  priority: 'high' | 'medium' | 'low';
  acceptanceCriteria: string[];
}

interface TeamMember {
  id: string;
  name: string;
  capacity: number;
  skills: string[];
}

const SprintPlanningAssistant: React.FC = () => {
  const [sprintDetails, setSprintDetails] = useState({
    name: '',
    goal: '',
    duration: 14,
    startDate: ''
  });

  const [team] = useState<TeamMember[]>([
    { id: '1', name: 'Alice Johnson', capacity: 40, skills: ['Frontend', 'React'] },
    { id: '2', name: 'Bob Smith', capacity: 35, skills: ['Backend', 'Node.js'] },
    { id: '3', name: 'Carol Davis', capacity: 30, skills: ['Design', 'UX'] }
  ]);

  const [backlog, setBacklog] = useState<UserStory[]>([
    {
      id: '1',
      title: 'User Login System',
      description: 'Implement secure user authentication',
      storyPoints: 8,
      priority: 'high',
      acceptanceCriteria: ['Users can login with email/password', 'Password validation', 'Remember me option']
    },
    {
      id: '2',
      title: 'Dashboard Layout',
      description: 'Create responsive dashboard layout',
      storyPoints: 5,
      priority: 'medium',
      acceptanceCriteria: ['Responsive design', 'Navigation menu', 'User profile section']
    }
  ]);

  const [selectedStories, setSelectedStories] = useState<string[]>([]);
  const [newStory, setNewStory] = useState({
    title: '',
    description: '',
    storyPoints: 1,
    priority: 'medium' as const
  });

  const addStory = () => {
    if (!newStory.title.trim()) return;
    
    const story: UserStory = {
      id: Date.now().toString(),
      title: newStory.title,
      description: newStory.description,
      storyPoints: newStory.storyPoints,
      priority: newStory.priority,
      acceptanceCriteria: []
    };

    setBacklog(prev => [...prev, story]);
    setNewStory({ title: '', description: '', storyPoints: 1, priority: 'medium' });
  };

  const toggleStorySelection = (storyId: string) => {
    setSelectedStories(prev => 
      prev.includes(storyId) 
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
    );
  };

  const getSelectedStoryPoints = () => {
    return backlog
      .filter(story => selectedStories.includes(story.id))
      .reduce((sum, story) => sum + story.storyPoints, 0);
  };

  const getTeamCapacity = () => {
    return team.reduce((sum, member) => sum + member.capacity, 0);
  };

  const getCapacityUtilization = () => {
    const capacity = getTeamCapacity();
    const committed = getSelectedStoryPoints();
    return capacity > 0 ? (committed / capacity) * 100 : 0;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sprint Planning Assistant</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Sprint Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Sprint name"
              value={sprintDetails.name}
              onChange={(e) => setSprintDetails(prev => ({ ...prev, name: e.target.value }))}
            />
            <Textarea
              placeholder="Sprint goal"
              value={sprintDetails.goal}
              onChange={(e) => setSprintDetails(prev => ({ ...prev, goal: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Duration (days)"
                value={sprintDetails.duration}
                onChange={(e) => setSprintDetails(prev => ({ ...prev, duration: parseInt(e.target.value) || 14 }))}
              />
              <Input
                type="date"
                value={sprintDetails.startDate}
                onChange={(e) => setSprintDetails(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {team.map(member => (
                <div key={member.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <div className="flex gap-1">
                      {member.skills.map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <Badge>{member.capacity}h</Badge>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex justify-between items-center font-medium">
                  <span>Total Capacity:</span>
                  <span>{getTeamCapacity()}h</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Committed:</span>
                  <span>{getSelectedStoryPoints()}h ({Math.round(getCapacityUtilization())}%)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add User Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Story title"
              value={newStory.title}
              onChange={(e) => setNewStory(prev => ({ ...prev, title: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Story Points"
                value={newStory.storyPoints}
                onChange={(e) => setNewStory(prev => ({ ...prev, storyPoints: parseInt(e.target.value) || 1 }))}
              />
              <select 
                value={newStory.priority}
                onChange={(e) => setNewStory(prev => ({ ...prev, priority: e.target.value as any }))}
                className="px-3 py-2 border rounded-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <Textarea
            placeholder="Story description"
            value={newStory.description}
            onChange={(e) => setNewStory(prev => ({ ...prev, description: e.target.value }))}
          />
          <Button onClick={addStory} className="w-full">Add Story</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Product Backlog</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Selected: {getSelectedStoryPoints()} SP</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {backlog.map(story => (
              <Card 
                key={story.id} 
                className={`p-4 cursor-pointer transition-colors ${
                  selectedStories.includes(story.id) ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => toggleStorySelection(story.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{story.title}</h4>
                      <Badge className={getPriorityColor(story.priority)}>{story.priority}</Badge>
                      <Badge variant="outline">{story.storyPoints} SP</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{story.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedStories.includes(story.id)}
                    onChange={() => toggleStorySelection(story.id)}
                    className="ml-4"
                  />
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SprintPlanningAssistant;