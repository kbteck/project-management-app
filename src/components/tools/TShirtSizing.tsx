import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface Item {
  id: string;
  title: string;
  description: string;
  size?: 'XS' | 'S' | 'M' | 'L' | 'XL';
  estimatedHours?: number;
}

export default function TShirtSizing() {
  const [items, setItems] = useState<Item[]>([
    { id: '1', title: 'Login Page', description: 'Simple login form with validation' },
    { id: '2', title: 'User Dashboard', description: 'Complex dashboard with multiple widgets' },
    { id: '3', title: 'Bug Fix', description: 'Fix minor styling issue' }
  ]);
  const [newItem, setNewItem] = useState({ title: '', description: '' });

  const sizeConfig = {
    XS: { label: 'XS', color: 'bg-green-100 text-green-800', hours: '1-2' },
    S: { label: 'S', color: 'bg-blue-100 text-blue-800', hours: '3-5' },
    M: { label: 'M', color: 'bg-yellow-100 text-yellow-800', hours: '6-13' },
    L: { label: 'L', color: 'bg-orange-100 text-orange-800', hours: '14-21' },
    XL: { label: 'XL', color: 'bg-red-100 text-red-800', hours: '22+' }
  };

  const addItem = () => {
    if (!newItem.title.trim()) return;
    const item: Item = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description
    };
    setItems([...items, item]);
    setNewItem({ title: '', description: '' });
  };

  const updateItemSize = (itemId: string, size: 'XS' | 'S' | 'M' | 'L' | 'XL') => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, size } : item
    ));
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const getSizeStats = () => {
    const stats = { XS: 0, S: 0, M: 0, L: 0, XL: 0, unestimated: 0 };
    items.forEach(item => {
      if (item.size) {
        stats[item.size]++;
      } else {
        stats.unestimated++;
      }
    });
    return stats;
  };

  const stats = getSizeStats();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>T-Shirt Sizing Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(sizeConfig).map(([size, config]) => (
              <div key={size} className="text-center">
                <Badge className={config.color}>{config.label}</Badge>
                <p className="text-sm text-muted-foreground mt-1">{config.hours} hours</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Item title"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          />
          <Textarea
            placeholder="Item description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          />
          <Button onClick={addItem}>Add Item</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items to Estimate ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map(item => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      ×
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {Object.entries(sizeConfig).map(([size, config]) => (
                      <Button
                        key={size}
                        variant={item.size === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateItemSize(item.id, size as any)}
                      >
                        {config.label}
                      </Button>
                    ))}
                  </div>
                  {item.size && (
                    <Badge className={`mt-2 ${sizeConfig[item.size].color}`}>
                      {item.size} - {sizeConfig[item.size].hours} hours
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estimation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {Object.entries(stats).map(([size, count]) => (
              <div key={size} className="text-center">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground">{size}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}