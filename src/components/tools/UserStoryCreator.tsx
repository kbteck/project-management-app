import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Copy, Plus, Trash2 } from 'lucide-react';

interface UserStory {
  id: string;
  title: string;
  persona: string;
  action: string;
  benefit: string;
  acceptanceCriteria: string[];
  priority: 'High' | 'Medium' | 'Low';
  storyPoints: number;
  epic: string;
}

export default function UserStoryCreator() {
  const [stories, setStories] = useState<UserStory[]>([
    {
      id: '1',
      title: 'User Login',
      persona: 'registered user',
      action: 'log into my account',
      benefit: 'I can access my personalized dashboard',
      acceptanceCriteria: ['Valid credentials allow login', 'Invalid credentials show error', 'Remember me option works'],
      priority: 'High',
      storyPoints: 5,
      epic: 'Authentication'
    }
  ]);

  const [newStory, setNewStory] = useState({
    title: '',
    persona: '',
    action: '',
    benefit: '',
    acceptanceCriteria: [''],
    priority: 'Medium' as const,
    storyPoints: 1,
    epic: ''
  });

  const addStory = () => {
    if (newStory.title && newStory.persona && newStory.action && newStory.benefit) {
      setStories([...stories, {
        id: Date.now().toString(),
        ...newStory,
        acceptanceCriteria: newStory.acceptanceCriteria.filter(criteria => criteria.trim() !== '')
      }]);
      setNewStory({
        title: '',
        persona: '',
        action: '',
        benefit: '',
        acceptanceCriteria: [''],
        priority: 'Medium',
        storyPoints: 1,
        epic: ''
      });
    }
  };

  const deleteStory = (id: string) => {
    setStories(stories.filter(story => story.id !== id));
  };

  const addAcceptanceCriteria = () => {
    setNewStory({
      ...newStory,
      acceptanceCriteria: [...newStory.acceptanceCriteria, '']
    });
  };

  const updateAcceptanceCriteria = (index: number, value: string) => {
    const updated = [...newStory.acceptanceCriteria];
    updated[index] = value;
    setNewStory({ ...newStory, acceptanceCriteria: updated });
  };

  const removeAcceptanceCriteria = (index: number) => {
    setNewStory({
      ...newStory,
      acceptanceCriteria: newStory.acceptanceCriteria.filter((_, i) => i !== index)
    });
  };

  const copyStoryText = (story: UserStory) => {
    const storyText = `**${story.title}**

As a ${story.persona}, I want to ${story.action} so that ${story.benefit}.

**Acceptance Criteria:**
${story.acceptanceCriteria.map(criteria => `- ${criteria}`).join('\n')}

**Details:**
- Priority: ${story.priority}
- Story Points: ${story.storyPoints}
- Epic: ${story.epic}`;

    navigator.clipboard.writeText(storyText);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New User Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Story title"
            value={newStory.title}
            onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
          />
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium mb-3">User Story Template:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">As a</span>
                <Input
                  placeholder="user persona (e.g., registered user, admin, customer)"
                  value={newStory.persona}
                  onChange={(e) => setNewStory({ ...newStory, persona: e.target.value })}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">I want to</span>
                <Input
                  placeholder="action or functionality (e.g., view my order history)"
                  value={newStory.action}
                  onChange={(e) => setNewStory({ ...newStory, action: e.target.value })}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">so that</span>
                <Input
                  placeholder="benefit or value (e.g., I can track my purchases)"
                  value={newStory.benefit}
                  onChange={(e) => setNewStory({ ...newStory, benefit: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Acceptance Criteria</label>
              <Button variant="outline" size="sm" onClick={addAcceptanceCriteria}>
                <Plus className="w-4 h-4 mr-1" />Add
              </Button>
            </div>
            {newStory.acceptanceCriteria.map((criteria, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  placeholder="Acceptance criteria"
                  value={criteria}
                  onChange={(e) => updateAcceptanceCriteria(index, e.target.value)}
                  className="flex-1"
                />
                {newStory.acceptanceCriteria.length > 1 && (
                  <Button variant="outline" size="sm" onClick={() => removeAcceptanceCriteria(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={newStory.priority} onValueChange={(value: any) => setNewStory({ ...newStory, priority: value })}>
              <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Story Points"
              value={newStory.storyPoints}
              onChange={(e) => setNewStory({ ...newStory, storyPoints: parseInt(e.target.value) || 1 })}
            />
            <Input
              placeholder="Epic"
              value={newStory.epic}
              onChange={(e) => setNewStory({ ...newStory, epic: e.target.value })}
            />
          </div>

          <Button onClick={addStory} className="w-full">
            <Plus className="w-4 h-4 mr-2" />Create User Story
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Created Stories ({stories.length})</h3>
        {stories.map((story) => (
          <Card key={story.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-lg">{story.title}</h4>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(story.priority)}>{story.priority}</Badge>
                  <Badge variant="secondary">{story.storyPoints} pts</Badge>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <p className="text-sm">
                  As a <strong>{story.persona}</strong>, I want to <strong>{story.action}</strong> so that <strong>{story.benefit}</strong>.
                </p>
              </div>

              {story.acceptanceCriteria.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium mb-2">Acceptance Criteria:</p>
                  <ul className="text-sm space-y-1">
                    {story.acceptanceCriteria.map((criteria, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-gray-400">•</span>
                        <span>{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-between items-center">
                <Badge variant="outline">Epic: {story.epic}</Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyStoryText(story)}>
                    <Copy className="w-4 h-4 mr-1" />Copy
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteStory(story.id)}>
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
}