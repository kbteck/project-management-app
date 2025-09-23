import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface MoodEntry {
  id: string;
  date: string;
  mood: 1 | 2 | 3 | 4 | 5;
  teamMember: string;
  comment: string;
  isAnonymous: boolean;
}

const moodEmojis = {
  1: '😞',
  2: '😕', 
  3: '😐',
  4: '😊',
  5: '😄'
};

const moodLabels = {
  1: 'Very Low',
  2: 'Low',
  3: 'Neutral', 
  4: 'Good',
  5: 'Excellent'
};

const MoodTracker: React.FC = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      mood: 4,
      teamMember: 'Sarah',
      comment: 'Great sprint planning session today!',
      isAnonymous: false
    },
    {
      id: '2', 
      date: '2024-01-14',
      mood: 2,
      teamMember: 'Anonymous',
      comment: 'Feeling overwhelmed with current workload.',
      isAnonymous: true
    },
    {
      id: '3',
      date: '2024-01-13',
      mood: 5,
      teamMember: 'Mike',
      comment: 'Successfully deployed new feature!',
      isAnonymous: false
    }
  ]);

  const [newEntry, setNewEntry] = useState<Partial<MoodEntry>>({
    date: new Date().toISOString().split('T')[0],
    mood: 3,
    teamMember: '',
    comment: '',
    isAnonymous: false
  });

  const addEntry = () => {
    if (newEntry.mood && newEntry.date) {
      const entry: MoodEntry = {
        id: Date.now().toString(),
        date: newEntry.date,
        mood: newEntry.mood as any,
        teamMember: newEntry.isAnonymous ? 'Anonymous' : (newEntry.teamMember || 'Anonymous'),
        comment: newEntry.comment || '',
        isAnonymous: newEntry.isAnonymous || false
      };
      setEntries([entry, ...entries]);
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        mood: 3,
        teamMember: '',
        comment: '',
        isAnonymous: false
      });
    }
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const calculateMetrics = () => {
    if (entries.length === 0) return { avgMood: 0, trend: 'neutral', distribution: {} };
    
    const avgMood = entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length;
    
    // Calculate trend (last 3 vs previous 3)
    const recent = entries.slice(0, 3);
    const previous = entries.slice(3, 6);
    const recentAvg = recent.length > 0 ? recent.reduce((sum, e) => sum + e.mood, 0) / recent.length : 0;
    const previousAvg = previous.length > 0 ? previous.reduce((sum, e) => sum + e.mood, 0) / previous.length : 0;
    
    let trend = 'neutral';
    if (recentAvg > previousAvg + 0.2) trend = 'up';
    else if (recentAvg < previousAvg - 0.2) trend = 'down';
    
    // Mood distribution
    const distribution = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    return { avgMood, trend, distribution };
  };

  const metrics = calculateMetrics();

  const getMoodColor = (mood: number) => {
    switch (mood) {
      case 1: return 'text-red-600';
      case 2: return 'text-orange-600';
      case 3: return 'text-yellow-600';
      case 4: return 'text-green-600';
      case 5: return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>😊</span>
            Team Mood Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Metrics Overview */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{moodEmojis[Math.round(metrics.avgMood) as keyof typeof moodEmojis] || '😐'}</div>
                <div className="text-2xl font-bold">{metrics.avgMood.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Average Mood</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  {metrics.trend === 'up' && <TrendingUp className="w-6 h-6 text-green-600" />}
                  {metrics.trend === 'down' && <TrendingDown className="w-6 h-6 text-red-600" />}
                  {metrics.trend === 'neutral' && <div className="w-6 h-0.5 bg-gray-400"></div>}
                </div>
                <div className="text-lg font-semibold capitalize">{metrics.trend}</div>
                <div className="text-sm text-gray-600">Recent Trend</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{entries.length}</div>
                <div className="text-sm text-gray-600">Total Entries</div>
              </CardContent>
            </Card>
          </div>

          {/* Mood Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mood Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(mood => {
                  const count = metrics.distribution[mood] || 0;
                  const percentage = entries.length > 0 ? (count / entries.length) * 100 : 0;
                  
                  return (
                    <div key={mood} className="flex items-center gap-3">
                      <div className="flex items-center gap-2 w-20">
                        <span className="text-lg">{moodEmojis[mood as keyof typeof moodEmojis]}</span>
                        <span className="text-sm">{moodLabels[mood as keyof typeof moodLabels]}</span>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm w-12 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Add New Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Log Your Mood</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="entry-date">Date</Label>
                  <Input
                    id="entry-date"
                    type="date"
                    value={newEntry.date || ''}
                    onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="team-member">Your Name (optional)</Label>
                  <Input
                    id="team-member"
                    value={newEntry.teamMember || ''}
                    onChange={(e) => setNewEntry({...newEntry, teamMember: e.target.value})}
                    placeholder="Leave blank for anonymous"
                    disabled={newEntry.isAnonymous}
                  />
                </div>
              </div>
              
              <div>
                <Label>How are you feeling today?</Label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map(mood => (
                    <Button
                      key={mood}
                      onClick={() => setNewEntry({...newEntry, mood: mood as any})}
                      variant={newEntry.mood === mood ? 'default' : 'outline'}
                      className="flex-1 h-16 flex-col gap-1"
                    >
                      <span className="text-2xl">{moodEmojis[mood as keyof typeof moodEmojis]}</span>
                      <span className="text-xs">{moodLabels[mood as keyof typeof moodLabels]}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="comment">Comment (optional)</Label>
                <Textarea
                  id="comment"
                  value={newEntry.comment || ''}
                  onChange={(e) => setNewEntry({...newEntry, comment: e.target.value})}
                  placeholder="Share what's affecting your mood..."
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={newEntry.isAnonymous || false}
                  onChange={(e) => setNewEntry({...newEntry, isAnonymous: e.target.checked})}
                />
                <Label htmlFor="anonymous">Submit anonymously</Label>
              </div>
              
              <Button onClick={addEntry} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Log Mood
              </Button>
            </CardContent>
          </Card>

          {/* Recent Entries */}
          <div className="space-y-2">
            <h3 className="font-semibold">Recent Mood Entries</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {entries.map(entry => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{moodEmojis[entry.mood]}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{entry.teamMember}</span>
                        <Badge className={getMoodColor(entry.mood)}>
                          {moodLabels[entry.mood]}
                        </Badge>
                        <span className="text-sm text-gray-600">{entry.date}</span>
                      </div>
                      {entry.comment && (
                        <div className="text-sm text-gray-700 mt-1">{entry.comment}</div>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => removeEntry(entry.id)}
                    size="sm"
                    variant="outline"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodTracker;