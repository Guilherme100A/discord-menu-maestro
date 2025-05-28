
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [importMenuName, setImportMenuName] = useState('');

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

  const importMenu = () => {
    if (!importMenuName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a menu name for import",
        variant: "destructive",
      });
      return;
    }

    if (!importCode.trim()) {
      toast({
        title: "Error",
        description: "Please paste the menu code to import",
        variant: "destructive",
      });
      return;
    }

    try {
      const parsedViews: DiscordView[] = JSON.parse(importCode);
      
      // Validate that it's an array of DiscordView objects
      if (!Array.isArray(parsedViews)) {
        throw new Error('Invalid format: Expected an array');
      }

      const updated = { ...savedMenus, [importMenuName]: parsedViews };
      setSavedMenus(updated);
      localStorage.setItem('savedDiscordMenus', JSON.stringify(updated));
      
      toast({
        title: "Success",
        description: `Menu "${importMenuName}" imported and saved successfully`,
      });
      
      setImportMenuName('');
      setImportCode('');
      setShowImportDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid menu code format. Please check the code and try again.",
        variant: "destructive",
      });
    }
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

          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                Import Menu
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Import Menu Code</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="importMenuName">Menu Name</Label>
                  <Input
                    id="importMenuName"
                    placeholder="Enter name for imported menu..."
                    value={importMenuName}
                    onChange={(e) => setImportMenuName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="importCode">Menu Code</Label>
                  <Textarea
                    id="importCode"
                    placeholder="Paste your menu code here..."
                    value={importCode}
                    onChange={(e) => setImportCode(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={importMenu}>
                    Import & Save
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuStorage;
