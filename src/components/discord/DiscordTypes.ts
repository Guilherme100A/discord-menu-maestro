
export interface DiscordEmbed {
  id: string;
  title: string;
  description: string;
  color: string;
  fields: { name: string; value: string; inline: boolean }[];
}

export interface DiscordButton {
  id: string;
  label: string;
  style: 'primary' | 'secondary' | 'success' | 'danger';
  action: 'navigate' | 'custom';
  targetViewId?: string;
  customCode?: string;
}

export interface DiscordSelectMenu {
  id: string;
  placeholder: string;
  options: { label: string; value: string; description?: string }[];
  action: 'filter' | 'navigate';
  targetViewId?: string;
}

export interface DiscordView {
  id: string;
  name: string;
  embeds: DiscordEmbed[];
  buttons: DiscordButton[];
  selectMenus: DiscordSelectMenu[];
}
