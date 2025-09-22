import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface VotingItem {
  id: string;
  title: string;
  description: string;
  votes: number;
  maxVotes?: number;
}

interface Voter {
  id: string;
  name: string;
  remainingVotes: number;
  totalVotes: number;
}

export default function DotVoting() {
  const [items, setItems] = useState<VotingItem[]>([
    { id: '1', title: 'Improve Code Review Process', description: 'Streamline our code review workflow', votes: 0 },
    { id: '2', title: 'Better Testing Strategy', description: 'Implement more comprehensive testing', votes: 0 },
    { id: '3', title: 'Team Communication', description: 'Enhance daily standup meetings', votes: 0 }
  ]);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [newItem, setNewItem] = useState({ title: '', description: '' });
  const [newVoter, setNewVoter] = useState('');
  const [votesPerPerson, setVotesPerPerson] = useState(3);
  const [votingActive, setVotingActive] = useState(false);

  const addItem = () => {
    if (!newItem.title.trim()) return;
    const item: VotingItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      votes: 0
    };
    setItems([...items, item]);
    setNewItem({ title: '', description: '' });
  };

  const addVoter = () => {
    if (!newVoter.trim()) return;
    const voter: Voter = {
      id: Date.now().toString(),
      name: newVoter.trim(),
      remainingVotes: votesPerPerson,
      totalVotes: votesPerPerson
    };
    setVoters([...voters, voter]);
    setNewVoter('');
  };

  const startVoting = () => {
    setVotingActive(true);
  };

  const resetVoting = () => {
    setVotingActive(false);
    setItems(items.map(item => ({ ...item, votes: 0 })));
    setVoters(voters.map(voter => ({ ...voter, remainingVotes: voter.totalVotes })));
  };

  const castVote = (itemId: string, voterId: string) => {
    const voter = voters.find(v => v.id === voterId);
    if (!voter || voter.remainingVotes <= 0 || !votingActive) return;

    setItems(items.map(item => 
      item.id === itemId ? { ...item, votes: item.votes + 1 } : item
    ));
    setVoters(voters.map(v => 
      v.id === voterId ? { ...v, remainingVotes: v.remainingVotes - 1 } : v
    ));
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const removeVoter = (voterId: string) => {
    setVoters(voters.filter(voter => voter.id !== voterId));
  };

  const getTotalVotes = () => items.reduce((sum, item) => sum + item.votes, 0);
  const getMaxVotes = () => Math.max(...items.map(item => item.votes), 1);
  const sortedItems = [...items].sort((a, b) => b.votes - a.votes);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Voting Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Item title"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              disabled={votingActive}
            />
            <Input
              placeholder="Item description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              disabled={votingActive}
            />
            <Button onClick={addItem} disabled={votingActive}>Add Item</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Voter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Voter name"
              value={newVoter}
              onChange={(e) => setNewVoter(e.target.value)}
              disabled={votingActive}
            />
            <div className="flex items-center gap-2">
              <label className="text-sm">Votes per person:</label>
              <Input
                type="number"
                value={votesPerPerson}
                onChange={(e) => setVotesPerPerson(Number(e.target.value))}
                className="w-20"
                min={1}
                max={10}
                disabled={votingActive}
              />
            </div>
            <Button onClick={addVoter} disabled={votingActive}>Add Voter</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Voters ({voters.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {voters.map(voter => (
              <Card key={voter.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{voter.name}</span>
                    {!votingActive && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVoter(voter.id)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                  <div className="mt-2">
                    <Badge variant={voter.remainingVotes > 0 ? "default" : "secondary"}>
                      {voter.remainingVotes} votes left
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={startVoting} disabled={votingActive || voters.length === 0}>
              Start Voting
            </Button>
            <Button variant="outline" onClick={resetVoting}>
              Reset Voting
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Voting Items ({items.length})</CardTitle>
          {votingActive && (
            <Badge variant="default">Voting Active - Total Votes: {getTotalVotes()}</Badge>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedItems.map((item, index) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <h4 className="font-medium">{item.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </div>
                    {!votingActive && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{item.votes} votes</span>
                      <span className="text-sm text-muted-foreground">
                        {getMaxVotes() > 0 ? Math.round((item.votes / getMaxVotes()) * 100) : 0}%
                      </span>
                    </div>
                    <Progress value={getMaxVotes() > 0 ? (item.votes / getMaxVotes()) * 100 : 0} />
                  </div>

                  {votingActive && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {voters.map(voter => (
                        <Button
                          key={voter.id}
                          size="sm"
                          variant="outline"
                          onClick={() => castVote(item.id, voter.id)}
                          disabled={voter.remainingVotes <= 0}
                        >
                          {voter.name} ({voter.remainingVotes})
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}