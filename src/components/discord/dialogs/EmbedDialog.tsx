
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { DiscordEmbed } from '../DiscordTypes';

interface EmbedDialogProps {
  showEmbedDialog: boolean;
  setShowEmbedDialog: (show: boolean) => void;
  currentEmbed: DiscordEmbed;
  setCurrentEmbed: React.Dispatch<React.SetStateAction<DiscordEmbed>>;
  currentField: { name: string; value: string; inline: boolean };
  setCurrentField: React.Dispatch<React.SetStateAction<{ name: string; value: string; inline: boolean }>>;
  handleAddEmbed: () => void;
  handleAddField: () => void;
  handleRemoveField: (index: number) => void;
  isEditMode: boolean;
}

const EmbedDialog: React.FC<EmbedDialogProps> = ({
  showEmbedDialog,
  setShowEmbedDialog,
  currentEmbed,
  setCurrentEmbed,
  currentField,
  setCurrentField,
  handleAddEmbed,
  handleAddField,
  handleRemoveField,
  isEditMode
}) => {
  return (
    <Dialog open={showEmbedDialog} onOpenChange={setShowEmbedDialog}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Embed' : 'Add New Embed'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={currentEmbed.title} 
              onChange={(e) => setCurrentEmbed({...currentEmbed, title: e.target.value})}
              placeholder="Menu Title"
            />
          </div>
          
          <div>
            <Label htmlFor="url">URL (Title Link)</Label>
            <Input 
              id="url" 
              value={currentEmbed.url || ''} 
              onChange={(e) => setCurrentEmbed({...currentEmbed, url: e.target.value})}
              placeholder="https://example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={currentEmbed.description} 
              onChange={(e) => setCurrentEmbed({...currentEmbed, description: e.target.value})}
              placeholder="Description text (supports Markdown)..."
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <Label htmlFor="color">Color</Label>
            <div className="flex items-center space-x-2">
              <input 
                type="color" 
                value={currentEmbed.color} 
                onChange={(e) => setCurrentEmbed({...currentEmbed, color: e.target.value})}
                className="w-10 h-10"
              />
              <Input 
                id="color" 
                value={currentEmbed.color} 
                onChange={(e) => setCurrentEmbed({...currentEmbed, color: e.target.value})}
                placeholder="#5865F2"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="timestamp">Timestamp</Label>
            <Input 
              id="timestamp" 
              type="datetime-local"
              value={currentEmbed.timestamp || ''} 
              onChange={(e) => setCurrentEmbed({...currentEmbed, timestamp: e.target.value})}
            />
          </div>
          
          <div className="border rounded-md p-3">
            <h3 className="font-medium mb-2">Author</h3>
            <div className="grid gap-2">
              <div>
                <Label htmlFor="author-name">Name</Label>
                <Input 
                  id="author-name" 
                  value={currentEmbed.author?.name || ''} 
                  onChange={(e) => setCurrentEmbed({
                    ...currentEmbed, 
                    author: {
                      name: e.target.value || 'Author', // Ensure name is always provided
                      url: currentEmbed.author?.url,
                      iconUrl: currentEmbed.author?.iconUrl
                    }
                  })}
                  placeholder="Author name"
                />
              </div>
              <div>
                <Label htmlFor="author-url">URL</Label>
                <Input 
                  id="author-url" 
                  value={currentEmbed.author?.url || ''} 
                  onChange={(e) => setCurrentEmbed({
                    ...currentEmbed, 
                    author: {
                      name: currentEmbed.author?.name || 'Author', // Ensure name is always provided
                      url: e.target.value,
                      iconUrl: currentEmbed.author?.iconUrl
                    }
                  })}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label htmlFor="author-icon-url">Icon URL</Label>
                <Input 
                  id="author-icon-url" 
                  value={currentEmbed.author?.iconUrl || ''} 
                  onChange={(e) => setCurrentEmbed({
                    ...currentEmbed, 
                    author: {
                      name: currentEmbed.author?.name || 'Author', // Ensure name is always provided
                      url: currentEmbed.author?.url,
                      iconUrl: e.target.value
                    }
                  })}
                  placeholder="https://example.com/icon.png"
                />
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-3">
            <h3 className="font-medium mb-2">Images</h3>
            <div className="grid gap-2">
              <div>
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input 
                  id="thumbnail" 
                  value={currentEmbed.thumbnail || ''} 
                  onChange={(e) => setCurrentEmbed({...currentEmbed, thumbnail: e.target.value})}
                  placeholder="https://example.com/thumbnail.png"
                />
              </div>
              
              <div>
                <Label htmlFor="image">Main Image URL</Label>
                <Input 
                  id="image" 
                  value={currentEmbed.image || ''} 
                  onChange={(e) => setCurrentEmbed({...currentEmbed, image: e.target.value})}
                  placeholder="https://example.com/image.png"
                />
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-3">
            <h3 className="font-medium mb-2">Footer</h3>
            <div className="grid gap-2">
              <div>
                <Label htmlFor="footer-text">Text</Label>
                <Input 
                  id="footer-text" 
                  value={currentEmbed.footer?.text || ''} 
                  onChange={(e) => setCurrentEmbed({
                    ...currentEmbed, 
                    footer: {
                      text: e.target.value || 'Footer text', // Ensure text is always provided
                      iconUrl: currentEmbed.footer?.iconUrl
                    }
                  })}
                  placeholder="Footer text"
                />
              </div>
              
              <div>
                <Label htmlFor="footer-icon">Icon URL</Label>
                <Input 
                  id="footer-icon" 
                  value={currentEmbed.footer?.iconUrl || ''} 
                  onChange={(e) => setCurrentEmbed({
                    ...currentEmbed, 
                    footer: {
                      text: currentEmbed.footer?.text || 'Footer text', // Ensure text is always provided
                      iconUrl: e.target.value
                    }
                  })}
                  placeholder="https://example.com/footer-icon.png"
                />
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-3">
            <h3 className="font-medium mb-2">Fields</h3>
            {currentEmbed.fields.length > 0 && (
              <div className="mb-4 space-y-3">
                {currentEmbed.fields.map((field, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <div>
                      <p className="font-medium">{field.name}</p>
                      <p className="text-sm text-gray-500">{field.value}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleRemoveField(index)}
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
                  <Label htmlFor="field-name">Field Name</Label>
                  <Input 
                    id="field-name" 
                    value={currentField.name} 
                    onChange={(e) => setCurrentField({...currentField, name: e.target.value})}
                    placeholder="Name"
                  />
                </div>
                <div className="flex items-end space-x-2">
                  <div className="flex-grow">
                    <Label htmlFor="field-value">Field Value</Label>
                    <Input 
                      id="field-value" 
                      value={currentField.value} 
                      onChange={(e) => setCurrentField({...currentField, value: e.target.value})}
                      placeholder="Value"
                    />
                  </div>
                  <div className="flex items-center h-10 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      id="inline" 
                      checked={currentField.inline} 
                      onChange={(e) => setCurrentField({...currentField, inline: e.target.checked})}
                      className="mr-2"
                    />
                    <Label htmlFor="inline">Inline</Label>
                  </div>
                </div>
              </div>
              <Button onClick={handleAddField}>
                + Add Field
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddEmbed}>
            {isEditMode ? 'Update' : 'Add'} Embed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmbedDialog;
