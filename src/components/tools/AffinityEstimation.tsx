import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Story {
  id: string;
  title: string;
  description: string;
  group?: 'small' | 'medium' | 'large' | 'xl';
}

export default function AffinityEstimation() {
  const [stories, setStories] = useState<Story[]>([
    { id: '1', title: 'User Login', description: 'Basic authentication' },
    { id: '2', title: 'Dashboard', description: 'Main user interface' },
    { id: '3', title: 'Bug Fix', description: 'Minor styling issue' },
    { id: '4', title: 'API Integration', description: 'Connect to external service' }
  ]);
  const [newStory, setNewStory] = useState({ title: '', description: '' });

  const groups = {
    small: { name: 'Small', color: 'bg-green-100 border-green-300', estimate: '1-3 days' },
    medium: { name: 'Medium', color: 'bg-yellow-100 border-yellow-300', estimate: '4-8 days' },
    large: { name: 'Large', color: 'bg-orange-100 border-orange-300', estimate: '9-15 days' },
    xl: { name: 'XL', color: 'bg-red-100 border-red-300', estimate: '16+ days' }
  };

  const addStory = () => {
    if (!newStory.title.trim()) return;
    const story: Story = {
      id: Date.now().toString(),
      title: newStory.title,
      description: newStory.description
    };
    setStories([...stories, story]);
    setNewStory({ title: '', description: '' });
  };

  const moveStoryToGroup = (storyId: string, group: 'small' | 'medium' | 'large' | 'xl') => {
    setStories(stories.map(story => 
      story.id === storyId ? { ...story, group } : story
    ));
  };

  const removeStoryFromGroup = (storyId: string) => {
    setStories(stories.map(story => 
      story.id === storyId ? { ...story, group: undefined } : story
    ));
  };

  const getUngroupedStories = () => stories.filter(story => !story.group);
  const getStoriesInGroup = (group: string) => stories.filter(story => story.group === group);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Story title"
            value={newStory.title}
            onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
          />
          <Input
            placeholder="Story description"
            value={newStory.description}
            onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
          />
          <Button onClick={addStory}>Add Story</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ungrouped Stories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getUngroupedStories().map(story => (
              <Card key={story.id} className="border-dashed">
                <CardContent className="p-4">
                  <h4 className="font-medium">{story.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{story.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(groups).map(([groupKey, groupConfig]) => (
                      <Button
                        key={groupKey}
                        size="sm"
                        variant="outline"
                        onClick={() => moveStoryToGroup(story.id, groupKey as any)}
                      >
                        {groupConfig.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(groups).map(([groupKey, groupConfig]) => (
          <Card key={groupKey} className={`${groupConfig.color} min-h-[300px]`}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {groupConfig.name}
                <Badge variant="secondary">{getStoriesInGroup(groupKey).length}</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{groupConfig.estimate}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {getStoriesInGroup(groupKey).map(story => (
                <Card key={story.id} className="bg-white">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{story.title}</h5>
                        <p className="text-xs text-muted-foreground">{story.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStoryFromGroup(story.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estimation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(groups).map(([groupKey, groupConfig]) => {
              const count = getStoriesInGroup(groupKey).length;
              return (
                <div key={groupKey} className="text-center">
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-muted-foreground">{groupConfig.name}</div>
                  <div className="text-xs text-muted-foreground">{groupConfig.estimate}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}