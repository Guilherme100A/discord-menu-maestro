
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2 } from 'lucide-react';
import { DiscordSelectMenu, DiscordView } from '../DiscordTypes';

interface SelectMenuDialogProps {
  showSelectMenuDialog: boolean;
  setShowSelectMenuDialog: (show: boolean) => void;
  currentSelectMenu: DiscordSelectMenu;
  setCurrentSelectMenu: React.Dispatch<React.SetStateAction<DiscordSelectMenu>>;
  currentOption: { label: string; value: string; description: string; emoji?: string; default?: boolean };
  setCurrentOption: React.Dispatch<React.SetStateAction<{ label: string; value: string; description: string; emoji?: string; default?: boolean }>>;
  handleAddSelectMenu: () => void;
  handleAddOption: () => void;
  handleRemoveOption: (index: number) => void;
  views: DiscordView[];
  isEditMode: boolean;
}

const SelectMenuDialog: React.FC<SelectMenuDialogProps> = ({
  showSelectMenuDialog,
  setShowSelectMenuDialog,
  currentSelectMenu,
  setCurrentSelectMenu,
  currentOption,
  setCurrentOption,
  handleAddSelectMenu,
  handleAddOption,
  handleRemoveOption,
  views,
  isEditMode
}) => {
  return (
    <Dialog open={showSelectMenuDialog} onOpenChange={setShowSelectMenuDialog}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Select Menu' : 'Add New Select Menu'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input 
              id="placeholder" 
              value={currentSelectMenu.placeholder} 
              onChange={(e) => setCurrentSelectMenu({...currentSelectMenu, placeholder: e.target.value})}
              placeholder="Choose an option..."
            />
          </div>
          <div>
            <Label htmlFor="menu-action">Action</Label>
            <Select 
              value={currentSelectMenu.action}
              onValueChange={(value) => setCurrentSelectMenu({...currentSelectMenu, action: value as 'navigate' | 'filter'})}
            >
              <SelectTrigger id="menu-action">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="navigate">Navigate to View</SelectItem>
                <SelectItem value="filter">Filter Content</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {currentSelectMenu.action === 'navigate' && (
            <div>
              <Label htmlFor="target-view">Target View</Label>
              <Select 
                value={currentSelectMenu.targetViewId}
                onValueChange={(value) => setCurrentSelectMenu({...currentSelectMenu, targetViewId: value})}
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
          
          {/* New select menu attributes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min-values">Min Values</Label>
              <Input 
                id="min-values" 
                type="number"
                min="0"
                max="25"
                value={currentSelectMenu.minValues || 1} 
                onChange={(e) => setCurrentSelectMenu({...currentSelectMenu, minValues: parseInt(e.target.value) || 1})}
              />
            </div>
            <div>
              <Label htmlFor="max-values">Max Values</Label>
              <Input 
                id="max-values" 
                type="number"
                min="1"
                max="25"
                value={currentSelectMenu.maxValues || 1} 
                onChange={(e) => setCurrentSelectMenu({...currentSelectMenu, maxValues: parseInt(e.target.value) || 1})}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="select-disabled"
              checked={currentSelectMenu.disabled || false}
              onCheckedChange={(checked) => 
                setCurrentSelectMenu({...currentSelectMenu, disabled: checked})
              }
            />
            <Label htmlFor="select-disabled">Disabled</Label>
          </div>
          
          <div className="border rounded-md p-3">
            <h3 className="font-medium mb-2">Options</h3>
            {currentSelectMenu.options.length > 0 && (
              <div className="mb-4 space-y-3">
                {currentSelectMenu.options.map((option, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <div>
                      <p className="font-medium">
                        {option.emoji && <span className="mr-1">{option.emoji}</span>}
                        {option.label}
                        {option.default && <span className="ml-2 text-xs bg-blue-500 text-white px-1 py-0.5 rounded">Default</span>}
                      </p>
                      <p className="text-sm text-gray-500">{option.value}</p>
                      {option.description && (
                        <p className="text-xs text-gray-400">{option.description}</p>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleRemoveOption(index)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="grid gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="option-label">Label</Label>
                  <Input 
                    id="option-label" 
                    value={currentOption.label} 
                    onChange={(e) => setCurrentOption({...currentOption, label: e.target.value})}
                    placeholder="Option Label"
                  />
                </div>
                <div>
                  <Label htmlFor="option-value">Value</Label>
                  <Input 
                    id="option-value" 
                    value={currentOption.value} 
                    onChange={(e) => setCurrentOption({...currentOption, value: e.target.value})}
                    placeholder="option_value"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="option-desc">Description (Optional)</Label>
                <Input 
                  id="option-desc" 
                  value={currentOption.description} 
                  onChange={(e) => setCurrentOption({...currentOption, description: e.target.value})}
                  placeholder="Short description"
                />
              </div>
              <div>
                <Label htmlFor="option-emoji">Emoji (Optional)</Label>
                <Input 
                  id="option-emoji" 
                  value={currentOption.emoji || ''} 
                  onChange={(e) => setCurrentOption({...currentOption, emoji: e.target.value})}
                  placeholder="👍"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="option-default"
                  checked={currentOption.default || false}
                  onCheckedChange={(checked) => 
                    setCurrentOption({...currentOption, default: checked})
                  }
                />
                <Label htmlFor="option-default">Default selection</Label>
              </div>
              <Button onClick={handleAddOption}>
                + Add Option
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddSelectMenu}>
            {isEditMode ? 'Update' : 'Add'} Select Menu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectMenuDialog;
