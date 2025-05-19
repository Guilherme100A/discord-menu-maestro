import React, { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import InteractiveDiscordPreview from '@/components/InteractiveDiscordPreview';
import ViewSelector from '@/components/discord/ViewSelector';
import ActionButtons from '@/components/discord/ActionButtons';
import DiscordPreview from '@/components/discord/DiscordPreview';
import CodeDialog from '@/components/discord/CodeDialog';
import ViewDialog from '@/components/discord/dialogs/ViewDialog';
import EmbedDialog from '@/components/discord/dialogs/EmbedDialog';
import ButtonDialog from '@/components/discord/dialogs/ButtonDialog';
import SelectMenuDialog from '@/components/discord/dialogs/SelectMenuDialog';
import { DiscordEmbed, DiscordButton, DiscordSelectMenu, DiscordView } from '@/components/discord/DiscordTypes';
import { generateId } from '@/components/discord/utils';

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

  const [currentView, setCurrentView] = useState<{ id: string; name: string; ephemeral?: boolean; timeout?: number }>({
    id: '',
    name: '',
    ephemeral: false,
    timeout: 0
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
        view.id === editItemId ? { 
          ...view, 
          name: currentView.name,
          ephemeral: currentView.ephemeral,
          timeout: currentView.timeout && currentView.timeout > 0 ? currentView.timeout : undefined
        } : view
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
        selectMenus: [],
        ephemeral: currentView.ephemeral,
        timeout: currentView.timeout && currentView.timeout > 0 ? currentView.timeout : undefined
      }]);
      toast({
        title: "Success",
        description: "New view added",
      });
    }
    
    setCurrentView({ id: '', name: '', ephemeral: false, timeout: 0 });
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
          name: viewToEdit.name,
          ephemeral: viewToEdit.ephemeral,
          timeout: viewToEdit.timeout || 0
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

  const handleEditViewSettings = () => {
    // Find the current view to edit
    const viewToEdit = views.find(view => view.id === activeViewId);
    if (viewToEdit) {
      setCurrentView({
        id: viewToEdit.id,
        name: viewToEdit.name,
        ephemeral: viewToEdit.ephemeral,
        timeout: viewToEdit.timeout || 0
      });
      setIsEditMode(true);
      setEditItemId(viewToEdit.id);
      setShowViewDialog(true);
    }
  };

  // Dialog opener handlers
  const handleAddEmbedClick = () => {
    setIsEditMode(false);
    setCurrentEmbed({
      id: '',
      title: '',
      description: '',
      color: '#5865F2',
      fields: []
    });
    setShowEmbedDialog(true);
  };

  const handleAddButtonClick = () => {
    setIsEditMode(false);
    setCurrentButton({
      id: '',
      label: '',
      style: 'primary',
      action: 'navigate',
      targetViewId: ''
    });
    setShowButtonDialog(true);
  };

  const handleAddSelectMenuClick = () => {
    setIsEditMode(false);
    setCurrentSelectMenu({
      id: '',
      placeholder: '',
      options: [],
      action: 'navigate'
    });
    setShowSelectMenuDialog(true);
  };

  const handleAddViewClick = () => {
    setIsEditMode(false);
    setCurrentView({ id: '', name: '', ephemeral: false, timeout: 0 });
    setShowViewDialog(true);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-8">Discord Menu Designer</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ViewSelector 
            views={views}
            activeViewId={activeViewId}
            setActiveViewId={setActiveViewId}
            onAddViewClick={handleAddViewClick}
            onEditView={(id) => handleEditItem('view', id)}
            onDeleteView={(id) => handleDeleteItem('view', id)}
          />
          
          <ActionButtons 
            activeView={activeView}
            onAddEmbedClick={handleAddEmbedClick}
            onAddButtonClick={handleAddButtonClick}
            onAddSelectMenuClick={handleAddSelectMenuClick}
            onShowCodeClick={() => setShowCodeDialog(true)}
            onEditViewSettingsClick={handleEditViewSettings}
          />
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Design Preview</h2>
              <DiscordPreview 
                activeView={activeView}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
              />
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Interactive Demo</h2>
              <InteractiveDiscordPreview views={views} initialViewId={activeViewId} />
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ViewDialog 
        showViewDialog={showViewDialog}
        setShowViewDialog={setShowViewDialog}
        currentView={currentView}
        setCurrentView={setCurrentView}
        isEditMode={isEditMode}
        handleAddView={handleAddView}
      />
      
      <EmbedDialog 
        showEmbedDialog={showEmbedDialog}
        setShowEmbedDialog={setShowEmbedDialog}
        currentEmbed={currentEmbed}
        setCurrentEmbed={setCurrentEmbed}
        currentField={currentField}
        setCurrentField={setCurrentField}
        handleAddEmbed={handleAddEmbed}
        handleAddField={handleAddField}
        handleRemoveField={handleRemoveField}
        isEditMode={isEditMode}
      />
      
      <ButtonDialog 
        showButtonDialog={showButtonDialog}
        setShowButtonDialog={setShowButtonDialog}
        currentButton={currentButton}
        setCurrentButton={setCurrentButton}
        handleAddButton={handleAddButton}
        views={views}
        isEditMode={isEditMode}
      />
      
      <SelectMenuDialog 
        showSelectMenuDialog={showSelectMenuDialog}
        setShowSelectMenuDialog={setShowSelectMenuDialog}
        currentSelectMenu={currentSelectMenu}
        setCurrentSelectMenu={setCurrentSelectMenu}
        currentOption={currentOption}
        setCurrentOption={setCurrentOption}
        handleAddSelectMenu={handleAddSelectMenu}
        handleAddOption={handleAddOption}
        handleRemoveOption={handleRemoveOption}
        views={views}
        isEditMode={isEditMode}
      />
      
      <CodeDialog 
        views={views}
        showCodeDialog={showCodeDialog}
        setShowCodeDialog={setShowCodeDialog}
      />
    </div>
  );
};

export default Index;
