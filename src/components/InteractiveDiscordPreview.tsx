import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { DiscordView, DiscordEmbed, DiscordButton, DiscordSelectMenu } from '@/components/discord/DiscordTypes';

interface InteractiveDiscordPreviewProps {
  views: DiscordView[];
  initialViewId: string;
}

const InteractiveDiscordPreview: React.FC<InteractiveDiscordPreviewProps> = ({ views, initialViewId }) => {
  const [activeViewId, setActiveViewId] = useState<string>(initialViewId);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [actionHistory, setActionHistory] = useState<string[]>([]);

  const activeView = views.find(view => view.id === activeViewId) || views[0];

  const handleButtonClick = (button: DiscordButton) => {
    let actionMessage = `Button "${button.label}" clicked`;

    if (button.action === 'navigate' && button.targetViewId) {
      const targetView = views.find(view => view.id === button.targetViewId);
      if (targetView) {
        setActiveViewId(button.targetViewId);
        actionMessage += ` - Navigated to "${targetView.name}"`;
        if (targetView.ephemeral) {
          actionMessage += " (ephemeral)";
        }
        if (targetView.timeout) {
          actionMessage += ` (timeout: ${targetView.timeout}s)`;
        }
      } else {
        actionMessage += ` - Target view not found`;
      }
    } else if (button.action === 'custom' && button.customCode) {
      actionMessage += ` - Custom action: ${button.customCode}`;
    } else if (button.action === 'ticket') {
      actionMessage += ` - Creating ticket in category: ${button.ticketCategoryId || 'Default'}`;
    }

    setActionHistory(prev => [actionMessage, ...prev.slice(0, 4)]);
  };

  const handleSelectChange = (menuId: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [menuId]: value }));

    const menu = activeView.selectMenus.find(m => m.id === menuId);
    const selectedOption = menu?.options.find(opt => opt.value === value);
    let actionMessage = `Select menu: Selected "${selectedOption?.label || value}"`;

    if (menu?.action === 'navigate' && menu.targetViewId) {
      const targetView = views.find(view => view.id === menu.targetViewId);
      if (targetView) {
        setActiveViewId(menu.targetViewId);
        actionMessage += ` - Navigated to "${targetView.name}"`;
        if (targetView.ephemeral) {
          actionMessage += " (ephemeral)";
        }
        if (targetView.timeout) {
          actionMessage += ` (timeout: ${targetView.timeout}s)`;
        }
      }
    } else if (menu?.action === 'filter') {
      actionMessage += ` - Filtered content`;
    }

    setActionHistory(prev => [actionMessage, ...prev.slice(0, 4)]);
  };

  const handleReturnToMain = () => {
    setActiveViewId(initialViewId);
    const mainView = views.find(view => view.id === initialViewId);
    const actionMessage = `Returned to main screen: "${mainView?.name || 'Initial view'}"`;
    setActionHistory(prev => [actionMessage, ...prev.slice(0, 4)]);
  };

  const getButtonStyleClass = (style: string) => {
    switch (style) {
      case 'primary': return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'secondary': return 'bg-gray-500 hover:bg-gray-600 text-white';
      case 'success': return 'bg-green-600 hover:bg-green-700 text-white';
      case 'danger': return 'bg-red-600 hover:bg-red-700 text-white';
      default: return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  return (
    <Card className="bg-slate-800 text-white overflow-hidden">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Interactive Preview: {activeView.name}</span>
          {activeViewId !== initialViewId && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReturnToMain}
              className="text-white border-gray-600 hover:bg-slate-700"
            >
              <ArrowLeft className="mr-1" size={16} />
              Return to Main
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeView.embeds.map((embed) => (
          <div 
            key={embed.id}
            className="mb-4 rounded border-l-4 p-4"
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
              <div className="mt-4">
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
          </div>
        ))}
        
        {activeView.buttons.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {activeView.buttons.map((button) => (
              <button 
                key={button.id}
                className={`px-4 py-2 rounded ${getButtonStyleClass(button.style)} transition-transform hover:scale-105 ${button.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleButtonClick(button)}
                disabled={button.disabled}
              >
                {button.emoji && <span className="mr-2">{button.emoji}</span>}
                {button.label}
              </button>
            ))}
          </div>
        )}
        
        {activeView.selectMenus.length > 0 && (
          <div className="mt-4 space-y-2">
            {activeView.selectMenus.map((menu) => (
              <Select 
                key={menu.id} 
                value={selectedOptions[menu.id]} 
                onValueChange={(value) => handleSelectChange(menu.id, value)}
                disabled={menu.disabled}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder={menu.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {menu.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.emoji && <span className="mr-2">{option.emoji}</span>}
                      {option.label}
                      {option.description && (
                        <span className="text-xs text-gray-400 block">{option.description}</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        )}

        {actionHistory.length > 0 && (
          <div className="mt-6 border-t border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Action Log:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              {actionHistory.map((action, index) => (
                <li key={index} className="animate-fade-in">{action}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractiveDiscordPreview;
