import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, Copy, Edit, Save } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import InteractiveDiscordPreview from '@/components/InteractiveDiscordPreview';

interface DiscordEmbed {
  id: string;
  title: string;
  description: string;
  color: string;
  fields: { name: string; value: string; inline: boolean }[];
}

interface DiscordButton {
  id: string;
  label: string;
  style: 'primary' | 'secondary' | 'success' | 'danger';
  action: 'navigate' | 'custom';
  targetViewId?: string;
  customCode?: string;
}

interface DiscordSelectMenu {
  id: string;
  placeholder: string;
  options: { label: string; value: string; description?: string }[];
  action: 'filter' | 'navigate';
  targetViewId?: string;
}

interface DiscordView {
  id: string;
  name: string;
  embeds: DiscordEmbed[];
  buttons: DiscordButton[];
  selectMenus: DiscordSelectMenu[];
}

const Index: React.FC = () => {
  const [views, setViews] = useState<DiscordView[]>(() => {
    const savedViews = localStorage.getItem('discordViews');
    return savedViews ? JSON.parse(savedViews) : [{
      id: 'main_view',
      name: 'Main View',
      embeds: [],
      buttons: [],
      selectMenus: []
    }];
  });
  
  const [activeViewId, setActiveViewId] = useState<string>('main_view');
  const [showEmbedDialog, setShowEmbedDialog] = useState<boolean>(false);
  const [showButtonDialog, setShowButtonDialog] = useState<boolean>(false);
  const [showSelectMenuDialog, setShowSelectMenuDialog] = useState<boolean>(false);
  const [showViewDialog, setShowViewDialog] = useState<boolean>(false);
  const [showCodeDialog, setShowCodeDialog] = useState<boolean>(false);

  const [currentEmbed, setCurrentEmbed] = useState<DiscordEmbed>({
    id: '',
    title: '',
    description: '',
    color: '#5865F2',
    fields: []
  });

  const [currentButton, setCurrentButton] = useState<DiscordButton>({
    id: '',
    label: '',
    style: 'primary',
    action: 'navigate',
    targetViewId: ''
  });

  const [currentSelectMenu, setCurrentSelectMenu] = useState<DiscordSelectMenu>({
    id: '',
    placeholder: '',
    options: [],
    action: 'navigate'
  });

  const [currentView, setCurrentView] = useState<{ id: string; name: string }>({
    id: '',
    name: ''
  });

  const [currentField, setCurrentField] = useState<{name: string; value: string; inline: boolean}>({
    name: '',
    value: '',
    inline: false
  });

  const [currentOption, setCurrentOption] = useState<{label: string; value: string; description: string}>({
    label: '',
    value: '',
    description: ''
  });

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editItemId, setEditItemId] = useState<string>('');

  const activeView = views.find(view => view.id === activeViewId) || views[0];

  useEffect(() => {
    localStorage.setItem('discordViews', JSON.stringify(views));
  }, [views]);

  const generateId = (prefix: string): string => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleAddView = () => {
    if (!currentView.name.trim()) {
      toast({
        title: "Error",
        description: "View name is required",
        variant: "destructive",
      });
      return;
    }

    const newId = currentView.id || generateId('view');
    
    if (isEditMode) {
      setViews(views.map(view => 
        view.id === editItemId ? { ...view, name: currentView.name } : view
      ));
      toast({
        title: "Success",
        description: "View updated successfully",
      });
    } else {
      setViews([...views, {
        id: newId,
        name: currentView.name,
        embeds: [],
        buttons: [],
        selectMenus: []
      }]);
      toast({
        title: "Success",
        description: "New view added",
      });
    }
    
    setCurrentView({ id: '', name: '' });
    setShowViewDialog(false);
    setIsEditMode(false);
    setEditItemId('');
  };

  const handleAddEmbed = () => {
    if (!currentEmbed.title.trim()) {
      toast({
        title: "Error",
        description: "Embed title is required",
        variant: "destructive",
      });
      return;
    }

    const newId = currentEmbed.id || generateId('embed');
    
    setViews(views.map(view => {
      if (view.id === activeViewId) {
        if (isEditMode) {
          return {
            ...view,
            embeds: view.embeds.map(embed => 
              embed.id === editItemId ? { ...currentEmbed, id: editItemId } : embed
            )
          };
        } else {
          return {
            ...view,
            embeds: [...view.embeds, { ...currentEmbed, id: newId }]
          };
        }
      }
      return view;
    }));

    setCurrentEmbed({
      id: '',
      title: '',
      description: '',
      color: '#5865F2',
      fields: []
    });
    
    setShowEmbedDialog(false);
    setIsEditMode(false);
    setEditItemId('');
    
    toast({
      title: isEditMode ? "Embed Updated" : "Embed Added",
      description: isEditMode ? "The embed was updated successfully" : "New embed added to the view",
    });
  };

  const handleAddField = () => {
    if (!currentField.name.trim() || !currentField.value.trim()) {
      toast({
        title: "Error",
        description: "Field name and value are required",
        variant: "destructive",
      });
      return;
    }

    setCurrentEmbed({
      ...currentEmbed,
      fields: [...currentEmbed.fields, { ...currentField }]
    });
    
    setCurrentField({
      name: '',
      value: '',
      inline: false
    });
    
    toast({
      description: "Field added to embed",
    });
  };

  const handleRemoveField = (index: number) => {
    setCurrentEmbed({
      ...currentEmbed,
      fields: currentEmbed.fields.filter((_, i) => i !== index)
    });
  };

  const handleAddButton = () => {
    if (!currentButton.label.trim()) {
      toast({
        title: "Error",
        description: "Button label is required",
        variant: "destructive",
      });
      return;
    }

    if (currentButton.action === 'navigate' && !currentButton.targetViewId) {
      toast({
        title: "Error",
        description: "Please select a target view for navigation",
        variant: "destructive",
      });
      return;
    }

    const newId = currentButton.id || generateId('button');
    
    setViews(views.map(view => {
      if (view.id === activeViewId) {
        if (isEditMode) {
          return {
            ...view,
            buttons: view.buttons.map(button => 
              button.id === editItemId ? { ...currentButton, id: editItemId } : button
            )
          };
        } else {
          return {
            ...view,
            buttons: [...view.buttons, { ...currentButton, id: newId }]
          };
        }
      }
      return view;
    }));

    setCurrentButton({
      id: '',
      label: '',
      style: 'primary',
      action: 'navigate',
      targetViewId: ''
    });
    
    setShowButtonDialog(false);
    setIsEditMode(false);
    setEditItemId('');
    
    toast({
      title: isEditMode ? "Button Updated" : "Button Added",
      description: isEditMode ? "The button was updated successfully" : "New button added to the view",
    });
  };

  const handleAddOption = () => {
    if (!currentOption.label.trim() || !currentOption.value.trim()) {
      toast({
        title: "Error",
        description: "Option label and value are required",
        variant: "destructive",
      });
      return;
    }

    setCurrentSelectMenu({
      ...currentSelectMenu,
      options: [...currentSelectMenu.options, { ...currentOption }]
    });
    
    setCurrentOption({
      label: '',
      value: '',
      description: ''
    });
    
    toast({
      description: "Option added to select menu",
    });
  };

  const handleRemoveOption = (index: number) => {
    setCurrentSelectMenu({
      ...currentSelectMenu,
      options: currentSelectMenu.options.filter((_, i) => i !== index)
    });
  };

  const handleAddSelectMenu = () => {
    if (!currentSelectMenu.placeholder.trim() || currentSelectMenu.options.length === 0) {
      toast({
        title: "Error",
        description: "Placeholder and at least one option are required",
        variant: "destructive",
      });
      return;
    }

    if (currentSelectMenu.action === 'navigate' && !currentSelectMenu.targetViewId) {
      toast({
        title: "Error",
        description: "Please select a target view for navigation",
        variant: "destructive",
      });
      return;
    }

    const newId = currentSelectMenu.id || generateId('select');
    
    setViews(views.map(view => {
      if (view.id === activeViewId) {
        if (isEditMode) {
          return {
            ...view,
            selectMenus: view.selectMenus.map(menu => 
              menu.id === editItemId ? { ...currentSelectMenu, id: editItemId } : menu
            )
          };
        } else {
          return {
            ...view,
            selectMenus: [...view.selectMenus, { ...currentSelectMenu, id: newId }]
          };
        }
      }
      return view;
    }));

    setCurrentSelectMenu({
      id: '',
      placeholder: '',
      options: [],
      action: 'navigate'
    });
    
    setShowSelectMenuDialog(false);
    setIsEditMode(false);
    setEditItemId('');
    
    toast({
      title: isEditMode ? "Select Menu Updated" : "Select Menu Added",
      description: isEditMode ? "The select menu was updated successfully" : "New select menu added to the view",
    });
  };

  const handleDeleteItem = (type: 'embed' | 'button' | 'select' | 'view', id: string) => {
    if (type === 'view') {
      if (views.length <= 1) {
        toast({
          title: "Error",
          description: "Cannot delete the only view",
          variant: "destructive",
        });
        return;
      }
      
      const newViews = views.filter(view => view.id !== id);
      setViews(newViews);
      
      // If we deleted the active view, switch to another one
      if (id === activeViewId) {
        setActiveViewId(newViews[0].id);
      }
      
      // Update any buttons or select menus that referenced this view
      setViews(newViews.map(view => ({
        ...view,
        buttons: view.buttons.map(button => 
          button.targetViewId === id ? { ...button, targetViewId: '' } : button
        ),
        selectMenus: view.selectMenus.map(menu => 
          menu.targetViewId === id ? { ...menu, targetViewId: '' } : menu
        )
      })));
    } else {
      setViews(views.map(view => {
        if (view.id === activeViewId) {
          if (type === 'embed') {
            return { ...view, embeds: view.embeds.filter(embed => embed.id !== id) };
          } else if (type === 'button') {
            return { ...view, buttons: view.buttons.filter(button => button.id !== id) };
          } else if (type === 'select') {
            return { ...view, selectMenus: view.selectMenus.filter(menu => menu.id !== id) };
          }
        }
        return view;
      }));
    }
    
    toast({
      title: "Deleted",
      description: `The ${type} has been deleted`,
    });
  };

  const handleEditItem = (type: 'embed' | 'button' | 'select' | 'view', id: string) => {
    setIsEditMode(true);
    setEditItemId(id);
    
    if (type === 'view') {
      const viewToEdit = views.find(view => view.id === id);
      if (viewToEdit) {
        setCurrentView({
          id: viewToEdit.id,
          name: viewToEdit.name
        });
        setShowViewDialog(true);
      }
    } else if (type === 'embed') {
      const embedToEdit = activeView.embeds.find(embed => embed.id === id);
      if (embedToEdit) {
        setCurrentEmbed({ ...embedToEdit });
        setShowEmbedDialog(true);
      }
    } else if (type === 'button') {
      const buttonToEdit = activeView.buttons.find(button => button.id === id);
      if (buttonToEdit) {
        setCurrentButton({ ...buttonToEdit });
        setShowButtonDialog(true);
      }
    } else if (type === 'select') {
      const menuToEdit = activeView.selectMenus.find(menu => menu.id === id);
      if (menuToEdit) {
        setCurrentSelectMenu({ ...menuToEdit });
        setShowSelectMenuDialog(true);
      }
    }
  };

  const generateDiscordCode = () => {
    // Generate Python code using discord.py
    const pythonCode = `
import discord
from discord.ext import commands
from discord import ButtonStyle
import os
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix='!', intents=intents)

# Dictionary to store all views
views = ${JSON.stringify(views, null, 2)}

class MenuView(discord.ui.View):
    def __init__(self, view_id):
        super().__init__(timeout=None)
        self.view_id = view_id
        self.view_data = next((v for v in views if v["id"] == view_id), None)
        
        # Add buttons
        if self.view_data:
            for button in self.view_data["buttons"]:
                btn = discord.ui.Button(
                    label=button["label"],
                    style=getattr(ButtonStyle, button["style"].upper()),
                    custom_id=f"button_{button['id']}"
                )
                self.add_item(btn)
            
            # Add select menus
            for menu in self.view_data["selectMenus"]:
                options = []
                for opt in menu["options"]:
                    options.append(
                        discord.SelectOption(
                            label=opt["label"], 
                            value=opt["value"], 
                            description=opt.get("description", "")
                        )
                    )
                select = discord.ui.Select(
                    placeholder=menu["placeholder"],
                    options=options,
                    custom_id=f"select_{menu['id']}"
                )
                self.add_item(select)

@bot.event
async def on_ready():
    print(f'{bot.user.name} has connected to Discord!')

@bot.command(name='menu')
async def menu(ctx, view_id='main_view'):
    """Display the menu for the bot"""
    view_data = next((v for v in views if v["id"] == view_id), None)
    
    if not view_data:
        await ctx.send(f"View '{view_id}' not found.")
        return
    
    embeds = []
    for embed_data in view_data["embeds"]:
        embed = discord.Embed(
            title=embed_data["title"],
            description=embed_data["description"],
            color=int(embed_data["color"].lstrip('#'), 16)
        )
        for field in embed_data["fields"]:
            embed.add_field(name=field["name"], value=field["value"], inline=field["inline"])
        embeds.append(embed)
    
    view = MenuView(view_id)
    if embeds:
        await ctx.send(embeds=embeds, view=view)
    else:
        await ctx.send(f"Menu: {view_data['name']}", view=view)

@bot.event
async def on_interaction(interaction):
    if interaction.type == discord.InteractionType.component:
        custom_id = interaction.data["custom_id"]
        
        if custom_id.startswith("button_"):
            button_id = custom_id[7:]  # Remove "button_" prefix
            
            # Find the button data
            for view in views:
                button = next((b for b in view["buttons"] if b["id"] == button_id), None)
                if button:
                    if button["action"] == "navigate" and button["targetViewId"]:
                        # Navigate to another view
                        target_view = next((v for v in views if v["id"] == button["targetViewId"]), None)
                        if target_view:
                            embeds = []
                            for embed_data in target_view["embeds"]:
                                embed = discord.Embed(
                                    title=embed_data["title"],
                                    description=embed_data["description"],
                                    color=int(embed_data["color"].lstrip('#'), 16)
                                )
                                for field in embed_data["fields"]:
                                    embed.add_field(name=field["name"], value=field["value"], inline=field["inline"])
                                embeds.append(embed)
                            
                            new_view = MenuView(button["targetViewId"])
                            await interaction.response.edit_message(embeds=embeds if embeds else [], content=None if embeds else f"Menu: {target_view['name']}", view=new_view)
                            return
                    elif button["action"] == "custom" and button.get("customCode"):
                        # This would execute custom code, simplified for the example
                        await interaction.response.send_message(f"Custom button action: {button.get('customCode')}", ephemeral=True)
                        return
        
        elif custom_id.startswith("select_"):
            select_id = custom_id[7:]  # Remove "select_" prefix
            selected_value = interaction.data["values"][0]
            
            # Find the select menu data
            for view in views:
                menu = next((m for m in view["selectMenus"] if m["id"] == select_id), None)
                if menu:
                    if menu["action"] == "navigate" and menu["targetViewId"]:
                        # Navigate to another view based on selection
                        target_view = next((v for v in views if v["id"] == menu["targetViewId"]), None)
                        if target_view:
                            embeds = []
                            for embed_data in target_view["embeds"]:
                                embed = discord.Embed(
                                    title=embed_data["title"],
                                    description=embed_data["description"],
                                    color=int(embed_data["color"].lstrip('#'), 16)
                                )
                                for field in embed_data["fields"]:
                                    embed.add_field(name=field["name"], value=field["value"], inline=field["inline"])
                                embeds.append(embed)
                            
                            new_view = MenuView(menu["targetViewId"])
                            await interaction.response.edit_message(embeds=embeds if embeds else [], content=None if embeds else f"Menu: {target_view['name']}", view=new_view)
                            return
                    elif menu["action"] == "filter":
                        # Filter content based on selection
                        current_view = view
                        await interaction.response.send_message(f"Selected filter: {selected_value}", ephemeral=True)
                        return

# Run the bot
bot.run(TOKEN)
    `;
    
    const javascriptCode = `
// Discord.js implementation (Node.js)
const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
require('dotenv').config();

// Store all views
const views = ${JSON.stringify(views, null, 2)};

client.once('ready', () => {
    console.log(\`Logged in as \${client.user.tag}\`);
});

// Function to create embeds from view data
function createEmbeds(viewData) {
    return viewData.embeds.map(embedData => {
        const embed = new MessageEmbed()
            .setTitle(embedData.title)
            .setDescription(embedData.description)
            .setColor(embedData.color);
            
        embedData.fields.forEach(field => {
            embed.addField(field.name, field.value, field.inline);
        });
        
        return embed;
    });
}

// Function to create components (buttons, select menus) from view data
function createComponents(viewData) {
    const components = [];
    
    // Create button rows (max 5 buttons per row)
    if (viewData.buttons.length > 0) {
        const buttonRows = [];
        for (let i = 0; i < viewData.buttons.length; i += 5) {
            const row = new MessageActionRow();
            const buttonsSlice = viewData.buttons.slice(i, i + 5);
            
            buttonsSlice.forEach(button => {
                row.addComponents(
                    new MessageButton()
                        .setCustomId(\`button_\${button.id}\`)
                        .setLabel(button.label)
                        .setStyle(button.style.toUpperCase())
                );
            });
            
            buttonRows.push(row);
        }
        components.push(...buttonRows);
    }
    
    // Create select menu rows (one menu per row)
    viewData.selectMenus.forEach(menu => {
        const row = new MessageActionRow();
        const selectMenu = new MessageSelectMenu()
            .setCustomId(\`select_\${menu.id}\`)
            .setPlaceholder(menu.placeholder);
            
        menu.options.forEach(option => {
            selectMenu.addOptions({
                label: option.label,
                value: option.value,
                description: option.description || undefined
            });
        });
        
        row.addComponents(selectMenu);
        components.push(row);
    });
    
    return components;
}

// Command to show menu
client.on('messageCreate', async message => {
    if (message.content.startsWith('!menu')) {
        const args = message.content.split(' ');
        const viewId = args[1] || 'main_view';
        
        const viewData = views.find(v => v.id === viewId);
        if (!viewData) {
            message.reply(\`View '\${viewId}' not found.\`);
            return;
        }
        
        const embeds = createEmbeds(viewData);
        const components = createComponents(viewData);
        
        if (embeds.length > 0) {
            await message.channel.send({ 
                embeds: embeds, 
                components: components 
            });
        } else {
            await message.channel.send({ 
                content: \`Menu: \${viewData.name}\`, 
                components: components 
            });
        }
    }
});

// Handle interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton() && !interaction.isSelectMenu()) return;
    
    const customId = interaction.customId;
    
    if (customId.startsWith('button_')) {
        const buttonId = customId.substring(7); // Remove 'button_' prefix
        
        // Find the button data
        for (const view of views) {
            const button = view.buttons.find(b => b.id === buttonId);
            if (button) {
                if (button.action === 'navigate' && button.targetViewId) {
                    // Navigate to another view
                    const targetView = views.find(v => v.id === button.targetViewId);
                    if (targetView) {
                        const embeds = createEmbeds(targetView);
                        const components = createComponents(targetView);
                        
                        await interaction.update({
                            embeds: embeds.length > 0 ? embeds : [],
                            content: embeds.length > 0 ? null : \`Menu: \${targetView.name}\`,
                            components: components
                        });
                    }
                } else if (button.action === 'custom' && button.customCode) {
                    // Execute custom action
                    await interaction.reply({ 
                        content: \`Custom button action: \${button.customCode}\`, 
                        ephemeral: true 
                    });
                }
                break;
            }
        }
    } else if (customId.startsWith('select_')) {
        const selectId = customId.substring(7); // Remove 'select_' prefix
        const selectedValue = interaction.values[0];
        
        // Find the select menu data
        for (const view of views) {
            const menu = view.selectMenus.find(m => m.id === selectId);
            if (menu) {
                if (menu.action === 'navigate' && menu.targetViewId) {
                    // Navigate to another view based on selection
                    const targetView = views.find(v => v.id === menu.targetViewId);
                    if (targetView) {
                        const embeds = createEmbeds(targetView);
                        const components = createComponents(targetView);
                        
                        await interaction.update({
                            embeds: embeds.length > 0 ? embeds : [],
                            content: embeds.length > 0 ? null : \`Menu: \${targetView.name}\`,
                            components: components
                        });
                    }
                } else if (menu.action === 'filter') {
                    // Filter content based on selection
                    await interaction.reply({ 
                        content: \`Selected filter: \${selectedValue}\`, 
                        ephemeral: true 
                    });
                }
                break;
            }
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
`;

    return {
      python: pythonCode,
      javascript: javascriptCode,
      json: JSON.stringify(views, null, 2)
    };
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

  const renderPreview = () => {
    return (
      <Card className="bg-slate-800 text-white overflow-hidden">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Discord Preview: {activeView.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeView.embeds.map((embed, index) => (
            <div 
              key={embed.id}
              className="mb-4 rounded border-l-4 p-4 relative"
              style={{ borderLeftColor: embed.color, backgroundColor: '#2f3136' }}
            >
              <h3 className="text-xl font-semibold">{embed.title}</h3>
              <p className="mt-2 text-gray-300 whitespace-pre-wrap">{embed.description}</p>
              
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
              
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleEditItem('embed', embed.id)}
                  className="p-1 h-auto"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleDeleteItem('embed', embed.id)}
                  className="p-1 h-auto text-red-500 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {activeView.buttons.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {activeView.buttons.map((button, index) => (
                <div key={button.id} className="relative group">
                  <button className={`px-4 py-2 rounded ${getButtonStyleClass(button.style)}`}>
                    {button.label}
                  </button>
                  <div className="absolute -top-1 -right-1 flex opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleEditItem('button', button.id)}
                      className="p-1 h-auto bg-gray-800 rounded-full"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDeleteItem('button', button.id)}
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
              {activeView.selectMenus.map((menu, index) => (
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
                      onClick={() => handleEditItem('select', menu.id)}
                      className="p-1 h-auto bg-gray-800 rounded-full"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDeleteItem('select', menu.id)}
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

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-8">Discord Menu Designer</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Views</span>
                <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setIsEditMode(false);
                      setCurrentView({ id: '', name: '' });
                    }}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add View
                    </Button>
                  </DialogTrigger>
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
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddView}>
                        {isEditMode ? 'Update' : 'Add'} View
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                {views.map((view) => (
                  <div 
                    key={view.id}
                    className={`p-2 rounded-md flex justify-between items-center cursor-pointer ${
                      activeViewId === view.id ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setActiveViewId(view.id)}
                  >
                    <span>{view.name}</span>
                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditItem('view', view.id);
                        }}
                        className="p-1 h-auto"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem('view', view.id);
                        }}
                        className="p-1 h-auto text-red-500 hover:text-red-400"
                        disabled={views.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Active View: {activeView.name}</span>
                <Button onClick={() => setShowCodeDialog(true)}>
                  <Save className="mr-2 h-4 w-4" />
                  Export Code
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-3">
                <Dialog open={showEmbedDialog} onOpenChange={setShowEmbedDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setIsEditMode(false);
                      setCurrentEmbed({
                        id: '',
                        title: '',
                        description: '',
                        color: '#5865F2',
                        fields: []
                      });
                    }}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Embed
                    </Button>
                  </DialogTrigger>
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
                        <Label htmlFor="description">Description</Label>
                        <Input 
                          id="description" 
                          value={currentEmbed.description} 
                          onChange={(e) => setCurrentEmbed({...currentEmbed, description: e.target.value})}
                          placeholder="Description text..."
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
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Field
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
                
                <Dialog open={showButtonDialog} onOpenChange={setShowButtonDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setIsEditMode(false);
                      setCurrentButton({
                        id: '',
                        label: '',
                        style: 'primary',
                        action: 'navigate',
                        targetViewId: ''
                      });
                    }}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Button
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
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
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddButton}>
                        {isEditMode ? 'Update' : 'Add'} Button
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={showSelectMenuDialog} onOpenChange={setShowSelectMenuDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setIsEditMode(false);
                      setCurrentSelectMenu({
                        id: '',
                        placeholder: '',
                        options: [],
                        action: 'navigate'
                      });
                    }}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Select Menu
                    </Button>
                  </DialogTrigger>
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
                      <div className="border rounded-md p-3">
                        <h3 className="font-medium mb-2">Options</h3>
                        {currentSelectMenu.options.length > 0 && (
                          <div className="mb-4 space-y-3">
                            {currentSelectMenu.options.map((option, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded">
                                <div>
                                  <p className="font-medium">{option.label}</p>
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
                          <Button onClick={handleAddOption}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Option
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
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Design Preview</h2>
              {renderPreview()}
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Interactive Demo</h2>
              <InteractiveDiscordPreview views={views} initialViewId={activeViewId} />
            </div>
          </div>
          
          <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Generated Code</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex justify-between">
                  <h3 className="font-semibold">Menu Configuration (JSON)</h3>
                  <Button onClick={() => navigator.clipboard.writeText(generateDiscordCode().json)} size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy JSON
                  </Button>
                </div>
                <pre className="bg-slate-800 text-gray-100 p-4 rounded-md overflow-auto max-h-40">
                  {generateDiscordCode().json}
                </pre>
                
                <div className="flex justify-between">
                  <h3 className="font-semibold">JavaScript Implementation (Discord.js)</h3>
                  <Button onClick={() => navigator.clipboard.writeText(generateDiscordCode().javascript)} size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy JavaScript
                  </Button>
                </div>
                <pre className="bg-slate-800 text-gray-100 p-4 rounded-md overflow-auto max-h-60">
                  {generateDiscordCode().javascript}
                </pre>
                
                <div className="flex justify-between">
                  <h3 className="font-semibold">Python Implementation (discord.py)</h3>
                  <Button onClick={() => navigator.clipboard.writeText(generateDiscordCode().python)} size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Python
                  </Button>
                </div>
                <pre className="bg-slate-800 text-gray-100 p-4 rounded-md overflow-auto max-h-60">
                  {generateDiscordCode().python}
                </pre>
                
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Instructions to Run</h3>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                    <p className="font-medium">For Python (discord.py):</p>
                    <ol className="list-decimal pl-5 mt-2 space-y-2 text-sm">
                      <li>Create a file named <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">bot.py</code> and paste the Python code.</li>
                      <li>Create a <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.env</code> file with your Discord bot token: <br/>
                        <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">DISCORD_TOKEN=your_token_here</code>
                      </li>
                      <li>Install required packages: <br/>
                        <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">pip install discord.py python-dotenv</code>
                      </li>
                      <li>Run the bot: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">python bot.py</code></li>
                    </ol>
                    
                    <p className="font-medium mt-4">For JavaScript (Discord.js):</p>
                    <ol className="list-decimal pl-5 mt-2 space-y-2 text-sm">
                      <li>Create a file named <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">bot.js</code> and paste the JavaScript code.</li>
                      <li>Create a <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.env</code> file with your Discord bot token: <br/>
                        <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">DISCORD_TOKEN=your_token_here</code>
                      </li>
                      <li>Initialize npm and install required packages: <br/>
                        <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">npm init -y<br/>npm install discord.js dotenv</code>
                      </li>
                      <li>Run the bot: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">node bot.js</code></li>
                    </ol>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Index;
