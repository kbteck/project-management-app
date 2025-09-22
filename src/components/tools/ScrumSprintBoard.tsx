import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Calendar, Clock, User, Target } from 'lucide-react';

interface SprintTask {
  id: string;
  title: string;
  storyPoints: number;
  status: 'todo' | 'progress' | 'done';
  assignee: string;
  priority: 'low' | 'medium' | 'high';
}

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  goal: string;
  tasks: SprintTask[];
}

const ScrumSprintBoard: React.FC = () => {
  const [currentSprint, setCurrentSprint] = useState<Sprint>({
    id: '1',
    name: 'Sprint 1',
    startDate: '2024-01-15',
    endDate: '2024-01-29',
    goal: 'Complete user authentication and basic dashboard',
    tasks: []
  });

  const [newTask, setNewTask] = useState({
    title: '',
    storyPoints: 1,
    assignee: '',
    priority: 'medium' as const
  });

  const addTask = () => {
    if (!newTask.title.trim()) return;
    
    const task: SprintTask = {
      id: Date.now().toString(),
      title: newTask.title,
      storyPoints: newTask.storyPoints,
      status: 'todo',
      assignee: newTask.assignee,
      priority: newTask.priority
    };

    setCurrentSprint(prev => ({
      ...prev,
      tasks: [...prev.tasks, task]
    }));
    
    setNewTask({ title: '', storyPoints: 1, assignee: '', priority: 'medium' });
  };

  const updateTaskStatus = (taskId: string, status: SprintTask['status']) => {
    setCurrentSprint(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId ? { ...task, status } : task
      )
    }));
  };

  const getTasksByStatus = (status: SprintTask['status']) => {
    return currentSprint.tasks.filter(task => task.status === status);
  };

  const getTotalStoryPoints = () => {
    return currentSprint.tasks.reduce((sum, task) => sum + task.storyPoints, 0);
  };

  const getCompletedStoryPoints = () => {
    return currentSprint.tasks
      .filter(task => task.status === 'done')
      .reduce((sum, task) => sum + task.storyPoints, 0);
  };

  const getSprintProgress = () => {
    const total = getTotalStoryPoints();
    const completed = getCompletedStoryPoints();
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Scrum Sprint Board</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            {currentSprint.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {currentSprint.startDate} - {currentSprint.endDate}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {getCompletedStoryPoints()} / {getTotalStoryPoints()} Story Points
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Progress: {Math.round(getSprintProgress())}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Sprint Goal:</p>
            <p className="font-medium">{currentSprint.goal}</p>
          </div>
          <Progress value={getSprintProgress()} className="w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
            />
            <Input
              type="number"
              placeholder="Story Points"
              value={newTask.storyPoints}
              onChange={(e) => setNewTask(prev => ({ ...prev, storyPoints: parseInt(e.target.value) || 1 }))}
            />
            <Input
              placeholder="Assignee"
              value={newTask.assignee}
              onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
            />
            <select 
              value={newTask.priority}
              onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
              className="px-3 py-2 border rounded-md"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <Button onClick={addTask} className="w-full">Add Task</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['todo', 'progress', 'done'].map(status => (
          <Card key={status}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {status === 'todo' ? 'To Do' : status === 'progress' ? 'In Progress' : 'Done'}
                <Badge variant="secondary">{getTasksByStatus(status as any).length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getTasksByStatus(status as any).map(task => (
                <Card key={task.id} className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>{task.storyPoints} SP</span>
                      {task.assignee && (
                        <>
                          <User className="w-3 h-3" />
                          <span>{task.assignee}</span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {(['todo', 'progress', 'done'] as const).filter(s => s !== status).map(targetStatus => (
                        <Button
                          key={targetStatus}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => updateTaskStatus(task.id, targetStatus)}
                        >
                          → {targetStatus === 'todo' ? 'To Do' : targetStatus === 'progress' ? 'Progress' : 'Done'}
                        </Button>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ScrumSprintBoard;