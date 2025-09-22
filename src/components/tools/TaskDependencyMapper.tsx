import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Plus, X, ArrowRight, AlertTriangle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  dependencies: string[];
  duration: number;
  assignee: string;
}

const TaskDependencyMapper: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Setup Development Environment',
      description: 'Configure development tools and environment',
      status: 'completed',
      dependencies: [],
      duration: 2,
      assignee: 'Alice'
    },
    {
      id: '2',
      title: 'Design Database Schema',
      description: 'Create database structure and relationships',
      status: 'completed',
      dependencies: ['1'],
      duration: 3,
      assignee: 'Bob'
    },
    {
      id: '3',
      title: 'Implement User Authentication',
      description: 'Build login and registration system',
      status: 'in-progress',
      dependencies: ['2'],
      duration: 5,
      assignee: 'Alice'
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    duration: 1,
    assignee: '',
    dependencies: [] as string[]
  });

  const addTask = () => {
    if (!newTask.title.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: 'not-started',
      dependencies: newTask.dependencies,
      duration: newTask.duration,
      assignee: newTask.assignee
    };

    setTasks(prev => [...prev, task]);
    setNewTask({
      title: '',
      description: '',
      duration: 1,
      assignee: '',
      dependencies: []
    });
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const addDependency = (taskId: string, dependencyId: string) => {
    if (taskId === dependencyId) return; // Can't depend on itself
    
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, dependencies: [...new Set([...task.dependencies, dependencyId])] }
        : task
    ));
  };

  const removeDependency = (taskId: string, dependencyId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, dependencies: task.dependencies.filter(dep => dep !== dependencyId) }
        : task
    ));
  };

  const getTaskById = (taskId: string) => {
    return tasks.find(task => task.id === taskId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      case 'not-started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isTaskBlocked = (task: Task) => {
    return task.dependencies.some(depId => {
      const dependency = getTaskById(depId);
      return dependency && dependency.status !== 'completed';
    });
  };

  const getReadyTasks = () => {
    return tasks.filter(task => 
      task.status === 'not-started' && 
      task.dependencies.every(depId => {
        const dependency = getTaskById(depId);
        return dependency && dependency.status === 'completed';
      })
    );
  };

  const getBlockedTasks = () => {
    return tasks.filter(task => 
      task.status !== 'completed' && isTaskBlocked(task)
    );
  };

  const getCriticalPath = () => {
    // Simple critical path calculation based on dependencies and duration
    const visited = new Set<string>();
    const path: Task[] = [];
    
    const dfs = (taskId: string, currentPath: Task[]) => {
      if (visited.has(taskId)) return currentPath;
      
      const task = getTaskById(taskId);
      if (!task) return currentPath;
      
      visited.add(taskId);
      const newPath = [...currentPath, task];
      
      let longestPath = newPath;
      for (const depId of task.dependencies) {
        const depPath = dfs(depId, newPath);
        if (depPath.length > longestPath.length) {
          longestPath = depPath;
        }
      }
      
      return longestPath;
    };

    // Find the longest path from any task
    let criticalPath: Task[] = [];
    for (const task of tasks) {
      const path = dfs(task.id, []);
      if (path.length > criticalPath.length) {
        criticalPath = path;
      }
    }
    
    return criticalPath;
  };

  const toggleDependency = (taskId: string, dependencyId: string) => {
    const task = getTaskById(taskId);
    if (!task) return;
    
    if (task.dependencies.includes(dependencyId)) {
      removeDependency(taskId, dependencyId);
    } else {
      addDependency(taskId, dependencyId);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Task Dependency Mapper</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Ready to Start</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">{getReadyTasks().length} tasks</Badge>
            <div className="mt-2 space-y-1">
              {getReadyTasks().slice(0, 3).map(task => (
                <p key={task.id} className="text-sm">{task.title}</p>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Blocked Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="destructive">{getBlockedTasks().length} tasks</Badge>
            <div className="mt-2 space-y-1">
              {getBlockedTasks().slice(0, 3).map(task => (
                <p key={task.id} className="text-sm">{task.title}</p>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-purple-600">Critical Path</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">{getCriticalPath().length} tasks</Badge>
            <div className="mt-2 space-y-1">
              {getCriticalPath().slice(0, 3).map(task => (
                <p key={task.id} className="text-sm">{task.title}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
            />
            <Input
              placeholder="Assignee"
              value={newTask.assignee}
              onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
            />
          </div>
          <Input
            placeholder="Task description"
            value={newTask.description}
            onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
          />
          <Input
            type="number"
            placeholder="Duration (days)"
            value={newTask.duration}
            onChange={(e) => setNewTask(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
          />
          <Button onClick={addTask} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Dependencies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map(task => (
              <Card key={task.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{task.title}</h4>
                        <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                        {isTaskBlocked(task) && task.status !== 'completed' && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Blocked
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{task.duration} days</span>
                        {task.assignee && <span>Assigned to: {task.assignee}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {(['not-started', 'in-progress', 'completed', 'blocked'] as const).map(status => (
                        <Button
                          key={status}
                          variant={task.status === status ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateTaskStatus(task.id, status)}
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-2">Dependencies:</h5>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {task.dependencies.map(depId => {
                        const dependency = getTaskById(depId);
                        return dependency ? (
                          <Badge key={depId} variant="outline" className="flex items-center gap-1">
                            {dependency.title}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDependency(task.id, depId)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {tasks.filter(t => t.id !== task.id && !task.dependencies.includes(t.id)).map(potentialDep => (
                        <Button
                          key={potentialDep.id}
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => toggleDependency(task.id, potentialDep.id)}
                        >
                          + {potentialDep.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDependencyMapper;