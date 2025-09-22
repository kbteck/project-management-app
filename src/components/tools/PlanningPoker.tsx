import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Vote {
  playerId: string;
  playerName: string;
  points: string;
  revealed: boolean;
}

interface Story {
  id: string;
  title: string;
  description: string;
  finalEstimate?: string;
}

export default function PlanningPoker() {
  const [stories, setStories] = useState<Story[]>([
    { id: '1', title: 'User Login Feature', description: 'Implement user authentication system' },
    { id: '2', title: 'Dashboard UI', description: 'Create responsive dashboard interface' }
  ]);
  const [currentStory, setCurrentStory] = useState<Story | null>(stories[0] || null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [newStory, setNewStory] = useState({ title: '', description: '' });
  const [playerName, setPlayerName] = useState('');

  const fibonacciPoints = ['1', '2', '3', '5', '8', '13', '21', '?', '☕'];

  const addPlayer = () => {
    if (!playerName.trim()) return;
    const newVote: Vote = {
      playerId: Date.now().toString(),
      playerName: playerName.trim(),
      points: '',
      revealed: false
    };
    setVotes([...votes, newVote]);
    setPlayerName('');
  };

  const castVote = (playerId: string, points: string) => {
    setVotes(votes.map(vote => 
      vote.playerId === playerId ? { ...vote, points, revealed: false } : vote
    ));
  };

  const revealVotes = () => {
    setRevealed(true);
    setVotes(votes.map(vote => ({ ...vote, revealed: true })));
  };

  const resetVoting = () => {
    setRevealed(false);
    setVotes(votes.map(vote => ({ ...vote, points: '', revealed: false })));
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Story</CardTitle>
          </CardHeader>
          <CardContent>
            {currentStory ? (
              <div className="space-y-4">
                <h3 className="font-semibold">{currentStory.title}</h3>
                <p className="text-sm text-muted-foreground">{currentStory.description}</p>
                <div className="flex gap-2">
                  {stories.map(story => (
                    <Button
                      key={story.id}
                      variant={currentStory.id === story.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentStory(story)}
                    >
                      {story.title}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <p>No stories available</p>
            )}
          </CardContent>
        </Card>

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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Players & Voting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Player name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <Button onClick={addPlayer}>Add Player</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {votes.map(vote => (
              <Card key={vote.playerId}>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">{vote.playerName}</h4>
                  <div className="grid grid-cols-3 gap-1 mb-2">
                    {fibonacciPoints.map(point => (
                      <Button
                        key={point}
                        variant={vote.points === point ? "default" : "outline"}
                        size="sm"
                        onClick={() => castVote(vote.playerId, point)}
                        disabled={revealed}
                      >
                        {point}
                      </Button>
                    ))}
                  </div>
                  {vote.revealed && vote.points && (
                    <Badge variant="secondary">{vote.points} points</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={revealVotes} disabled={revealed || votes.every(v => !v.points)}>
              Reveal Votes
            </Button>
            <Button variant="outline" onClick={resetVoting}>
              Reset Round
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}