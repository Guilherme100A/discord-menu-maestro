
import { DiscordView, DiscordButton } from './DiscordTypes';

export const generateId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getButtonStyleClass = (style: string) => {
  switch (style) {
    case 'primary': return 'bg-blue-600 hover:bg-blue-700 text-white';
    case 'secondary': return 'bg-gray-500 hover:bg-gray-600 text-white';
    case 'success': return 'bg-green-600 hover:bg-green-700 text-white';
    case 'danger': return 'bg-red-600 hover:bg-red-700 text-white';
    default: return 'bg-blue-600 hover:bg-blue-700 text-white';
  }
};

export const generateDiscordCode = (views: DiscordView[]) => {
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
                    style=getattr(ButtonStyle, button["style"]),
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
                        .setStyle(button.style)
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
