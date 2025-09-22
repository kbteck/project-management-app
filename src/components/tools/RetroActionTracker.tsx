import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  dueDate: string;
  createdDate: string;
  retrospectiveId?: string;
}

export default function RetroActionTracker() {
  const [actions, setActions] = useState<ActionItem[]>([
    {
      id: '1',
      title: 'Improve Code Review Process',
      description: 'Create checklist and guidelines for code reviews',
      assignee: 'John Doe',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2024-02-15',
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Set up Team Knowledge Base',
      description: 'Create shared documentation space',
      assignee: 'Jane Smith',
      priority: 'medium',
      status: 'todo',
      dueDate: '2024-02-20',
      createdDate: '2024-01-15'
    }
  ]);
  
  const [newAction, setNewAction] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium' as const,
    dueDate: ''
  });

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');

  const priorityConfig = {
    low: { color: 'bg-green-100 text-green-800', label: 'Low' },
    medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
    high: { color: 'bg-red-100 text-red-800', label: 'High' }
  };

  const statusConfig = {
    todo: { color: 'bg-gray-100 text-gray-800', label: 'To Do' },
    'in-progress': { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
    done: { color: 'bg-green-100 text-green-800', label: 'Done' }
  };

  const addAction = () => {
    if (!newAction.title.trim() || !newAction.assignee.trim()) return;
    
    const action: ActionItem = {
      id: Date.now().toString(),
      title: newAction.title,
      description: newAction.description,
      assignee: newAction.assignee,
      priority: newAction.priority,
      status: 'todo',
      dueDate: newAction.dueDate,
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    setActions([...actions, action]);
    setNewAction({
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      dueDate: ''
    });
  };

  const updateActionStatus = (actionId: string, status: 'todo' | 'in-progress' | 'done') => {
    setActions(actions.map(action => 
      action.id === actionId ? { ...action, status } : action
    ));
  };

  const removeAction = (actionId: string) => {
    setActions(actions.filter(action => action.id !== actionId));
  };

  const getFilteredActions = () => {
    return actions.filter(action => {
      const statusMatch = filterStatus === 'all' || action.status === filterStatus;
      const assigneeMatch = filterAssignee === 'all' || action.assignee === filterAssignee;
      return statusMatch && assigneeMatch;
    });
  };

  const getUniqueAssignees = () => {
    const assignees = [...new Set(actions.map(action => action.assignee))];
    return assignees.sort();
  };

  const getStatusCounts = () => {
    const counts = { todo: 0, 'in-progress': 0, done: 0 };
    actions.forEach(action => {
      counts[action.status]++;
    });
    return counts;
  };

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const statusCounts = getStatusCounts();
  const filteredActions = getFilteredActions();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Action Items Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="text-center">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground">
                  {statusConfig[status as keyof typeof statusConfig].label}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Action Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Action title"
            value={newAction.title}
            onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
          />
          <Textarea
            placeholder="Action description"
            value={newAction.description}
            onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Assignee"
              value={newAction.assignee}
              onChange={(e) => setNewAction({ ...newAction, assignee: e.target.value })}
            />
            <Select value={newAction.priority} onValueChange={(value: any) => setNewAction({ ...newAction, priority: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={newAction.dueDate}
              onChange={(e) => setNewAction({ ...newAction, dueDate: e.target.value })}
            />
          </div>
          <Button onClick={addAction}>Add Action Item</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filter Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterAssignee} onValueChange={setFilterAssignee}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {getUniqueAssignees().map(assignee => (
                  <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Action Items ({filteredActions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActions.map(action => (
              <Card key={action.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{action.title}</h4>
                        {action.dueDate && isOverdue(action.dueDate) && action.status !== 'done' && (
                          <Badge variant="destructive">Overdue</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={priorityConfig[action.priority].color}>
                          {priorityConfig[action.priority].label}
                        </Badge>
                        <Badge variant="outline">
                          {action.assignee}
                        </Badge>
                        {action.dueDate && (
                          <Badge variant="outline">
                            Due: {action.dueDate}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAction(action.id)}
                    >
                      ×
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {Object.entries(statusConfig).map(([status, config]) => (
                      <Button
                        key={status}
                        variant={action.status === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateActionStatus(action.id, status as any)}
                      >
                        {config.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}