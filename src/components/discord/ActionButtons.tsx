
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Save } from 'lucide-react';
import { DiscordView } from './DiscordTypes';

interface ActionButtonsProps {
  activeView: DiscordView;
  onAddEmbedClick: () => void;
  onAddButtonClick: () => void;
  onAddSelectMenuClick: () => void;
  onShowCodeClick: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  activeView,
  onAddEmbedClick,
  onAddButtonClick,
  onAddSelectMenuClick,
  onShowCodeClick
}) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Active View: {activeView.name}</span>
          <Button onClick={onShowCodeClick}>
            <Save className="mr-2 h-4 w-4" />
            Export Code
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3">
          <Button onClick={onAddEmbedClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Embed
          </Button>
          <Button onClick={onAddButtonClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Button
          </Button>
          <Button onClick={onAddSelectMenuClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Select Menu
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionButtons;
