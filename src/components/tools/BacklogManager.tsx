import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';

interface BacklogItem {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  storyPoints: number;
  status: 'New' | 'Ready' | 'In Progress' | 'Done';
  epic: string;
}

export default function BacklogManager() {
  const [items, setItems] = useState<BacklogItem[]>([
    { id: '1', title: 'User Authentication', description: 'Implement login/logout functionality', priority: 'High', storyPoints: 8, status: 'Ready', epic: 'User Management' },
    { id: '2', title: 'Dashboard UI', description: 'Create main dashboard interface', priority: 'Medium', storyPoints: 5, status: 'New', epic: 'Core Features' }
  ]);
  const [newItem, setNewItem] = useState({ title: '', description: '', priority: 'Medium' as const, storyPoints: 1, epic: '' });
  const [filter, setFilter] = useState({ priority: 'All', status: 'All', epic: 'All' });

  const addItem = () => {
    if (newItem.title) {
      setItems([...items, { 
        id: Date.now().toString(), 
        ...newItem, 
        status: 'New' as const 
      }]);
      setNewItem({ title: '', description: '', priority: 'Medium', storyPoints: 1, epic: '' });
    }
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    const index = items.findIndex(item => item.id === id);
    if ((direction === 'up' && index > 0) || (direction === 'down' && index < items.length - 1)) {
      const newItems = [...items];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
      setItems(newItems);
    }
  };

  const filteredItems = items.filter(item => 
    (filter.priority === 'All' || item.priority === filter.priority) &&
    (filter.status === 'All' || item.status === filter.status) &&
    (filter.epic === 'All' || item.epic.includes(filter.epic))
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Backlog Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Item title" value={newItem.title} onChange={(e) => setNewItem({...newItem, title: e.target.value})} />
            <Input placeholder="Epic" value={newItem.epic} onChange={(e) => setNewItem({...newItem, epic: e.target.value})} />
          </div>
          <Textarea placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={newItem.priority} onValueChange={(value: any) => setNewItem({...newItem, priority: value})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Story Points" value={newItem.storyPoints} onChange={(e) => setNewItem({...newItem, storyPoints: parseInt(e.target.value) || 1})} />
            <Button onClick={addItem}><Plus className="w-4 h-4 mr-2" />Add Item</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filter & Sort</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={filter.priority} onValueChange={(value) => setFilter({...filter, priority: value})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filter.status} onValueChange={(value) => setFilter({...filter, status: value})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Ready">Ready</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Filter by epic" value={filter.epic === 'All' ? '' : filter.epic} onChange={(e) => setFilter({...filter, epic: e.target.value || 'All'})} />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredItems.map((item, index) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                    <Badge variant="outline">{item.status}</Badge>
                    <Badge variant="secondary">{item.storyPoints} pts</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <p className="text-xs text-gray-500">Epic: {item.epic}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => moveItem(item.id, 'up')} disabled={index === 0}>
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => moveItem(item.id, 'down')} disabled={index === filteredItems.length - 1}>
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteItem(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}