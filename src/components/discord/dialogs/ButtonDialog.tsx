
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DiscordButton, DiscordView } from '../DiscordTypes';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';

interface ButtonDialogProps {
  showButtonDialog: boolean;
  setShowButtonDialog: (show: boolean) => void;
  currentButton: DiscordButton;
  setCurrentButton: React.Dispatch<React.SetStateAction<DiscordButton>>;
  handleAddButton: () => void;
  views: DiscordView[];
  isEditMode: boolean;
}

const ButtonDialog: React.FC<ButtonDialogProps> = ({
  showButtonDialog,
  setShowButtonDialog,
  currentButton,
  setCurrentButton,
  handleAddButton,
  views,
  isEditMode
}) => {
  return (
    <Dialog open={showButtonDialog} onOpenChange={setShowButtonDialog}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Button' : 'Add New Button'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="button-label">Label</Label>
            <Input 
              id="button-label" 
              value={currentButton.label} 
              onChange={(e) => setCurrentButton({...currentButton, label: e.target.value})}
              placeholder="Button Text"
            />
          </div>
          <div>
            <Label htmlFor="button-style">Style</Label>
            <Select 
              value={currentButton.style}
              onValueChange={(value) => setCurrentButton({...currentButton, style: value as 'primary' | 'secondary' | 'success' | 'danger'})}
            >
              <SelectTrigger id="button-style">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary (Blue)</SelectItem>
                <SelectItem value="secondary">Secondary (Gray)</SelectItem>
                <SelectItem value="success">Success (Green)</SelectItem>
                <SelectItem value="danger">Danger (Red)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="button-action">Action</Label>
            <Select 
              value={currentButton.action}
              onValueChange={(value) => setCurrentButton({...currentButton, action: value as 'navigate' | 'custom'})}
            >
              <SelectTrigger id="button-action">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="navigate">Navigate to View</SelectItem>
                <SelectItem value="custom">Custom Action</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {currentButton.action === 'navigate' && (
            <div>
              <Label htmlFor="target-view">Target View</Label>
              <Select 
                value={currentButton.targetViewId}
                onValueChange={(value) => setCurrentButton({...currentButton, targetViewId: value})}
              >
                <SelectTrigger id="target-view">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  {views.map((view) => (
                    <SelectItem key={view.id} value={view.id}>{view.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {currentButton.action === 'custom' && (
            <div>
              <Label htmlFor="custom-code">Custom Code (Description)</Label>
              <Input 
                id="custom-code" 
                value={currentButton.customCode || ''} 
                onChange={(e) => setCurrentButton({...currentButton, customCode: e.target.value})}
                placeholder="Describe the custom action"
              />
            </div>
          )}

          {/* New button attributes */}
          <div>
            <Label htmlFor="button-url">URL (for link buttons)</Label>
            <Input 
              id="button-url" 
              value={currentButton.url || ''} 
              onChange={(e) => setCurrentButton({...currentButton, url: e.target.value})}
              placeholder="https://example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="button-emoji">Emoji</Label>
            <Input 
              id="button-emoji" 
              value={currentButton.emoji || ''} 
              onChange={(e) => setCurrentButton({...currentButton, emoji: e.target.value})}
              placeholder="👍"
            />
            <p className="text-sm text-gray-500 mt-1">Unicode emoji or Discord emoji code</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="button-disabled"
              checked={currentButton.disabled || false}
              onCheckedChange={(checked) => 
                setCurrentButton({...currentButton, disabled: checked})
              }
            />
            <Label htmlFor="button-disabled">Disabled</Label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddButton}>
            {isEditMode ? 'Update' : 'Add'} Button
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ButtonDialog;
