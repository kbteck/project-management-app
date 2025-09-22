import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Plus, X } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'progress', title: 'In Progress', tasks: [] },
    { id: 'review', title: 'Review', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] }
  ]);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignee: '' });
  const [selectedColumn, setSelectedColumn] = useState('todo');

  const addTask = () => {
    if (!newTask.title.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: 'medium',
      assignee: newTask.assignee
    };

    setColumns(prev => prev.map(col => 
      col.id === selectedColumn 
        ? { ...col, tasks: [...col.tasks, task] }
        : col
    ));
    
    setNewTask({ title: '', description: '', assignee: '' });
  };

  const moveTask = (taskId: string, fromColumn: string, toColumn: string) => {
    const task = columns.find(col => col.id === fromColumn)?.tasks.find(t => t.id === taskId);
    if (!task) return;

    setColumns(prev => prev.map(col => {
      if (col.id === fromColumn) {
        return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
      }
      if (col.id === toColumn) {
        return { ...col, tasks: [...col.tasks, task] };
      }
      return col;
    }));
  };

  const deleteTask = (taskId: string, columnId: string) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId 
        ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
        : col
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kanban Board</h2>
      </div>

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
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
            />
            <Input
              placeholder="Assignee"
              value={newTask.assignee}
              onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
            />
            <select 
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              {columns.map(col => (
                <option key={col.id} value={col.id}>{col.title}</option>
              ))}
            </select>
          </div>
          <Button onClick={addTask} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {columns.map(column => (
          <Card key={column.id} className="h-fit">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {column.title}
                <Badge variant="secondary">{column.tasks.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {column.tasks.map(task => (
                <Card key={task.id} className="p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id, column.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    {task.description && (
                      <p className="text-xs text-gray-600">{task.description}</p>
                    )}
                    {task.assignee && (
                      <Badge variant="outline" className="text-xs">{task.assignee}</Badge>
                    )}
                    <div className="flex gap-1">
                      {columns.filter(col => col.id !== column.id).map(targetCol => (
                        <Button
                          key={targetCol.id}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => moveTask(task.id, column.id, targetCol.id)}
                        >
                          → {targetCol.title}
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

export default KanbanBoard;