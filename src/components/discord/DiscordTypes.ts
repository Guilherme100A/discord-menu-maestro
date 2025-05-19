

export interface DiscordEmbed {
  id: string;
  title: string;
  description: string;
  color: string;
  fields: { name: string; value: string; inline: boolean }[];
  url?: string;
  timestamp?: string;
  author?: { name: string; url?: string; iconUrl?: string };
  footer?: { text: string; iconUrl?: string };
  thumbnail?: string;
  image?: string;
}

export interface DiscordButton {
  id: string;
  label: string;
  style: 'primary' | 'secondary' | 'success' | 'danger';
  action: 'navigate' | 'custom' | 'ticket';
  targetViewId?: string;
  customCode?: string;
  url?: string;
  emoji?: string;
  disabled?: boolean;
  ticketCategoryId?: string;
}

export interface DiscordSelectMenu {
  id: string;
  placeholder: string;
  options: { label: string; value: string; description?: string; emoji?: string; default?: boolean }[];
  action: 'filter' | 'navigate';
  targetViewId?: string;
  minValues?: number;
  maxValues?: number;
  disabled?: boolean;
}

export interface DiscordView {
  id: string;
  name: string;
  embeds: DiscordEmbed[];
  buttons: DiscordButton[];
  selectMenus: DiscordSelectMenu[];
  ephemeral?: boolean;
  timeout?: number;
}

