import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Plus, X, User, Target } from 'lucide-react';

interface UserStory {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  epic: string;
}

interface Epic {
  id: string;
  title: string;
  description: string;
  color: string;
}

interface UserJourney {
  id: string;
  step: string;
  stories: UserStory[];
}

const UserStoryMappingTool: React.FC = () => {
  const [epics, setEpics] = useState<Epic[]>([
    { id: '1', title: 'User Authentication', description: 'Login and registration features', color: 'bg-blue-100' },
    { id: '2', title: 'Dashboard', description: 'Main user interface', color: 'bg-green-100' },
    { id: '3', title: 'Profile Management', description: 'User profile features', color: 'bg-purple-100' }
  ]);

  const [journey, setJourney] = useState<UserJourney[]>([
    { id: '1', step: 'Discovery', stories: [] },
    { id: '2', step: 'Registration', stories: [] },
    { id: '3', step: 'Onboarding', stories: [] },
    { id: '4', step: 'Usage', stories: [] },
    { id: '5', step: 'Support', stories: [] }
  ]);

  const [newStory, setNewStory] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    epic: '',
    journeyStep: ''
  });

  const [newEpic, setNewEpic] = useState({
    title: '',
    description: ''
  });

  const addEpic = () => {
    if (!newEpic.title.trim()) return;
    
    const colors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-yellow-100', 'bg-pink-100'];
    const epic: Epic = {
      id: Date.now().toString(),
      title: newEpic.title,
      description: newEpic.description,
      color: colors[epics.length % colors.length]
    };

    setEpics(prev => [...prev, epic]);
    setNewEpic({ title: '', description: '' });
  };

  const addStory = () => {
    if (!newStory.title.trim() || !newStory.journeyStep) return;
    
    const story: UserStory = {
      id: Date.now().toString(),
      title: newStory.title,
      description: newStory.description,
      priority: newStory.priority,
      epic: newStory.epic
    };

    setJourney(prev => prev.map(step => 
      step.id === newStory.journeyStep
        ? { ...step, stories: [...step.stories, story] }
        : step
    ));
    
    setNewStory({
      title: '',
      description: '',
      priority: 'medium',
      epic: '',
      journeyStep: ''
    });
  };

  const removeStory = (storyId: string, stepId: string) => {
    setJourney(prev => prev.map(step => 
      step.id === stepId
        ? { ...step, stories: step.stories.filter(story => story.id !== storyId) }
        : step
    ));
  };

  const moveStory = (storyId: string, fromStep: string, toStep: string) => {
    const story = journey.find(step => step.id === fromStep)?.stories.find(s => s.id === storyId);
    if (!story) return;

    setJourney(prev => prev.map(step => {
      if (step.id === fromStep) {
        return { ...step, stories: step.stories.filter(s => s.id !== storyId) };
      }
      if (step.id === toStep) {
        return { ...step, stories: [...step.stories, story] };
      }
      return step;
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEpicById = (epicId: string) => {
    return epics.find(epic => epic.id === epicId);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Story Mapping Tool</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Epic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Epic title"
              value={newEpic.title}
              onChange={(e) => setNewEpic(prev => ({ ...prev, title: e.target.value }))}
            />
            <Input
              placeholder="Epic description"
              value={newEpic.description}
              onChange={(e) => setNewEpic(prev => ({ ...prev, description: e.target.value }))}
            />
            <Button onClick={addEpic} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Epic
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add User Story</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Story title"
              value={newStory.title}
              onChange={(e) => setNewStory(prev => ({ ...prev, title: e.target.value }))}
            />
            <Input
              placeholder="Story description"
              value={newStory.description}
              onChange={(e) => setNewStory(prev => ({ ...prev, description: e.target.value }))}
            />
            <div className="grid grid-cols-3 gap-2">
              <select 
                value={newStory.priority}
                onChange={(e) => setNewStory(prev => ({ ...prev, priority: e.target.value as any }))}
                className="px-3 py-2 border rounded-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select 
                value={newStory.epic}
                onChange={(e) => setNewStory(prev => ({ ...prev, epic: e.target.value }))}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">Select Epic</option>
                {epics.map(epic => (
                  <option key={epic.id} value={epic.id}>{epic.title}</option>
                ))}
              </select>
              <select 
                value={newStory.journeyStep}
                onChange={(e) => setNewStory(prev => ({ ...prev, journeyStep: e.target.value }))}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">Journey Step</option>
                {journey.map(step => (
                  <option key={step.id} value={step.id}>{step.step}</option>
                ))}
              </select>
            </div>
            <Button onClick={addStory} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Story
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Epics Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {epics.map(epic => (
              <Card key={epic.id} className={epic.color}>
                <CardContent className="p-4">
                  <h4 className="font-medium">{epic.title}</h4>
                  <p className="text-sm text-gray-600">{epic.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            User Journey Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {journey.map(step => (
              <Card key={step.id} className="min-h-[400px]">
                <CardHeader>
                  <CardTitle className="text-center text-sm">
                    {step.step}
                    <Badge variant="secondary" className="ml-2">{step.stories.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {step.stories.map(story => {
                    const epic = getEpicById(story.epic);
                    return (
                      <Card key={story.id} className={`p-3 ${epic?.color || 'bg-gray-50'}`}>
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h5 className="font-medium text-sm">{story.title}</h5>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeStory(story.id, step.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          {story.description && (
                            <p className="text-xs text-gray-600">{story.description}</p>
                          )}
                          <div className="flex justify-between items-center">
                            <Badge className={getPriorityColor(story.priority)} size="sm">
                              {story.priority}
                            </Badge>
                            {epic && (
                              <Badge variant="outline" className="text-xs">{epic.title}</Badge>
                            )}
                          </div>
                          <div className="flex gap-1">
                            {journey.filter(s => s.id !== step.id).map(targetStep => (
                              <Button
                                key={targetStep.id}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => moveStory(story.id, step.id, targetStep.id)}
                              >
                                → {targetStep.step}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStoryMappingTool;