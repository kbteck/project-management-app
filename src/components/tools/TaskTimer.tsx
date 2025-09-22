import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Play, Pause, Square, Clock, Trash2, Download } from 'lucide-react';

interface TimeEntry {
  id: string;
  taskName: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  isRunning: boolean;
  category: string;
  description: string;
}

export default function TaskTimer() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [newTask, setNewTask] = useState({
    name: '',
    category: '',
    description: ''
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (currentEntry && currentEntry.isRunning) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - currentEntry.startTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentEntry]);

  const startTimer = () => {
    if (!newTask.name.trim()) return;
    
    const entry: TimeEntry = {
      id: Date.now().toString(),
      taskName: newTask.name,
      startTime: new Date(),
      duration: 0,
      isRunning: true,
      category: newTask.category || 'General',
      description: newTask.description
    };
    
    setCurrentEntry(entry);
    setElapsedTime(0);
  };

  const pauseTimer = () => {
    if (currentEntry) {
      const updatedEntry = {
        ...currentEntry,
        isRunning: false,
        duration: elapsedTime
      };
      setCurrentEntry(updatedEntry);
    }
  };

  const resumeTimer = () => {
    if (currentEntry) {
      const updatedEntry = {
        ...currentEntry,
        isRunning: true,
        startTime: new Date(Date.now() - currentEntry.duration * 1000)
      };
      setCurrentEntry(updatedEntry);
    }
  };

  const stopTimer = () => {
    if (currentEntry) {
      const finalEntry = {
        ...currentEntry,
        endTime: new Date(),
        duration: elapsedTime,
        isRunning: false
      };
      
      setEntries(prev => [finalEntry, ...prev]);
      setCurrentEntry(null);
      setElapsedTime(0);
      setNewTask({ name: '', category: '', description: '' });
    }
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalTimeByCategory = () => {
    const categoryTotals: { [key: string]: number } = {};
    entries.forEach(entry => {
      categoryTotals[entry.category] = (categoryTotals[entry.category] || 0) + entry.duration;
    });
    return categoryTotals;
  };

  const getTodayTotal = () => {
    const today = new Date().toDateString();
    return entries
      .filter(entry => entry.startTime.toDateString() === today)
      .reduce((total, entry) => total + entry.duration, 0);
  };

  const exportTimeLog = () => {
    const csvContent = [
      ['Task Name', 'Category', 'Description', 'Start Time', 'End Time', 'Duration (minutes)'],
      ...entries.map(entry => [
        entry.taskName,
        entry.category,
        entry.description,
        entry.startTime.toLocaleString(),
        entry.endTime?.toLocaleString() || '',
        Math.round(entry.duration / 60)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const categoryTotals = getTotalTimeByCategory();
  const todayTotal = getTodayTotal();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Task Timer & Stopwatch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-6xl font-mono font-bold mb-4">
              {formatTime(elapsedTime)}
            </div>
            {currentEntry && (
              <div className="text-lg font-medium text-gray-600 mb-4">
                {currentEntry.taskName}
                {currentEntry.isRunning && (
                  <Badge className="ml-2 bg-green-100 text-green-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Running
                  </Badge>
                )}
              </div>
            )}
          </div>

          {!currentEntry ? (
            <div className="space-y-4">
              <Input
                placeholder="Task name"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Category (optional)"
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                />
                <Input
                  placeholder="Description (optional)"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <Button onClick={startTimer} className="w-full" disabled={!newTask.name.trim()}>
                <Play className="w-4 h-4 mr-2" />
                Start Timer
              </Button>
            </div>
          ) : (
            <div className="flex justify-center gap-2">
              {currentEntry.isRunning ? (
                <Button onClick={pauseTimer} variant="outline">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button onClick={resumeTimer} variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              )}
              <Button onClick={stopTimer} variant="destructive">
                <Square className="w-4 h-4 mr-2" />
                Stop & Save
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Time Summary</span>
            {entries.length > 0 && (
              <Button variant="outline" size="sm" onClick={exportTimeLog}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatTime(todayTotal)}</div>
              <div className="text-sm text-gray-600">Today's Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{entries.length}</div>
              <div className="text-sm text-gray-600">Total Sessions</div>
            </div>
          </div>

          {Object.keys(categoryTotals).length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Time by Category</h4>
              <div className="space-y-2">
                {Object.entries(categoryTotals).map(([category, total]) => (
                  <div key={category} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">{category}</span>
                    <Badge variant="secondary">{formatTime(total)}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Time Entries ({entries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {entries.slice(0, 10).map((entry) => (
                <div key={entry.id} className="flex justify-between items-start p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{entry.taskName}</h4>
                      <Badge variant="outline" className="text-xs">
                        {entry.category}
                      </Badge>
                    </div>
                    {entry.description && (
                      <p className="text-sm text-gray-600 mb-2">{entry.description}</p>
                    )}
                    <div className="text-xs text-gray-500">
                      {entry.startTime.toLocaleString()}
                      {entry.endTime && ` - ${entry.endTime.toLocaleString()}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      {formatTime(entry.duration)}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteEntry(entry.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {entries.length > 10 && (
                <div className="text-center text-sm text-gray-500">
                  Showing 10 of {entries.length} entries
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}