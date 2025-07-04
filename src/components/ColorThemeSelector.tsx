import React, { useState } from 'react';
import { Palette, Check, Plus, X } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { predefinedThemes, createCustomTheme } from '../utils/colorThemes';
import { ColorTheme } from '../types/resume';

interface ColorThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const ColorThemeSelector: React.FC<ColorThemeSelectorProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useResume();
  const [customColor, setCustomColor] = useState('#3B82F6');
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const currentTheme = state.resumeData.colorTheme;

  const handleThemeSelect = (theme: ColorTheme) => {
    dispatch({ type: 'SET_COLOR_THEME', payload: theme });
  };

  const handleCustomColorApply = () => {
    const customTheme = createCustomTheme(customColor);
    handleThemeSelect(customTheme);
    setShowCustomPicker(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-track-background scrollbar-thumb-accent/30 hover:scrollbar-thumb-accent/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <Palette className="w-5 h-5 text-background" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primaryText">Choose Your Color Theme</h2>
              <p className="text-primaryText/60 text-sm">Customize your resume's color scheme</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-primaryText/60 hover:text-primaryText transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Current Theme Preview */}
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-primaryText mb-4">Current Theme</h3>
          <div className="bg-background rounded-lg p-4 border border-border">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                  style={{ backgroundColor: currentTheme?.primary }}
                />
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                  style={{ backgroundColor: currentTheme?.secondary }}
                />
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                  style={{ backgroundColor: currentTheme?.accent }}
                />
              </div>
              <div>
                <div className="text-primaryText font-medium">{currentTheme?.name}</div>
                <div className="text-primaryText/60 text-sm">Primary: {currentTheme?.primary}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Predefined Themes */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-primaryText mb-4">Predefined Themes</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {predefinedThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme)}
                className={`relative bg-background border-2 rounded-lg p-4 transition-all duration-200 hover:scale-105 ${
                  currentTheme?.id === theme.id 
                    ? 'border-accent shadow-lg shadow-accent/20' 
                    : 'border-border hover:border-accent/50'
                }`}
              >
                {/* Color Preview */}
                <div className="flex justify-center space-x-1 mb-3">
                  <div 
                    className="w-6 h-6 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: theme.secondary }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: theme.accent }}
                  />
                </div>
                
                {/* Theme Name */}
                <div className="text-primaryText font-medium text-sm text-center">
                  {theme.name}
                </div>

                {/* Selected Indicator */}
                {currentTheme?.id === theme.id && (
                  <div className="absolute -top-2 -right-2 bg-accent rounded-full p-1">
                    <Check className="w-4 h-4 text-background" />
                  </div>
                )}

                {/* Gradient Preview Bar */}
                <div 
                  className="w-full h-2 rounded-full mt-2"
                  style={{
                    background: `linear-gradient(90deg, ${theme.gradient?.from || theme.primary}, ${theme.gradient?.to || theme.secondary})`
                  }}
                />
              </button>
            ))}
          </div>

          {/* Custom Color Section */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-primaryText mb-4">Custom Color</h3>
            
            {!showCustomPicker ? (
              <button
                onClick={() => setShowCustomPicker(true)}
                className="w-full bg-background border-2 border-dashed border-border hover:border-accent rounded-lg p-6 transition-all duration-200 hover:scale-105 flex flex-col items-center space-y-3"
              >
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <Plus className="w-6 h-6 text-accent" />
                </div>
                <div className="text-primaryText font-medium">Create Custom Theme</div>
                <div className="text-primaryText/60 text-sm">Choose your own color</div>
              </button>
            ) : (
              <div className="bg-background border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-primaryText font-medium">Custom Color Picker</h4>
                  <button
                    onClick={() => setShowCustomPicker(false)}
                    className="text-primaryText/60 hover:text-primaryText transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Color Input */}
                  <div>
                    <label className="block text-primaryText text-sm font-medium mb-2">
                      Choose Primary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="w-12 h-12 rounded-lg border border-border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  <div>
                    <label className="block text-primaryText text-sm font-medium mb-2">
                      Preview
                    </label>
                    <div className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex space-x-2">
                          <div 
                            className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                            style={{ backgroundColor: customColor }}
                          />
                          <div 
                            className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                            style={{ backgroundColor: createCustomTheme(customColor).secondary }}
                          />
                          <div 
                            className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                            style={{ backgroundColor: createCustomTheme(customColor).accent }}
                          />
                        </div>
                        <div>
                          <div className="text-primaryText font-medium">Custom Theme</div>
                          <div className="text-primaryText/60 text-sm">Primary: {customColor}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={handleCustomColorApply}
                    className="w-full bg-accent hover:bg-accent/90 text-background py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>Apply Custom Theme</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-background/50">
          <div className="flex items-center justify-between">
            <div className="text-primaryText/60 text-sm">
              Changes will be applied to your resume immediately
            </div>
            <button
              onClick={onClose}
              className="bg-accent hover:bg-accent/90 text-background px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorThemeSelector;