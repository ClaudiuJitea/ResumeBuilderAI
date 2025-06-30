import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Search,
  Info,
  Palette
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

const DecoratorForm = () => {
  const { state, dispatch } = useResume();
  const decoratorSettings = state.resumeData.decoratorSettings;
  
  const [selectedFont, setSelectedFont] = useState(decoratorSettings?.selectedFont || 'Roboto');
  const [fontSearch, setFontSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(decoratorSettings?.selectedTemplate || 'Classic');
  const [selectedColorScheme, setSelectedColorScheme] = useState(decoratorSettings?.selectedColorScheme || '#2563eb');
  const [selectedDecorations, setSelectedDecorations] = useState<string[]>(decoratorSettings?.selectedDecorations || []);
  const [gdprContent, setGdprContent] = useState(decoratorSettings?.gdprContent || '');
  const [separatorColor, setSeparatorColor] = useState('#000000');

  const colorSchemes = [
    '#2563eb', '#6366f1', '#6b7280', '#7c2d12', 
    '#2563eb', '#e11d48', '#7c3aed', '#dc2626', 
    '#374151', '#c084fc'
  ];

  const availableDecorations = [
    'Indicator', 'Fog', 'Mist', 'Gray Fullness',
    '3 Circles', 'Setting Planet', 'Separator', 'Beam',
    'Pyramid', 'Dust', 'Business Card', 'Sharp Thread'
  ];

  // Initialize separator color from existing decorations
  useEffect(() => {
    const separatorDecoration = decoratorSettings?.decorations?.find(d => d.type === 'separator');
    if (separatorDecoration?.properties?.color) {
      setSeparatorColor(separatorDecoration.properties.color);
    }
  }, [decoratorSettings?.decorations]);

  const handleSeparatorColorChange = (newColor: string) => {
    setSeparatorColor(newColor);
    
    // Update all separator decorations with the new color
    const separatorDecorations = decoratorSettings?.decorations?.filter(d => d.type === 'separator') || [];
    separatorDecorations.forEach(separator => {
      dispatch({
        type: 'UPDATE_DECORATION',
        payload: {
          id: separator.id,
          updates: {
            properties: {
              ...separator.properties,
              color: newColor
            }
          }
        }
      });
    });
  };

  const handleDecorationToggle = (decoration: string) => {
    const newSelectedDecorations = selectedDecorations.includes(decoration) 
      ? selectedDecorations.filter(d => d !== decoration)
      : [...selectedDecorations, decoration];
    
    setSelectedDecorations(newSelectedDecorations);
    
    // Update the context
    dispatch({
      type: 'UPDATE_DECORATOR_SETTINGS',
      payload: { selectedDecorations: newSelectedDecorations }
    });

    // If it's a separator and we're adding it, create the decoration
    if (decoration === 'Separator' && !selectedDecorations.includes(decoration)) {
      const separatorId = `separator-${Date.now()}`;
      dispatch({
        type: 'ADD_DECORATION',
        payload: {
          id: separatorId,
          type: 'separator',
          position: { x: 50, y: 200 }, // Default position
          size: { width: 200, height: 4 }, // Default size
          properties: {
            color: separatorColor,
            thickness: 4,
            opacity: 1
          }
        }
      });
    }
    
    // If we're removing a separator, remove the decoration
    if (decoration === 'Separator' && selectedDecorations.includes(decoration)) {
      const separatorDecorations = decoratorSettings?.decorations?.filter(d => d.type === 'separator') || [];
      separatorDecorations.forEach(sep => {
        dispatch({
          type: 'REMOVE_DECORATION',
          payload: sep.id
        });
      });
    }
  };

  // Update context when other settings change
  useEffect(() => {
    dispatch({
      type: 'UPDATE_DECORATOR_SETTINGS',
      payload: {
        selectedFont,
        selectedTemplate,
        selectedColorScheme,
        gdprContent
      }
    });
  }, [selectedFont, selectedTemplate, selectedColorScheme, gdprContent, dispatch]);

  const handleNext = () => {
    const nextStepIndex = state.availableBuildSteps.findIndex(step => step === 'decorator') + 1;
    const nextStep = state.availableBuildSteps[nextStepIndex];
    
    if (nextStep) {
      dispatch({ type: 'SET_BUILDER_STEP', payload: nextStep });
    }
  };

  const handleBack = () => {
    const currentStepIndex = state.availableBuildSteps.findIndex(step => step === 'decorator');
    const prevStep = state.availableBuildSteps[currentStepIndex - 1];
    
    if (prevStep) {
      dispatch({ type: 'SET_BUILDER_STEP', payload: prevStep });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primaryText mb-4 flex items-center justify-center">
          <Sparkles className="w-8 h-8 mr-3 text-accent" />
          Decorate Your Resume
        </h1>
        <p className="text-primaryText/70 text-lg">
          Add decorative elements and customize the visual style of your resume
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-accent rounded-xl p-6 mb-8 text-background">
        <div className="flex items-start space-x-4">
          <Info className="w-6 h-6 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg mb-2">DECORATIONS - MORE ISN'T ALWAYS BETTER</h3>
            <p>To change the position of a decoration, simply drag it with the cursor.</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Font Selection */}
        <div>
          <label className="block text-primaryText font-semibold mb-4">Font:</label>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2 bg-card border border-border rounded-xl px-4 py-3">
              <ArrowLeft className="w-4 h-4 text-primaryText/50" />
              <span className="font-medium text-primaryText">{selectedFont}</span>
              <ArrowRight className="w-4 h-4 text-primaryText/50" />
            </div>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primaryText/50" />
              <input
                type="text"
                placeholder="Search from 1600+ fonts..."
                value={fontSearch}
                onChange={(e) => setFontSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-primaryText placeholder-primaryText/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Template Selection */}
        <div>
          <label className="block text-primaryText font-semibold mb-4">Template:</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="template"
                value="Modern"
                checked={selectedTemplate === 'Modern'}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-4 h-4 text-accent focus:ring-accent"
              />
              <span className="text-primaryText">Modern</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="template"
                value="Classic"
                checked={selectedTemplate === 'Classic'}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-4 h-4 text-accent focus:ring-accent"
              />
              <span className="text-primaryText">Classic</span>
            </label>
          </div>
        </div>

        {/* Color Scheme Selection */}
        <div>
          <label className="block text-primaryText font-semibold mb-4">Choose a different Resume color scheme:</label>
          <div className="flex flex-wrap gap-2">
            {colorSchemes.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColorScheme(color)}
                className={`w-8 h-8 rounded-md border-2 transition-all duration-200 hover:scale-110 ${
                  selectedColorScheme === color 
                    ? 'border-primaryText scale-110 shadow-lg' 
                    : 'border-border hover:border-primaryText/50'
                }`}
                style={{ backgroundColor: color }}
                title={`Color ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Available Decorations */}
        <div>
          <label className="block text-primaryText font-semibold mb-4">All available decorations:</label>
          <div className="grid grid-cols-2 gap-4">
            {availableDecorations.map((decoration) => (
              <label key={decoration} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedDecorations.includes(decoration)}
                  onChange={() => handleDecorationToggle(decoration)}
                  className="w-4 h-4 text-accent focus:ring-accent rounded"
                />
                <span className="text-primaryText">{decoration}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Separator Color Picker - Only show when Separator is selected */}
        {selectedDecorations.includes('Separator') && (
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-bold text-primaryText mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2 text-accent" />
              Separator Color
            </h3>
            <div className="flex items-center space-x-4">
              <label className="block text-primaryText font-medium">Choose separator color:</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={separatorColor}
                  onChange={(e) => handleSeparatorColorChange(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                  title="Pick separator color"
                />
                <input
                  type="text"
                  value={separatorColor}
                  onChange={(e) => handleSeparatorColorChange(e.target.value)}
                  className="px-3 py-2 bg-background border border-border rounded-lg text-primaryText font-mono text-sm w-24"
                  placeholder="#000000"
                />
              </div>
            </div>
            <p className="text-primaryText/60 text-sm mt-2">
              This color will be applied to all separator elements on your resume.
            </p>
          </div>
        )}

        {/* GDPR Content */}
        <div>
          <label className="block text-primaryText font-semibold mb-4">GDPR Content in Resume: (optional)</label>
          <textarea
            value={gdprContent}
            onChange={(e) => setGdprContent(e.target.value)}
            placeholder="Enter GDPR compliance text..."
            rows={4}
            className="w-full px-4 py-3 bg-card border border-border rounded-xl text-primaryText placeholder-primaryText/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 px-6 py-3 text-primaryText hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            className="bg-accent hover:bg-accent/90 text-background px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-accent/20 flex items-center space-x-2"
          >
            <span>NEXT</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DecoratorForm; 