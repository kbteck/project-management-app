import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const paddingClasses = {
    sm: 'py-4',
    md: 'py-6',
    lg: 'py-8'
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className={`flex items-center justify-center ${paddingClasses[size]}`}>
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary mr-2`} />
        <span className="text-muted-foreground">{message}</span>
      </CardContent>
    </Card>
  );
};

export default LoadingSpinner;