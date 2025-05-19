
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface ViewDialogProps {
  showViewDialog: boolean;
  setShowViewDialog: (show: boolean) => void;
  currentView: { id: string; name: string; ephemeral?: boolean; timeout?: number };
  setCurrentView: React.Dispatch<React.SetStateAction<{ id: string; name: string; ephemeral?: boolean; timeout?: number }>>;
  isEditMode: boolean;
  handleAddView: () => void;
}

const ViewDialog: React.FC<ViewDialogProps> = ({
  showViewDialog,
  setShowViewDialog,
  currentView,
  setCurrentView,
  isEditMode,
  handleAddView
}) => {
  return (
    <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit View' : 'Add New View'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="view-name">Name</Label>
            <Input 
              id="view-name" 
              value={currentView.name} 
              onChange={(e) => setCurrentView({...currentView, name: e.target.value})}
              placeholder="Main Menu"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="ephemeral-mode"
              checked={currentView.ephemeral || false}
              onCheckedChange={(checked) => 
                setCurrentView({...currentView, ephemeral: checked})
              }
            />
            <Label htmlFor="ephemeral-mode">Ephemeral Message</Label>
            <div className="ml-1 text-xs text-gray-500">
              (Only visible to the user who triggered it)
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="timeout-slider">Message Timeout (seconds)</Label>
              <span className="text-sm">{currentView.timeout || 0}</span>
            </div>
            <Slider
              id="timeout-slider"
              min={0}
              max={300}
              step={5}
              value={[currentView.timeout || 0]}
              onValueChange={(values) => 
                setCurrentView({...currentView, timeout: values[0]})
              }
            />
            <div className="text-xs text-gray-500 mt-1">
              (0 = no timeout, max 300 seconds)
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddView}>
            {isEditMode ? 'Update' : 'Add'} View
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDialog;
