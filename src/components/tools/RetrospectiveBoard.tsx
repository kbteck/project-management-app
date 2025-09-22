import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RetroItem {
  id: string;
  text: string;
  category: string;
  author: string;
  votes: number;
}

type Template = 'start-stop-continue' | 'glad-sad-mad' | '4ls';

export default function RetrospectiveBoard() {
  const [template, setTemplate] = useState<Template>('start-stop-continue');
  const [items, setItems] = useState<RetroItem[]>([]);
  const [newItem, setNewItem] = useState({ text: '', category: '', author: '' });

  const templates = {
    'start-stop-continue': {
      name: 'Start, Stop, Continue',
      categories: [
        { key: 'start', name: 'Start', color: 'bg-green-100 border-green-300', description: 'What should we start doing?' },
        { key: 'stop', name: 'Stop', color: 'bg-red-100 border-red-300', description: 'What should we stop doing?' },
        { key: 'continue', name: 'Continue', color: 'bg-blue-100 border-blue-300', description: 'What should we continue doing?' }
      ]
    },
    'glad-sad-mad': {
      name: 'Glad, Sad, Mad',
      categories: [
        { key: 'glad', name: 'Glad', color: 'bg-green-100 border-green-300', description: 'What made you happy?' },
        { key: 'sad', name: 'Sad', color: 'bg-blue-100 border-blue-300', description: 'What made you sad?' },
        { key: 'mad', name: 'Mad', color: 'bg-red-100 border-red-300', description: 'What made you angry?' }
      ]
    },
    '4ls': {
      name: '4 Ls (Liked, Learned, Lacked, Longed For)',
      categories: [
        { key: 'liked', name: 'Liked', color: 'bg-green-100 border-green-300', description: 'What did you like?' },
        { key: 'learned', name: 'Learned', color: 'bg-blue-100 border-blue-300', description: 'What did you learn?' },
        { key: 'lacked', name: 'Lacked', color: 'bg-yellow-100 border-yellow-300', description: 'What was lacking?' },
        { key: 'longed', name: 'Longed For', color: 'bg-purple-100 border-purple-300', description: 'What did you long for?' }
      ]
    }
  };

  const addItem = () => {
    if (!newItem.text.trim() || !newItem.category || !newItem.author.trim()) return;
    const item: RetroItem = {
      id: Date.now().toString(),
      text: newItem.text,
      category: newItem.category,
      author: newItem.author,
      votes: 0
    };
    setItems([...items, item]);
    setNewItem({ text: '', category: '', author: '' });
  };

  const voteForItem = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, votes: item.votes + 1 } : item
    ));
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const getItemsForCategory = (category: string) => 
    items.filter(item => item.category === category).sort((a, b) => b.votes - a.votes);

  const currentTemplate = templates[template];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Retrospective Template</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={template} onValueChange={(value: Template) => setTemplate(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(templates).map(([key, tmpl]) => (
                <SelectItem key={key} value={key}>{tmpl.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Your name"
            value={newItem.author}
            onChange={(e) => setNewItem({ ...newItem, author: e.target.value })}
          />
          <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {currentTemplate.categories.map(cat => (
                <SelectItem key={cat.key} value={cat.key}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Your feedback..."
            value={newItem.text}
            onChange={(e) => setNewItem({ ...newItem, text: e.target.value })}
          />
          <Button onClick={addItem}>Add Item</Button>
        </CardContent>
      </Card>

      <div className={`grid grid-cols-1 ${currentTemplate.categories.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'} gap-6`}>
        {currentTemplate.categories.map(category => (
          <Card key={category.key} className={`${category.color} min-h-[400px]`}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {getItemsForCategory(category.key).map(item => (
                <Card key={item.id} className="bg-white">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm flex-1">{item.text}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        ×
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">by {item.author}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => voteForItem(item.id)}
                        >
                          👍 {item.votes}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}