import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Undo2, 
  Plus, 
  X, 
  GripVertical,
  Languages as LanguagesIcon,
  ChevronDown,
  Circle
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { Skill } from '../../types/resume';

const LanguagesForm = () => {
  const { state, dispatch } = useResume();
  const { languages, languagesConfig } = state.resumeData;
  const [newLanguageName, setNewLanguageName] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('A1');
  const [languageStyle, setLanguageStyle] = useState<'dots' | 'pills' | 'bars'>(languagesConfig?.style || 'dots');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);

  // Sync local state with resume data
  useEffect(() => {
    if (languagesConfig?.style && languagesConfig.style !== languageStyle) {
      setLanguageStyle(languagesConfig.style);
    }
  }, [languagesConfig?.style]);

  const popularLanguages = [
    'English', 'German', 'Polish', 'Spanish', 'French', 'Italian', 
    'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic'
  ];

  const languageLevels = [
    { id: 'A1', name: 'A1 - Beginner', value: 1 },
    { id: 'A2', name: 'A2 - Elementary', value: 2 },
    { id: 'B1', name: 'B1 - Intermediate', value: 3 },
    { id: 'B2', name: 'B2 - Upper Intermediate', value: 4 },
    { id: 'C1', name: 'C1 - Advanced', value: 5 },
    { id: 'C2', name: 'C2 - Proficient', value: 6 },
    { id: 'native', name: 'Native', value: 7 }
  ];

  const addLanguageFromSuggestion = (languageName: string) => {
    if (!languages.find(lang => lang.name.toLowerCase() === languageName.toLowerCase())) {
      const newLanguage: Skill = {
        id: Date.now().toString(),
        name: languageName,
        level: 3 // Default to B1 level
      };

      const updatedLanguages = [...languages, newLanguage];
      dispatch({
        type: 'UPDATE_RESUME_DATA',
        payload: { languages: updatedLanguages }
      });
    }
  };

  const addCustomLanguage = () => {
    if (newLanguageName.trim() && !languages.find(lang => lang.name.toLowerCase() === newLanguageName.toLowerCase())) {
      const levelValue = languageLevels.find(level => level.id === selectedLevel)?.value || 1;
      const newLanguage: Skill = {
        id: Date.now().toString(),
        name: newLanguageName,
        level: levelValue
      };

      const updatedLanguages = [...languages, newLanguage];
      dispatch({
        type: 'UPDATE_RESUME_DATA',
        payload: { languages: updatedLanguages }
      });

      setNewLanguageName('');
      setSelectedLevel('A1');
    }
  };

  const removeLanguage = (id: string) => {
    const updatedLanguages = languages.filter(lang => lang.id !== id);
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { languages: updatedLanguages }
    });
  };

  const updateLanguageLevel = (id: string, levelId: string) => {
    const levelValue = languageLevels.find(level => level.id === levelId)?.value || 1;
    const updatedLanguages = languages.map(lang =>
      lang.id === id ? { ...lang, level: levelValue } : lang
    );
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { languages: updatedLanguages }
    });
  };

  const updateLanguagesConfig = (config: Partial<{ style: 'dots' | 'pills' | 'bars' }>) => {
    const currentConfig = languagesConfig || { style: 'dots' as const };
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { 
        languagesConfig: { 
          ...currentConfig, 
          ...config 
        } 
      }
    });
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
    
    if (draggedItem && draggedItem !== targetId) {
      const draggedIndex = languages.findIndex(lang => lang.id === draggedItem);
      const targetIndex = languages.findIndex(lang => lang.id === targetId);
      
      const newLanguages = [...languages];
      const [draggedLanguage] = newLanguages.splice(draggedIndex, 1);
      newLanguages.splice(targetIndex, 0, draggedLanguage);
      
      dispatch({
        type: 'UPDATE_RESUME_DATA',
        payload: { languages: newLanguages }
      });
    }
    
    setDraggedItem(null);
  };

  const getLevelDisplayName = (level: number) => {
    const levelObj = languageLevels.find(l => l.value === level);
    return levelObj ? levelObj.id : 'A1';
  };

  const renderLanguageLevel = (level: number, style: string) => {
    const maxLevel = 7; // Native level

    switch (style) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((dot) => (
              <Circle
                key={dot}
                className={`w-2 h-2 ${
                  dot <= Math.round((level / maxLevel) * 5) ? 'fill-accent text-accent' : 'text-border'
                }`}
              />
            ))}
          </div>
        );
      case 'pills':
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((pill) => (
              <div
                key={pill}
                className={`w-3 h-1.5 rounded-full ${
                  pill <= Math.round((level / maxLevel) * 5) ? 'bg-accent' : 'bg-border'
                }`}
              />
            ))}
          </div>
        );
      case 'bars':
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((bar) => (
              <div
                key={bar}
                className={`w-1.5 h-3 rounded-sm ${
                  bar <= Math.round((level / maxLevel) * 5) ? 'bg-accent' : 'bg-border'
                }`}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
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
        <h3 className="font-bold text-sm mb-2">LANGUAGES</h3>
        <p className="text-sm">
          Enter or select a language from popular suggestions, then add the level (A1 - beginner, B2 - intermediate, C1 - advanced).
        </p>
        
        {/* Character Illustration */}
        <div className="absolute -right-2 -top-2">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center">
            <LanguagesIcon className="text-accent w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Popular Suggestions */}
      <div className="mb-6">
        <h4 className="text-primaryText font-medium mb-4">Popular Suggestions</h4>
        <div className="flex flex-wrap gap-2">
          {popularLanguages.map((language) => (
            <button
              key={language}
              onClick={() => addLanguageFromSuggestion(language)}
              disabled={languages.some(lang => lang.name.toLowerCase() === language.toLowerCase())}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                languages.some(lang => lang.name.toLowerCase() === language.toLowerCase())
                  ? 'bg-border text-primaryText/50 cursor-not-allowed'
                  : 'bg-card border border-border text-primaryText hover:border-accent hover:text-accent hover:scale-105'
              }`}
            >
              <Plus className="w-3 h-3" />
              <span>{language}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Languages */}
      {languages.length > 0 && (
        <div className="mb-6">
          <h4 className="text-primaryText font-medium mb-4">Your Languages</h4>
          <div className="space-y-3">
            {languages.map((language) => (
              <div
                key={language.id}
                className={`bg-card border border-border rounded-lg p-3 transition-all duration-200 ${
                  draggedItem === language.id ? 'opacity-50' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, language.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, language.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <GripVertical className="w-4 h-4 text-primaryText/50 cursor-grab" />
                    <span className="text-primaryText font-medium">{language.name}</span>
                  </div>
                  <button
                    onClick={() => removeLanguage(language.id)}
                    className="text-red-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Level Selector */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {languageLevels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => updateLanguageLevel(language.id, level.id)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          language.level === level.value
                            ? 'bg-accent text-background'
                            : 'bg-background border border-border text-primaryText hover:border-accent/50'
                        }`}
                      >
                        {level.id}
                      </button>
                    ))}
                  </div>
                  <div className="ml-4">
                    {renderLanguageLevel(language.level, languageStyle)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Language */}
      <div className="mb-6">
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="col-span-2">
            <label className="block text-primaryText text-sm font-medium mb-2">
              Language
            </label>
            <input
              type="text"
              value={newLanguageName}
              onChange={(e) => setNewLanguageName(e.target.value)}
              placeholder="Enter language"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-primaryText text-sm font-medium mb-2">
              Level
            </label>
            <div className="relative">
              <button
                onClick={() => setShowLevelDropdown(!showLevelDropdown)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent flex items-center justify-between"
              >
                <span>{selectedLevel}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showLevelDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto scrollbar-thin scrollbar-track-background scrollbar-thumb-accent/30 hover:scrollbar-thumb-accent/50">
                  {languageLevels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => {
                        setSelectedLevel(level.id);
                        setShowLevelDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left text-primaryText hover:bg-background transition-colors text-sm"
                    >
                      {level.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <button
          onClick={addCustomLanguage}
          disabled={!newLanguageName.trim() || languages.some(lang => lang.name.toLowerCase() === newLanguageName.toLowerCase())}
          className={`w-full py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            newLanguageName.trim() && !languages.some(lang => lang.name.toLowerCase() === newLanguageName.toLowerCase())
              ? 'bg-accent hover:bg-accent/90 text-background hover:scale-105'
              : 'bg-border text-primaryText/50 cursor-not-allowed'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Style Settings */}
      <div className="mb-8">
        <h4 className="text-primaryText font-medium mb-3">Styles</h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center">
              <input
                type="radio"
                name="style"
                value="dots"
                checked={languageStyle === 'dots'}
                onChange={(e) => {
                  const style = e.target.value as 'dots' | 'pills' | 'bars';
                  setLanguageStyle(style);
                  updateLanguagesConfig({ style });
                }}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                languageStyle === 'dots' 
                  ? 'border-accent bg-accent' 
                  : 'border-border'
              }`}>
                {languageStyle === 'dots' && <div className="w-2 h-2 bg-background rounded-full m-0.5" />}
              </div>
              <span className="text-primaryText text-sm">Dots</span>
            </div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((dot) => (
                <Circle
                  key={dot}
                  className={`w-2 h-2 ${
                    dot <= 3 ? 'fill-accent text-accent' : 'text-border'
                  }`}
                />
              ))}
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center">
              <input
                type="radio"
                name="style"
                value="pills"
                checked={languageStyle === 'pills'}
                onChange={(e) => {
                  const style = e.target.value as 'dots' | 'pills' | 'bars';
                  setLanguageStyle(style);
                  updateLanguagesConfig({ style });
                }}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                languageStyle === 'pills' 
                  ? 'border-accent bg-accent' 
                  : 'border-border'
              }`}>
                {languageStyle === 'pills' && <div className="w-2 h-2 bg-background rounded-full m-0.5" />}
              </div>
              <span className="text-primaryText text-sm">Pills</span>
            </div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((pill) => (
                <div
                  key={pill}
                  className={`w-3 h-1.5 rounded-full ${
                    pill <= 3 ? 'bg-accent' : 'bg-border'
                  }`}
                />
              ))}
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center">
              <input
                type="radio"
                name="style"
                value="bars"
                checked={languageStyle === 'bars'}
                onChange={(e) => {
                  const style = e.target.value as 'dots' | 'pills' | 'bars';
                  setLanguageStyle(style);
                  updateLanguagesConfig({ style });
                }}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                languageStyle === 'bars' 
                  ? 'border-accent bg-accent' 
                  : 'border-border'
              }`}>
                {languageStyle === 'bars' && <div className="w-2 h-2 bg-background rounded-full m-0.5" />}
              </div>
              <span className="text-primaryText text-sm">Bars</span>
            </div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((bar) => (
                <div
                  key={bar}
                  className={`w-1.5 h-3 rounded-sm ${
                    bar <= 3 ? 'bg-accent' : 'bg-border'
                  }`}
                />
              ))}
            </div>
          </label>
        </div>
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

export default LanguagesForm;