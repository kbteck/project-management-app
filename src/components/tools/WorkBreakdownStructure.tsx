import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, ChevronRight, ChevronDown, Trash2 } from 'lucide-react';

interface WBSItem {
  id: string;
  title: string;
  level: number;
  parentId?: string;
  children: WBSItem[];
  expanded: boolean;
}

export const WorkBreakdownStructure: React.FC = () => {
  const [wbsItems, setWbsItems] = useState<WBSItem[]>([
    {
      id: '1',
      title: 'Project Management',
      level: 1,
      expanded: true,
      children: [
        { id: '1.1', title: 'Planning', level: 2, parentId: '1', expanded: false, children: [] },
        { id: '1.2', title: 'Execution', level: 2, parentId: '1', expanded: false, children: [] },
      ]
    },
    {
      id: '2',
      title: 'Development',
      level: 1,
      expanded: true,
      children: [
        { id: '2.1', title: 'Frontend', level: 2, parentId: '2', expanded: false, children: [] },
        { id: '2.2', title: 'Backend', level: 2, parentId: '2', expanded: false, children: [] },
      ]
    }
  ]);

  const [newItemTitle, setNewItemTitle] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string>('');

  const addItem = () => {
    if (!newItemTitle.trim()) return;

    const newItem: WBSItem = {
      id: Date.now().toString(),
      title: newItemTitle,
      level: selectedParentId ? 2 : 1,
      parentId: selectedParentId || undefined,
      expanded: false,
      children: []
    };

    if (selectedParentId) {
      setWbsItems(prev => prev.map(item => 
        item.id === selectedParentId 
          ? { ...item, children: [...item.children, newItem] }
          : item
      ));
    } else {
      setWbsItems(prev => [...prev, newItem]);
    }

    setNewItemTitle('');
    setSelectedParentId('');
  };

  const toggleExpanded = (id: string) => {
    setWbsItems(prev => prev.map(item => 
      item.id === id ? { ...item, expanded: !item.expanded } : item
    ));
  };

  const deleteItem = (id: string) => {
    setWbsItems(prev => prev.filter(item => item.id !== id).map(item => ({
      ...item,
      children: item.children.filter(child => child.id !== id)
    })));
  };

  const renderWBSItem = (item: WBSItem) => (
    <div key={item.id} className="mb-2">
      <Card className={`${item.level === 1 ? 'border-l-4 border-l-blue-500' : 'ml-6 border-l-2 border-l-gray-300'}`}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {item.children.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(item.id)}
                >
                  {item.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
              )}
              <span className="font-medium">{item.id}</span>
              <span>{item.title}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteItem(item.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      {item.expanded && item.children.map(child => renderWBSItem(child))}
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">🏗️ Work Breakdown Structure</h2>
        <p className="text-gray-600">Break down your project into manageable components</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add WBS Item
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Item title"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              className="flex-1"
            />
            <select
              value={selectedParentId}
              onChange={(e) => setSelectedParentId(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">Root Level</option>
              {wbsItems.map(item => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </select>
            <Button onClick={addItem}>Add</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {wbsItems.map(item => renderWBSItem(item))}
      </div>
    </div>
  );
};