
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2 } from 'lucide-react';
import { DiscordView } from './DiscordTypes';
import { getButtonStyleClass } from './utils';

interface DiscordPreviewProps {
  activeView: DiscordView;
  onEditItem: (type: 'embed' | 'button' | 'select' | 'view', id: string) => void;
  onDeleteItem: (type: 'embed' | 'button' | 'select' | 'view', id: string) => void;
}

const DiscordPreview: React.FC<DiscordPreviewProps> = ({
  activeView,
  onEditItem,
  onDeleteItem
}) => {
  return (
    <Card className="bg-slate-800 text-white overflow-hidden">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Discord Preview: {activeView.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeView.embeds.map((embed) => (
          <div 
            key={embed.id}
            className="mb-4 rounded border-l-4 p-4 relative"
            style={{ borderLeftColor: embed.color, backgroundColor: '#2f3136' }}
          >
            {embed.author && (
              <div className="flex items-center mb-2">
                {embed.author.iconUrl && (
                  <img src={embed.author.iconUrl} alt="Author" className="w-6 h-6 rounded-full mr-2" />
                )}
                <span className="font-medium text-sm">
                  {embed.author.url ? (
                    <a href={embed.author.url} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                      {embed.author.name}
                    </a>
                  ) : embed.author.name}
                </span>
              </div>
            )}
            
            <h3 className="text-xl font-semibold">
              {embed.url ? (
                <a href={embed.url} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                  {embed.title}
                </a>
              ) : embed.title}
            </h3>
            
            <p className="mt-2 text-gray-300 whitespace-pre-wrap">{embed.description}</p>
            
            {embed.thumbnail && (
              <div className="float-right ml-4 mt-2">
                <img src={embed.thumbnail} alt="Thumbnail" className="max-w-[80px] rounded" />
              </div>
            )}
            
            {embed.fields.length > 0 && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {embed.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex} className={field.inline ? "col-span-1" : "col-span-2"}>
                    <h4 className="font-semibold">{field.name}</h4>
                    <p className="text-gray-300">{field.value}</p>
                  </div>
                ))}
              </div>
            )}
            
            {embed.image && (
              <div className="mt-4 clear-both">
                <img src={embed.image} alt="Embed image" className="max-w-full rounded" />
              </div>
            )}
            
            {embed.footer && (
              <div className="mt-4 pt-2 border-t border-gray-700 flex items-center">
                {embed.footer.iconUrl && (
                  <img src={embed.footer.iconUrl} alt="Footer icon" className="w-4 h-4 rounded-full mr-2" />
                )}
                <span className="text-xs text-gray-400">{embed.footer.text}</span>
              </div>
            )}
            
            <div className="absolute top-2 right-2 flex space-x-1">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onEditItem('embed', embed.id)}
                className="p-1 h-auto"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onDeleteItem('embed', embed.id)}
                className="p-1 h-auto text-red-500 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        {activeView.buttons.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {activeView.buttons.map((button) => (
              <div key={button.id} className="relative group">
                <button className={`px-4 py-2 rounded ${getButtonStyleClass(button.style)}`}>
                  {button.label}
                </button>
                <div className="absolute -top-1 -right-1 flex opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onEditItem('button', button.id)}
                    className="p-1 h-auto bg-gray-800 rounded-full"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onDeleteItem('button', button.id)}
                    className="p-1 h-auto bg-gray-800 rounded-full text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeView.selectMenus.length > 0 && (
          <div className="mt-4 space-y-2">
            {activeView.selectMenus.map((menu) => (
              <div key={menu.id} className="relative group">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={menu.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {menu.options.map((option, optIndex) => (
                      <SelectItem key={optIndex} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="absolute -top-1 -right-1 flex opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onEditItem('select', menu.id)}
                    className="p-1 h-auto bg-gray-800 rounded-full"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onDeleteItem('select', menu.id)}
                    className="p-1 h-auto bg-gray-800 rounded-full text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiscordPreview;
