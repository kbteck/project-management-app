import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>© 2025 AgileIQ. Built with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>by Kelvin Benson</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;