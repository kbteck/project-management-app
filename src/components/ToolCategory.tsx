import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ToolCard from './ToolCard';

interface Tool {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface ToolCategoryProps {
  title: string;
  icon: string;
  tools: Tool[];
  onToolClick: (toolId: string) => void;
}

const ToolCategory: React.FC<ToolCategoryProps> = ({ title, icon, tools, onToolClick }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
              onClick={() => onToolClick(tool.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolCategory;