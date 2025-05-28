
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FolderOpen, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { DiscordView } from './DiscordTypes';

interface MenuStorageProps {
  views: DiscordView[];
  onLoadViews: (views: DiscordView[]) => void;
}

const MenuStorage: React.FC<MenuStorageProps> = ({ views, onLoadViews }) => {
  const [savedMenus, setSavedMenus] = useState<Record<string, DiscordView[]>>(() => {
    const saved = localStorage.getItem('savedDiscordMenus');
    return saved ? JSON.parse(saved) : {};
  });
  const [menuName, setMenuName] = useState('');
  const [showLoadDialog, setShowLoadDialog] = useState(false);

  const saveMenu = () => {
    if (!menuName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a menu name",
        variant: "destructive",
      });
      return;
    }

    const updated = { ...savedMenus, [menuName]: views };
    setSavedMenus(updated);
    localStorage.setItem('savedDiscordMenus', JSON.stringify(updated));
    
    toast({
      title: "Success",
      description: `Menu "${menuName}" saved successfully`,
    });
    
    setMenuName('');
  };

  const loadMenu = (name: string) => {
    const menu = savedMenus[name];
    if (menu) {
      onLoadViews(menu);
      toast({
        title: "Success",
        description: `Menu "${name}" loaded successfully`,
      });
      setShowLoadDialog(false);
    }
  };

  const deleteMenu = (name: string) => {
    const updated = { ...savedMenus };
    delete updated[name];
    setSavedMenus(updated);
    localStorage.setItem('savedDiscordMenus', JSON.stringify(updated));
    
    toast({
      title: "Success",
      description: `Menu "${name}" deleted successfully`,
    });
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Menu Storage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="menuName">Save Current Menu</Label>
          <div className="flex space-x-2">
            <Input
              id="menuName"
              placeholder="Enter menu name..."
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
            />
            <Button onClick={saveMenu}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderOpen className="w-4 h-4 mr-2" />
                Load Menu
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Load Saved Menu</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                {Object.keys(savedMenus).length === 0 ? (
                  <p className="text-gray-500">No saved menus found</p>
                ) : (
                  Object.keys(savedMenus).map((name) => (
                    <div key={name} className="flex justify-between items-center p-2 border rounded">
                      <span>{name}</span>
                      <div className="space-x-2">
                        <Button size="sm" onClick={() => loadMenu(name)}>
                          Load
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteMenu(name)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuStorage;
