import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Play, Pause, Square, RotateCcw, Clock, Coffee } from 'lucide-react';

interface PomodoroSession {
  id: string;
  task: string;
  completedPomodoros: number;
  totalTime: number;
  date: string;
}

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  
  const [settings, setSettings] = useState({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false
  });

  const modes = {
    work: { duration: settings.workDuration * 60, label: 'Work', icon: Clock, color: 'bg-red-100 text-red-800' },
    shortBreak: { duration: settings.shortBreakDuration * 60, label: 'Short Break', icon: Coffee, color: 'bg-green-100 text-green-800' },
    longBreak: { duration: settings.longBreakDuration * 60, label: 'Long Break', icon: Coffee, color: 'bg-blue-100 text-blue-800' }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    
    if (mode === 'work') {
      const newCompletedPomodoros = completedPomodoros + 1;
      setCompletedPomodoros(newCompletedPomodoros);
      
      // Save session
      if (currentTask) {
        const session: PomodoroSession = {
          id: Date.now().toString(),
          task: currentTask,
          completedPomodoros: 1,
          totalTime: settings.workDuration,
          date: new Date().toISOString().split('T')[0]
        };
        setSessions(prev => [session, ...prev]);
      }
      
      // Switch to break
      const nextMode = newCompletedPomodoros % settings.longBreakInterval === 0 ? 'longBreak' : 'shortBreak';
      setMode(nextMode);
      setTimeLeft(modes[nextMode].duration);
      
      if (settings.autoStartBreaks) {
        setIsActive(true);
      }
    } else {
      // Break completed, switch to work
      setMode('work');
      setTimeLeft(modes.work.duration);
      
      if (settings.autoStartPomodoros) {
        setIsActive(true);
      }
    }
    
    // Play notification sound (if browser supports it)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`${modes[mode].label} completed!`);
    }
  };

  const startTimer = () => setIsActive(true);
  const pauseTimer = () => setIsActive(false);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].duration);
  };

  const switchMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setTimeLeft(modes[newMode].duration);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = modes[mode].duration;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(s => s.date === today);
    const totalPomodoros = todaySessions.reduce((sum, s) => sum + s.completedPomodoros, 0);
    const totalTime = todaySessions.reduce((sum, s) => sum + s.totalTime, 0);
    return { totalPomodoros, totalTime };
  };

  const todayStats = getTodayStats();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Pomodoro Timer</span>
            <Badge className={modes[mode].color}>
              {modes[mode].label}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-mono font-bold mb-4">
              {formatTime(timeLeft)}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <Button onClick={startTimer} disabled={isActive} variant="default">
              <Play className="w-4 h-4 mr-2" />Start
            </Button>
            <Button onClick={pauseTimer} disabled={!isActive} variant="outline">
              <Pause className="w-4 h-4 mr-2" />Pause
            </Button>
            <Button onClick={resetTimer} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />Reset
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(modes) as Array<keyof typeof modes>).map((modeKey) => (
              <Button
                key={modeKey}
                variant={mode === modeKey ? "default" : "outline"}
                size="sm"
                onClick={() => switchMode(modeKey)}
                className="text-xs"
              >
                {modes[modeKey].label}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Input
              placeholder="What are you working on?"
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
            />
            <div className="text-center text-sm text-gray-600">
              Completed Pomodoros: {completedPomodoros}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Work Duration (min)</label>
              <Input
                type="number"
                value={settings.workDuration}
                onChange={(e) => setSettings({...settings, workDuration: parseInt(e.target.value) || 25})}
                min="1"
                max="60"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Short Break (min)</label>
              <Input
                type="number"
                value={settings.shortBreakDuration}
                onChange={(e) => setSettings({...settings, shortBreakDuration: parseInt(e.target.value) || 5})}
                min="1"
                max="30"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Long Break (min)</label>
              <Input
                type="number"
                value={settings.longBreakDuration}
                onChange={(e) => setSettings({...settings, longBreakDuration: parseInt(e.target.value) || 15})}
                min="1"
                max="60"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button
              variant={settings.autoStartBreaks ? "default" : "outline"}
              size="sm"
              onClick={() => setSettings({...settings, autoStartBreaks: !settings.autoStartBreaks})}
            >
              Auto-start Breaks
            </Button>
            <Button
              variant={settings.autoStartPomodoros ? "default" : "outline"}
              size="sm"
              onClick={() => setSettings({...settings, autoStartPomodoros: !settings.autoStartPomodoros})}
            >
              Auto-start Pomodoros
            </Button>
            <Button variant="outline" size="sm" onClick={requestNotificationPermission}>
              Enable Notifications
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{todayStats.totalPomodoros}</div>
              <div className="text-sm text-gray-600">Pomodoros</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{todayStats.totalTime}m</div>
              <div className="text-sm text-gray-600">Focus Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {sessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sessions.slice(0, 5).map((session) => (
                <div key={session.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{session.task}</div>
                    <div className="text-sm text-gray-600">{session.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{session.completedPomodoros} 🍅</div>
                    <div className="text-sm text-gray-600">{session.totalTime}m</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}