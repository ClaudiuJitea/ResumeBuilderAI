import React, { useState } from 'react';
import { 
  ArrowRight, 
  Undo2, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  GripVertical,
  Trophy,
  Calendar,
  Award,
  Star
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  organization?: string;
  category: 'award' | 'recognition' | 'accomplishment' | 'milestone';
}

const AchievementsForm = () => {
  const { state, dispatch } = useResume();
  const { achievements } = state.resumeData;
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Convert string array to Achievement objects for backward compatibility
  const achievementObjects: Achievement[] = achievements.map((achievement, index) => {
    if (typeof achievement === 'string') {
      return {
        id: `achievement-${index}`,
        title: achievement,
        description: '',
        date: '',
        category: 'accomplishment'
      };
    }
    return achievement as Achievement;
  });

  const categories = [
    { id: 'award', name: 'Award', icon: Trophy },
    { id: 'recognition', name: 'Recognition', icon: Star },
    { id: 'accomplishment', name: 'Accomplishment', icon: Award },
    { id: 'milestone', name: 'Milestone', icon: Calendar }
  ];

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedEntries(newExpanded);
  };

  const addNewEntry = () => {
    const newEntry: Achievement = {
      id: Date.now().toString(),
      title: '',
      description: '',
      date: '',
      organization: '',
      category: 'accomplishment'
    };

    const updatedAchievements = [...achievementObjects, newEntry];
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { achievements: updatedAchievements }
    });

    // Auto-expand the new entry
    setExpandedEntries(prev => new Set([...prev, newEntry.id]));
  };

  const updateEntry = (id: string, field: keyof Achievement, value: string) => {
    const updatedAchievements = achievementObjects.map(achievement =>
      achievement.id === id ? { ...achievement, [field]: value } : achievement
    );
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { achievements: updatedAchievements }
    });
  };

  const deleteEntry = (id: string) => {
    const updatedAchievements = achievementObjects.filter(achievement => achievement.id !== id);
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { achievements: updatedAchievements }
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

    const draggedIndex = achievementObjects.findIndex(achievement => achievement.id === draggedItem);
    const targetIndex = achievementObjects.findIndex(achievement => achievement.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newAchievements = [...achievementObjects];
    const [draggedEntry] = newAchievements.splice(draggedIndex, 1);
    newAchievements.splice(targetIndex, 0, draggedEntry);

    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { achievements: newAchievements }
    });

    setDraggedItem(null);
  };

  const getCategoryIcon = (category: string) => {
    const categoryObj = categories.find(cat => cat.id === category);
    return categoryObj ? categoryObj.icon : Trophy;
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
        <h3 className="font-bold text-sm mb-2">ACHIEVEMENTS & AWARDS</h3>
        <p className="text-sm">
          Highlight your accomplishments, awards, and recognitions that demonstrate your excellence and impact in your field.
        </p>
        
        {/* Character Illustration */}
        <div className="absolute -right-2 -top-2">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center">
            <Trophy className="text-accent w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Achievement Entries */}
      <div className="space-y-4 mb-6">
        {achievementObjects.map((entry, index) => {
          const isExpanded = expandedEntries.has(entry.id);
          const CategoryIcon = getCategoryIcon(entry.category);
          
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
                  <CategoryIcon className="w-5 h-5 text-accent" />
                  <div>
                    <div className="text-primaryText font-medium">
                      {entry.title || `Achievement ${index + 1}`}
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
                    {/* Achievement Title */}
                    <div>
                      <label className="block text-primaryText text-sm font-medium mb-2">
                        Achievement Title <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        value={entry.title}
                        onChange={(e) => updateEntry(entry.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="Employee of the Year"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-primaryText text-sm font-medium mb-2">
                        Category
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => {
                          const IconComponent = category.icon;
                          return (
                            <button
                              key={category.id}
                              onClick={() => updateEntry(entry.id, 'category', category.id)}
                              className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                                entry.category === category.id
                                  ? 'border-accent bg-accent/10 text-accent'
                                  : 'border-border text-primaryText hover:border-accent/50'
                              }`}
                            >
                              <IconComponent className="w-4 h-4 mx-auto mb-1" />
                              <div className="text-xs font-medium">{category.name}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-primaryText text-sm font-medium mb-2">
                        Description <span className="text-accent">*</span>
                      </label>
                      <textarea
                        value={entry.description}
                        onChange={(e) => updateEntry(entry.id, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                        placeholder="Describe your achievement and its impact..."
                      />
                    </div>

                    {/* Date and Organization */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-primaryText text-sm font-medium mb-2">
                          Date <span className="text-accent">*</span>
                        </label>
                        <input
                          type="text"
                          value={entry.date}
                          onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                          placeholder="MM/YYYY"
                        />
                      </div>
                      <div>
                        <label className="block text-primaryText text-sm font-medium mb-2">
                          Organization (optional)
                        </label>
                        <input
                          type="text"
                          value={entry.organization || ''}
                          onChange={(e) => updateEntry(entry.id, 'organization', e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                          placeholder="Company/Institution"
                        />
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
          onClick={addNewEntry}
          className="w-full border-2 border-dashed border-border hover:border-accent text-primaryText hover:text-accent py-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 group"
        >
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Add another achievement</span>
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

export default AchievementsForm;