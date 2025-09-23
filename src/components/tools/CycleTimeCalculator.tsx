import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Plus, Trash2, Clock } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: 'completed' | 'in-progress';
  cycleTime: number;
  priority: 'low' | 'medium' | 'high';
}

const CycleTimeCalculator: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'User Authentication',
      startDate: '2024-01-01',
      endDate: '2024-01-05',
      status: 'completed',
      cycleTime: 4,
      priority: 'high'
    },
    {
      id: '2',
      title: 'Dashboard Layout',
      startDate: '2024-01-03',
      endDate: '2024-01-08',
      status: 'completed',
      cycleTime: 5,
      priority: 'medium'
    },
    {
      id: '3',
      title: 'API Integration',
      startDate: '2024-01-06',
      endDate: '',
      status: 'in-progress',
      cycleTime: 0,
      priority: 'high'
    }
  ]);

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    startDate: '',
    endDate: '',
    status: 'in-progress',
    priority: 'medium'
  });

  const calculateCycleTime = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const addTask = () => {
    if (newTask.title && newTask.startDate) {
      const cycleTime = newTask.endDate ? calculateCycleTime(newTask.startDate, newTask.endDate) : 0;
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        startDate: newTask.startDate,
        endDate: newTask.endDate || '',
        status: newTask.status as 'completed' | 'in-progress',
        cycleTime,
        priority: newTask.priority as 'low' | 'medium' | 'high'
      };
      setTasks([...tasks, task]);
      setNewTask({ title: '', startDate: '', endDate: '', status: 'in-progress', priority: 'medium' });
    }
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateTaskEndDate = (id: string, endDate: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const cycleTime = endDate ? calculateCycleTime(task.startDate, endDate) : 0;
        return {
          ...task,
          endDate,
          cycleTime,
          status: endDate ? 'completed' : 'in-progress'
        };
      }
      return task;
    }));
  };

  const completedTasks = tasks.filter(task => task.status === 'completed');
  const avgCycleTime = completedTasks.length > 0 
    ? completedTasks.reduce((sum, task) => sum + task.cycleTime, 0) / completedTasks.length 
    : 0;

  const cycleTimeByPriority = {
    high: completedTasks.filter(t => t.priority === 'high').reduce((sum, t) => sum + t.cycleTime, 0) / Math.max(1, completedTasks.filter(t => t.priority === 'high').length),
    medium: completedTasks.filter(t => t.priority === 'medium').reduce((sum, t) => sum + t.cycleTime, 0) / Math.max(1, completedTasks.filter(t => t.priority === 'medium').length),
    low: completedTasks.filter(t => t.priority === 'low').reduce((sum, t) => sum + t.cycleTime, 0) / Math.max(1, completedTasks.filter(t => t.priority === 'low').length)
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🔄</span>
            Cycle Time Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Metrics Overview */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{avgCycleTime.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Avg Cycle Time (days)</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{cycleTimeByPriority.high.toFixed(1)}</div>
                <div className="text-sm text-gray-600">High Priority</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{cycleTimeByPriority.medium.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Medium Priority</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{cycleTimeByPriority.low.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Low Priority</div>
              </CardContent>
            </Card>
          </div>

          {/* Add New Task */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add New Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="task-title">Task Title</Label>
                  <Input
                    id="task-title"
                    value={newTask.title || ''}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newTask.startDate || ''}
                    onChange={(e) => setNewTask({...newTask, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date (optional)</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={newTask.endDate || ''}
                    onChange={(e) => setNewTask({...newTask, endDate: e.target.value})}
                  />
                </div>
              </div>
              
              <Button onClick={addTask} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </CardContent>
          </Card>

          {/* Tasks List */}
          <div className="space-y-2">
            <h3 className="font-semibold">Tasks</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{task.title}</span>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                        {task.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      Started: {task.startDate}
                      {task.endDate && ` • Ended: ${task.endDate}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {task.status === 'in-progress' && (
                      <Input
                        type="date"
                        placeholder="End date"
                        onChange={(e) => updateTaskEndDate(task.id, e.target.value)}
                        className="w-40"
                      />
                    )}
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {task.cycleTime > 0 ? `${task.cycleTime}d` : '-'}
                      </div>
                      <div className="text-xs text-gray-500">Cycle Time</div>
                    </div>
                    <Button
                      onClick={() => removeTask(task.id)}
                      size="sm"
                      variant="outline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CycleTimeCalculator;