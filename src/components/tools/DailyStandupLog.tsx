import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Calendar, Clock, User, AlertTriangle } from 'lucide-react';

interface StandupEntry {
  id: string;
  date: string;
  teamMember: string;
  yesterday: string;
  today: string;
  blockers: string;
  mood: 'great' | 'good' | 'okay' | 'struggling';
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

const DailyStandupLog: React.FC = () => {
  const [team] = useState<TeamMember[]>([
    { id: '1', name: 'Alice Johnson', role: 'Frontend Developer' },
    { id: '2', name: 'Bob Smith', role: 'Backend Developer' },
    { id: '3', name: 'Carol Davis', role: 'UX Designer' },
    { id: '4', name: 'David Wilson', role: 'QA Engineer' }
  ]);

  const [entries, setEntries] = useState<StandupEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentEntry, setCurrentEntry] = useState({
    teamMember: '',
    yesterday: '',
    today: '',
    blockers: '',
    mood: 'good' as const
  });

  const addEntry = () => {
    if (!currentEntry.teamMember || !currentEntry.today.trim()) return;
    
    const entry: StandupEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      teamMember: currentEntry.teamMember,
      yesterday: currentEntry.yesterday,
      today: currentEntry.today,
      blockers: currentEntry.blockers,
      mood: currentEntry.mood
    };

    setEntries(prev => [...prev, entry]);
    setCurrentEntry({
      teamMember: '',
      yesterday: '',
      today: '',
      blockers: '',
      mood: 'good'
    });
  };

  const getEntriesForDate = (date: string) => {
    return entries.filter(entry => entry.date === date);
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'great': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'okay': return 'bg-yellow-100 text-yellow-800';
      case 'struggling': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'great': return '😄';
      case 'good': return '😊';
      case 'okay': return '😐';
      case 'struggling': return '😰';
      default: return '😊';
    }
  };

  const getTeamMemberName = (memberId: string) => {
    return team.find(member => member.id === memberId)?.name || memberId;
  };

  const hasBlockers = (date: string) => {
    return getEntriesForDate(date).some(entry => entry.blockers.trim().length > 0);
  };

  const getUniqueStandupDates = () => {
    const dates = [...new Set(entries.map(entry => entry.date))];
    return dates.sort().reverse();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Daily Standup Log</h2>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Standup Entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select 
              value={currentEntry.teamMember}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, teamMember: e.target.value }))}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">Select team member</option>
              {team.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name} - {member.role}
                </option>
              ))}
            </select>
            <select 
              value={currentEntry.mood}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, mood: e.target.value as any }))}
              className="px-3 py-2 border rounded-md"
            >
              <option value="great">😄 Great</option>
              <option value="good">😊 Good</option>
              <option value="okay">😐 Okay</option>
              <option value="struggling">😰 Struggling</option>
            </select>
          </div>
          
          <Textarea
            placeholder="What did you accomplish yesterday?"
            value={currentEntry.yesterday}
            onChange={(e) => setCurrentEntry(prev => ({ ...prev, yesterday: e.target.value }))}
          />
          
          <Textarea
            placeholder="What will you work on today?"
            value={currentEntry.today}
            onChange={(e) => setCurrentEntry(prev => ({ ...prev, today: e.target.value }))}
          />
          
          <Textarea
            placeholder="Any blockers or impediments?"
            value={currentEntry.blockers}
            onChange={(e) => setCurrentEntry(prev => ({ ...prev, blockers: e.target.value }))}
          />
          
          <Button onClick={addEntry} className="w-full">Add Entry</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Today's Standup ({selectedDate})</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{getEntriesForDate(selectedDate).length} / {team.length} members</span>
              {hasBlockers(selectedDate) && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Blockers
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getEntriesForDate(selectedDate).length === 0 ? (
              <p className="text-gray-500 text-center py-8">No standup entries for this date</p>
            ) : (
              getEntriesForDate(selectedDate).map(entry => (
                <Card key={entry.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{getTeamMemberName(entry.teamMember)}</span>
                      </div>
                      <Badge className={getMoodColor(entry.mood)}>
                        {getMoodEmoji(entry.mood)} {entry.mood}
                      </Badge>
                    </div>
                    
                    {entry.yesterday && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-1">Yesterday:</h4>
                        <p className="text-sm">{entry.yesterday}</p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Today:</h4>
                      <p className="text-sm">{entry.today}</p>
                    </div>
                    
                    {entry.blockers && (
                      <div>
                        <h4 className="font-medium text-sm text-red-700 mb-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Blockers:
                        </h4>
                        <p className="text-sm text-red-600">{entry.blockers}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {getUniqueStandupDates().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Previous Standups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getUniqueStandupDates().slice(0, 5).map(date => (
                <div key={date} className="flex items-center justify-between p-2 border rounded">
                  <span className="font-medium">{date}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {getEntriesForDate(date).length} entries
                    </Badge>
                    {hasBlockers(date) && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Blockers
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDate(date)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DailyStandupLog;