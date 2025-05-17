
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2 } from 'lucide-react';
import { DiscordView } from './DiscordTypes';

interface ViewSelectorProps {
  views: DiscordView[];
  activeViewId: string;
  setActiveViewId: (id: string) => void;
  onAddViewClick: () => void;
  onEditView: (id: string) => void;
  onDeleteView: (id: string) => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ 
  views, 
  activeViewId, 
  setActiveViewId, 
  onAddViewClick,
  onEditView,
  onDeleteView
}) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Views</span>
          <Button onClick={onAddViewClick}>
            <span className="mr-2">+</span>
            Add View
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          {views.map((view) => (
            <div 
              key={view.id}
              className={`p-2 rounded-md flex justify-between items-center cursor-pointer ${
                activeViewId === view.id ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => setActiveViewId(view.id)}
            >
              <span>{view.name}</span>
              <div className="flex space-x-1">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditView(view.id);
                  }}
                  className="p-1 h-auto"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteView(view.id);
                  }}
                  className="p-1 h-auto text-red-500 hover:text-red-400"
                  disabled={views.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ViewSelector;
