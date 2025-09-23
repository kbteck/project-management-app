import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-black tracking-tight text-foreground">
                  ILLOX
                </h1>
                <p className="text-xs text-muted-foreground -mt-1 font-medium">
                  Free your workflow
                </p>
              </div>
            </div>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/about')}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-md shadow-sm hover:shadow-md transition-all duration-200 text-sm"
          >
            About
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;