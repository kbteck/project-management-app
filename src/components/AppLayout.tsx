import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from './Header';
import Footer from './Footer';
import ToolCategory from './ToolCategory';
import ToolModal from './ToolModal';
import CookieConsent from './CookieConsent';
import { toolCategories } from '@/data/toolsData';

const AppLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const [selectedTool, setSelectedTool] = useState<{ id: string; title: string; icon: string } | null>(null);

  const handleToolClick = (toolId: string) => {
    const tool = toolCategories
      .flatMap(category => category.tools)
      .find(t => t.id === toolId);
    
    if (tool) {
      setSelectedTool({ id: tool.id, title: tool.title, icon: tool.icon });
    }
  };

  const handleCloseModal = () => {
    setSelectedTool(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Agile Project Management Tools</h1>
          <p className="text-muted-foreground text-center">
            Professional toolkit for agile teams and project managers
          </p>
        </div>
        
        <div className="space-y-6">
          {toolCategories.map((category) => (
            <ToolCategory
              key={category.id}
              title={category.title}
              icon={category.icon}
              tools={category.tools}
              onToolClick={handleToolClick}
            />
          ))}
        </div>
      </main>
      <Footer />

      {selectedTool && (
        <ToolModal
          isOpen={!!selectedTool}
          onClose={handleCloseModal}
          toolTitle={selectedTool.title}
          toolIcon={selectedTool.icon}
          toolId={selectedTool.id}
        />
      )}
      
      <CookieConsent />
    </div>
  );
};

export default AppLayout;
