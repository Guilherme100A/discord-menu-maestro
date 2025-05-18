
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ViewDialogProps {
  showViewDialog: boolean;
  setShowViewDialog: (show: boolean) => void;
  currentView: { id: string; name: string; ephemeral?: boolean };
  setCurrentView: React.Dispatch<React.SetStateAction<{ id: string; name: string; ephemeral?: boolean }>>;
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
