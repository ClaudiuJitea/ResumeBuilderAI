import React, { useState } from 'react';
import { 
  ArrowRight, 
  Undo2, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  GripVertical,
  Globe,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Link
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

interface SocialLink {
  id: string;
  name: string;
  url: string;
  platform: 'website' | 'linkedin' | 'github' | 'twitter' | 'instagram' | 'facebook' | 'youtube' | 'other';
}

const LinksForm = () => {
  const { state, dispatch } = useResume();
  const { links } = state.resumeData;
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Convert existing links format to SocialLink objects
  const linkObjects: SocialLink[] = links.map((link, index) => {
    if (typeof link === 'object' && 'name' in link && 'url' in link) {
      return {
        id: `link-${index}`,
        name: link.name,
        url: link.url,
        platform: detectPlatform(link.url)
      };
    }
    return {
      id: `link-${index}`,
      name: '',
      url: '',
      platform: 'other'
    };
  });

  const platforms = [
    { id: 'website', name: 'Website', icon: Globe, placeholder: 'https://yourwebsite.com' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
    { id: 'github', name: 'GitHub', icon: Github, placeholder: 'https://github.com/username' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/username' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/username' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/username' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/channel/...' },
    { id: 'other', name: 'Other', icon: Link, placeholder: 'https://example.com' }
  ];

  function detectPlatform(url: string): SocialLink['platform'] {
    if (url.includes('linkedin.com')) return 'linkedin';
    if (url.includes('github.com')) return 'github';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('facebook.com')) return 'facebook';
    if (url.includes('youtube.com')) return 'youtube';
    if (url.includes('http')) return 'website';
    return 'other';
  }

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedEntries(newExpanded);
  };

  const addNewEntry = (platform: SocialLink['platform'] = 'other') => {
    const platformInfo = platforms.find(p => p.id === platform);
    const newEntry: SocialLink = {
      id: Date.now().toString(),
      name: platformInfo?.name || 'Link',
      url: '',
      platform: platform
    };

    const updatedLinks = [...linkObjects, newEntry];
    // Convert back to the expected format
    const formattedLinks = updatedLinks.map(link => ({ name: link.name, url: link.url }));
    
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { links: formattedLinks }
    });

    // Auto-expand the new entry
    setExpandedEntries(prev => new Set([...prev, newEntry.id]));
  };

  const updateEntry = (id: string, field: keyof SocialLink, value: string) => {
    const updatedLinks = linkObjects.map(link => {
      if (link.id === id) {
        const updated = { ...link, [field]: value };
        // Auto-detect platform when URL changes
        if (field === 'url') {
          updated.platform = detectPlatform(value);
          // Auto-update name based on platform
          const platformInfo = platforms.find(p => p.id === updated.platform);
          if (platformInfo && (!updated.name || updated.name === 'Link')) {
            updated.name = platformInfo.name;
          }
        }
        return updated;
      }
      return link;
    });
    
    // Convert back to the expected format
    const formattedLinks = updatedLinks.map(link => ({ name: link.name, url: link.url }));
    
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { links: formattedLinks }
    });
  };

  const deleteEntry = (id: string) => {
    const updatedLinks = linkObjects.filter(link => link.id !== id);
    // Convert back to the expected format
    const formattedLinks = updatedLinks.map(link => ({ name: link.name, url: link.url }));
    
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { links: formattedLinks }
    });
    
    // Remove from expanded set
    const newExpanded = new Set(expandedEntries);
    newExpanded.delete(id);
    setExpandedEntries(newExpanded);
  };

  const confirmEntry = (id: string) => {
    // Collapse the entry after confirming
    const newExpanded = new Set(expandedEntries);
    newExpanded.delete(id);
    setExpandedEntries(newExpanded);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = linkObjects.findIndex(link => link.id === draggedItem);
    const targetIndex = linkObjects.findIndex(link => link.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newLinks = [...linkObjects];
    const [draggedEntry] = newLinks.splice(draggedIndex, 1);
    newLinks.splice(targetIndex, 0, draggedEntry);

    // Convert back to the expected format
    const formattedLinks = newLinks.map(link => ({ name: link.name, url: link.url }));
    
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { links: formattedLinks }
    });

    setDraggedItem(null);
  };

  const getPlatformIcon = (platform: string) => {
    const platformObj = platforms.find(p => p.id === platform);
    return platformObj ? platformObj.icon : Link;
  };

  const handleNext = () => {
    const currentIndex = state.availableBuildSteps.findIndex(step => step === state.builderStep);
    const nextStep = state.availableBuildSteps[currentIndex + 1];
    if (nextStep) {
      dispatch({ type: 'SET_BUILDER_STEP', payload: nextStep });
    }
  };

  const handleUndo = () => {
    const currentIndex = state.availableBuildSteps.findIndex(step => step === state.builderStep);
    const prevStep = state.availableBuildSteps[currentIndex - 1];
    if (prevStep) {
      dispatch({ type: 'SET_BUILDER_STEP', payload: prevStep });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Info Box */}
      <div className="bg-accent text-background p-4 rounded-lg mb-8 relative">
        <h3 className="font-bold text-sm mb-2">LINKS & SOCIAL PROFILES</h3>
        <p className="text-sm">
          Add your professional social media profiles, portfolio website, and other relevant links to showcase your online presence.
        </p>
        
        {/* Character Illustration */}
        <div className="absolute -right-2 -top-2">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center">
            <Globe className="text-accent w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="mb-6">
        <h4 className="text-primaryText font-medium mb-4">Quick Add Popular Platforms</h4>
        <div className="grid grid-cols-2 gap-3">
          {platforms.slice(0, 6).map((platform) => {
            const IconComponent = platform.icon;
            return (
              <button
                key={platform.id}
                onClick={() => addNewEntry(platform.id as SocialLink['platform'])}
                className="flex items-center space-x-2 px-3 py-2 bg-card border border-border text-primaryText hover:border-accent hover:text-accent rounded-lg transition-all duration-200 hover:scale-105"
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{platform.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Link Entries */}
      <div className="space-y-4 mb-6">
        {linkObjects.map((entry, index) => {
          const isExpanded = expandedEntries.has(entry.id);
          const PlatformIcon = getPlatformIcon(entry.platform);
          
          return (
            <div
              key={entry.id}
              className={`bg-card border-2 rounded-lg transition-all duration-200 ${
                draggedItem === entry.id ? 'opacity-50' : ''
              } ${isExpanded ? 'border-accent' : 'border-border'}`}
              draggable
              onDragStart={(e) => handleDragStart(e, entry.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, entry.id)}
            >
              {/* Entry Header */}
              <div 
                className="p-4 cursor-pointer flex items-center justify-between hover:bg-background/50 transition-colors"
                onClick={() => toggleExpanded(entry.id)}
              >
                <div className="flex items-center space-x-3">
                  <GripVertical className="w-5 h-5 text-primaryText/50 cursor-grab" />
                  <PlatformIcon className="w-5 h-5 text-accent" />
                  <div>
                    <div className="text-primaryText font-medium">
                      {entry.name || `Link ${index + 1}`}
                    </div>
                    <div className="text-primaryText/60 text-sm">
                      {isExpanded ? 'Collapse to hide details' : 'Expand to add details'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!isExpanded && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEntry(entry.id);
                      }}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-primaryText" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-primaryText" />
                  )}
                </div>
              </div>

              {/* Expanded Form */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border">
                  <div className="space-y-4 pt-4">
                    {/* Platform Selection */}
                    <div>
                      <label className="block text-primaryText text-sm font-medium mb-2">
                        Platform
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {platforms.map((platform) => {
                          const IconComponent = platform.icon;
                          return (
                            <button
                              key={platform.id}
                              onClick={() => updateEntry(entry.id, 'platform', platform.id)}
                              className={`p-2 rounded-lg border-2 transition-all duration-200 text-center ${
                                entry.platform === platform.id
                                  ? 'border-accent bg-accent/10 text-accent'
                                  : 'border-border text-primaryText hover:border-accent/50'
                              }`}
                            >
                              <IconComponent className="w-4 h-4 mx-auto mb-1" />
                              <div className="text-xs font-medium">{platform.name}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Display Name */}
                    <div>
                      <label className="block text-primaryText text-sm font-medium mb-2">
                        Display Name <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        value={entry.name}
                        onChange={(e) => updateEntry(entry.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="LinkedIn Profile"
                      />
                    </div>

                    {/* URL */}
                    <div>
                      <label className="block text-primaryText text-sm font-medium mb-2">
                        URL <span className="text-accent">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={entry.url}
                          onChange={(e) => updateEntry(entry.id, 'url', e.target.value)}
                          className="w-full px-3 py-2 pr-10 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                          placeholder={platforms.find(p => p.id === entry.platform)?.placeholder || 'https://example.com'}
                        />
                        <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primaryText/50" />
                      </div>
                    </div>

                    {/* Confirm Button */}
                    <button
                      onClick={() => confirmEntry(entry.id)}
                      className="w-full bg-accent hover:bg-accent/90 text-background py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                    >
                      CONFIRM
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="w-full bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-background py-2 rounded-lg font-semibold transition-all duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add Another Entry Button */}
        <button
          onClick={() => addNewEntry()}
          className="w-full border-2 border-dashed border-border hover:border-accent text-primaryText hover:text-accent py-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 group"
        >
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Add another link</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleNext}
          className="w-full bg-accent hover:bg-accent/90 text-background py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
        >
          <span>NEXT</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        
        <button
          onClick={handleUndo}
          className="w-full bg-card border border-border hover:border-accent text-primaryText py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
        >
          <Undo2 className="w-5 h-5" />
          <span>UNDO</span>
        </button>
      </div>
    </div>
  );
};

export default LinksForm;