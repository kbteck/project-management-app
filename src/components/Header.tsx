import React from 'react';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">AgileIQ</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/about')}
          >
            <Info className="w-4 h-4 mr-2" />
            About
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;