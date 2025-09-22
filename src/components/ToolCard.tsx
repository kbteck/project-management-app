import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ToolCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

const ToolCard: React.FC<ToolCardProps> = React.memo(({ icon, title, description, onClick }) => {
  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 hover:border-primary/50"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="text-2xl mb-2">{icon}</div>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardContent>
    </Card>
  );
});

ToolCard.displayName = 'ToolCard';

export default ToolCard;