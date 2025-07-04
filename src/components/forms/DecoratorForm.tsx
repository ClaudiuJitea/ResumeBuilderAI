import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Search,
  Info,
  Palette,
  Copy,
  Trash2,
  Plus,
  Type,
  Check,
  X
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { 
  ALL_FONTS, 
  searchFonts, 
  getFontsByPopularity,
  loadGoogleFont,
  DEFAULT_FONT
} from '../../utils/fonts';

const DecoratorForm = () => {
  const { state, dispatch } = useResume();
  const decoratorSettings = state.resumeData.decoratorSettings;
  
  const [selectedFont, setSelectedFont] = useState(decoratorSettings?.selectedFont || DEFAULT_FONT);
  const [fontSearch, setFontSearch] = useState('');

  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [selectedDecorations, setSelectedDecorations] = useState<string[]>(decoratorSettings?.selectedDecorations || []);
  const [gdprContent, setGdprContent] = useState(decoratorSettings?.gdprContent || '');
  const [separatorColor, setSeparatorColor] = useState('#000000');

  const availableDecorations = [
    'Separator', 'Accent Line', 'Corner Frame', 'Skill Badge',
    'Geometric Shape', 'Progress Indicator', 'Section Divider', 'Highlight Box',
    'Decorative Border', 'Visual Element'
  ];

  // Initialize separator color from existing decorations
  useEffect(() => {
    const separatorDecoration = decoratorSettings?.decorations?.find(d => d.type === 'separator');
    if (separatorDecoration?.properties?.color) {
      setSeparatorColor(separatorDecoration.properties.color);
    }
  }, [decoratorSettings?.decorations]);

  // Load the selected font when it changes
  useEffect(() => {
    if (selectedFont && selectedFont !== 'Inter') {
      const font = ALL_FONTS.find(f => f.family === selectedFont);
      if (font) {
        loadGoogleFont(font.family, font.variants);
      }
    }
  }, [selectedFont]);

  // Get filtered and searched fonts
  const getFilteredFonts = () => {
    let fonts = ALL_FONTS;
    
    if (fontSearch.trim()) {
      fonts = searchFonts(fontSearch, fonts);
    }
    
    return getFontsByPopularity(fonts);
  };

  const handleFontSelect = (fontFamily: string) => {
    setSelectedFont(fontFamily);
    // Don't close dropdown here - let user preview multiple fonts
    
    // Load the font
    const font = ALL_FONTS.find(f => f.family === fontFamily);
    if (font) {
      loadGoogleFont(font.family, font.variants);
    }
  };

  const handleApplyFont = () => {
    setShowFontDropdown(false);
    setFontSearch('');
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

    // Create decoration based on type when adding
    if (!selectedDecorations.includes(decoration)) {
      const decorationId = `${decoration.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      let decorationConfig;

      switch (decoration) {
        case 'Separator':
          decorationConfig = {
            type: 'separator' as const,
            position: { x: 50, y: 200 },
            size: { width: 200, height: 4 },
            properties: { color: separatorColor, thickness: 4, opacity: 1 }
          };
          break;
        case 'Accent Line':
          decorationConfig = {
            type: 'accent-line' as const,
            position: { x: 30, y: 150 },
            size: { width: 150, height: 2 },
            properties: { color: '#3B82F6', thickness: 2, opacity: 0.8, style: 'solid' as const }
          };
          break;
        case 'Corner Frame':
          decorationConfig = {
            type: 'corner-frame' as const,
            position: { x: 20, y: 20 },
            size: { width: 60, height: 60 },
            properties: { color: '#10B981', thickness: 3, opacity: 0.7, style: 'solid' as const }
          };
          break;
        case 'Skill Badge':
          decorationConfig = {
            type: 'skill-badge' as const,
            position: { x: 100, y: 300 },
            size: { width: 80, height: 25 },
            properties: { color: '#8B5CF6', opacity: 0.9, borderRadius: 12, style: 'solid' as const }
          };
          break;
        case 'Geometric Shape':
          decorationConfig = {
            type: 'geometric-shape' as const,
            position: { x: 250, y: 100 },
            size: { width: 40, height: 40 },
            properties: { color: '#F59E0B', opacity: 0.6, shape: 'triangle' as const, style: 'solid' as const }
          };
          break;
        case 'Progress Indicator':
          decorationConfig = {
            type: 'progress-indicator' as const,
            position: { x: 80, y: 400 },
            size: { width: 120, height: 8 },
            properties: { color: '#EF4444', opacity: 0.8, borderRadius: 4, style: 'gradient' as const }
          };
          break;
        case 'Section Divider':
          decorationConfig = {
            type: 'section-divider' as const,
            position: { x: 40, y: 250 },
            size: { width: 180, height: 1 },
            properties: { color: '#6B7280', opacity: 0.5, style: 'dashed' as const }
          };
          break;
        case 'Highlight Box':
          decorationConfig = {
            type: 'highlight-box' as const,
            position: { x: 60, y: 180 },
            size: { width: 100, height: 30 },
            properties: { color: '#06B6D4', opacity: 0.2, borderRadius: 6, style: 'solid' as const }
          };
          break;
        case 'Decorative Border':
          decorationConfig = {
            type: 'decorative-border' as const,
            position: { x: 10, y: 10 },
            size: { width: 280, height: 200 },
            properties: { color: '#EC4899', thickness: 2, opacity: 0.4, style: 'dotted' as const }
          };
          break;
        case 'Visual Element':
          decorationConfig = {
            type: 'visual-element' as const,
            position: { x: 200, y: 350 },
            size: { width: 50, height: 50 },
            properties: { color: '#14B8A6', opacity: 0.7, shape: 'circle' as const, style: 'solid' as const }
          };
          break;
        default:
          return;
      }

      dispatch({
        type: 'ADD_DECORATION',
        payload: {
          id: decorationId,
          ...decorationConfig
        }
      });
    } else {
      // Remove decorations of this type when unchecking
      const decorationType = decoration.toLowerCase().replace(/\s+/g, '-');
      const decorationsToRemove = decoratorSettings?.decorations?.filter(d => d.type === decorationType) || [];
      decorationsToRemove.forEach(dec => {
        dispatch({
          type: 'REMOVE_DECORATION',
          payload: dec.id
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
        gdprContent
      }
    });
  }, [selectedFont, gdprContent, dispatch]);

  

  // Duplicate separator function


  // Add new separator function


  // Remove specific separator function


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
          <label className="block text-primaryText font-semibold mb-4 flex items-center">
            <Type className="w-5 h-5 mr-2 text-accent" />
            Font Selection:
          </label>
          
          {/* Current Font Display */}
          <div className="mb-4">
            <div 
              className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 cursor-pointer hover:border-accent transition-colors"
              onClick={() => setShowFontDropdown(!showFontDropdown)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-accent/20 rounded flex items-center justify-center">
                  <Type className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <span 
                    className="font-medium text-primaryText"
                    style={{ fontFamily: `'${selectedFont}', sans-serif` }}
                  >
                    {selectedFont}
                  </span>
                  <div className="text-xs text-primaryText/60">
                    {ALL_FONTS.find(f => f.family === selectedFont)?.description || 'Professional font'}
                  </div>
                </div>
              </div>
              <ArrowRight className={`w-5 h-5 text-primaryText/50 transition-transform ${showFontDropdown ? 'rotate-90' : ''}`} />
            </div>
          </div>

          {/* Font Selection Dropdown */}
          {showFontDropdown && (
            <div className="bg-card border border-border rounded-xl p-4 mb-4 relative">
              {/* Close Button */}
              <button
                onClick={() => setShowFontDropdown(false)}
                className="absolute top-3 right-3 text-primaryText/50 hover:text-primaryText transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Search Bar */}
              <div className="relative mb-4 pr-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primaryText/50" />
                <input
                  type="text"
                  placeholder="Search fonts..."
                  value={fontSearch}
                  onChange={(e) => setFontSearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-background border border-border rounded-lg text-primaryText placeholder-primaryText/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                {fontSearch && (
                  <button
                    onClick={() => setFontSearch('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primaryText/50 hover:text-primaryText"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>



              {/* Font List */}
              <div className="max-h-80 overflow-y-auto space-y-2">
                {getFilteredFonts().slice(0, 35).map((font) => (
                  <div
                    key={font.family}
                    className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                      selectedFont === font.family
                        ? 'bg-accent/10 border-accent'
                        : 'bg-background border-border hover:border-accent/50'
                    }`}
                    onClick={() => handleFontSelect(font.family)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div 
                          className="font-medium text-primaryText text-lg"
                          style={{ fontFamily: `'${font.family}', ${font.category === 'serif' ? 'serif' : 'sans-serif'}` }}
                        >
                          {font.family}
                        </div>
                        <div className="text-xs text-primaryText/60 mt-1">
                          {font.description}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded">
                            {font.category}
                          </span>
                          <span className="text-xs text-primaryText/50">
                            {font.variants.length} styles
                          </span>
                        </div>
                      </div>
                      {selectedFont === font.family && (
                        <Check className="w-5 h-5 text-accent ml-2" />
                      )}
                    </div>
                  </div>
                ))}
                
                {getFilteredFonts().length === 0 && (
                  <div className="text-center py-8 text-primaryText/60">
                    No fonts found matching your search.
                  </div>
                )}
              </div>

              {/* Font Preview */}
              <div className="mt-4 p-3 bg-background rounded-lg border border-border">
                <div className="text-sm text-primaryText/60 mb-2">Preview:</div>
                <div 
                  className="text-primaryText"
                  style={{ fontFamily: `'${selectedFont}', sans-serif` }}
                >
                  <div className="text-2xl font-bold mb-1">John Doe</div>
                  <div className="text-lg">Software Engineer</div>
                  <div className="text-base mt-2 text-primaryText/80">
                    Experienced developer with expertise in React, TypeScript, and modern web technologies.
                  </div>
                </div>
              </div>

              {/* Apply Font Button */}
              <button
                onClick={handleApplyFont}
                className="w-full mt-4 bg-accent hover:bg-accent/90 text-background py-2 rounded-lg font-medium transition-colors"
              >
                Apply Font
              </button>
            </div>
          )}
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

        {/* Decoration Customization - Show when any decoration is selected */}
        {selectedDecorations.length > 0 && (
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-bold text-primaryText mb-6 flex items-center">
              <Palette className="w-5 h-5 mr-2 text-primaryText" />
              Decoration Customization
            </h3>
            
            {selectedDecorations.map((decorationType) => {
              const decorations = decoratorSettings?.decorations?.filter(d => {
                const typeMap: Record<string, string> = {
                  'Separator': 'separator',
                  'Accent Line': 'accent-line',
                  'Corner Frame': 'corner-frame',
                  'Geometric Shape': 'geometric-shape',
                  'Skill Badge': 'skill-badge',
                  'Progress Indicator': 'progress-indicator',
                  'Section Divider': 'section-divider',
                  'Highlight Box': 'highlight-box',
                  'Decorative Border': 'decorative-border',
                  'Visual Element': 'visual-element'
                };
                return d.type === typeMap[decorationType];
              }) || [];
              
              if (decorations.length === 0) return null;
              
              const firstDecoration = decorations[0];
              const currentColor = firstDecoration.properties?.color || '#000000';
              const currentOpacity = firstDecoration.properties?.opacity || 1;
              
              return (
                <div key={decorationType} className="mb-6 p-4 bg-background rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-primaryText font-medium flex items-center">
                      <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: currentColor, opacity: currentOpacity }}></span>
                      {decorationType} ({decorations.length})
                    </h4>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          const decorationId = `${decorationType.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
                          let decorationConfig;
                          
                          const typeMap: Record<string, string> = {
                            'Separator': 'separator',
                            'Accent Line': 'accent-line',
                            'Corner Frame': 'corner-frame',
                            'Geometric Shape': 'geometric-shape',
                            'Skill Badge': 'skill-badge',
                            'Progress Indicator': 'progress-indicator',
                            'Section Divider': 'section-divider',
                            'Highlight Box': 'highlight-box',
                            'Decorative Border': 'decorative-border',
                            'Visual Element': 'visual-element'
                          };
                          
                          const decorationType_mapped = typeMap[decorationType] as 'separator' | 'accent-line' | 'corner-frame' | 'geometric-shape' | 'skill-badge' | 'progress-indicator' | 'section-divider' | 'highlight-box' | 'decorative-border' | 'visual-element';
                          
                          switch (decorationType) {
                            case 'Separator':
                              decorationConfig = {
                                id: decorationId,
                                type: decorationType_mapped,
                                position: { x: 50, y: 200 + (decorations.length * 50) },
                                size: { width: 200, height: 4 },
                                properties: { color: currentColor, thickness: 4, opacity: currentOpacity }
                              };
                              break;
                            case 'Accent Line':
                              decorationConfig = {
                                id: decorationId,
                                type: decorationType_mapped,
                                position: { x: 100, y: 150 + (decorations.length * 40) },
                                size: { width: 150, height: 3 },
                                properties: { color: currentColor, style: 'solid' as const, opacity: currentOpacity }
                              };
                              break;
                            case 'Corner Frame':
                              decorationConfig = {
                                id: decorationId,
                                type: decorationType_mapped,
                                position: { x: 50, y: 100 + (decorations.length * 60) },
                                size: { width: 100, height: 100 },
                                properties: { color: currentColor, thickness: 2, borderRadius: 8, opacity: currentOpacity }
                              };
                              break;
                            case 'Geometric Shape':
                              decorationConfig = {
                                id: decorationId,
                                type: decorationType_mapped,
                                position: { x: 80, y: 120 + (decorations.length * 50) },
                                size: { width: 60, height: 60 },
                                properties: { color: currentColor, shape: 'circle' as const, opacity: currentOpacity }
                              };
                              break;
                            default:
                              decorationConfig = {
                                id: decorationId,
                                type: decorationType_mapped,
                                position: { x: 70, y: 180 + (decorations.length * 45) },
                                size: { width: 80, height: 20 },
                                properties: { color: currentColor, opacity: currentOpacity }
                              };
                          }
                          
                          dispatch({
                            type: 'ADD_DECORATION',
                            payload: decorationConfig
                          });
                        }}
                        className="flex items-center space-x-1 px-3 py-1 bg-accent hover:bg-accent/90 text-background rounded-lg text-sm font-medium transition-all duration-200"
                        title={`Add new ${decorationType.toLowerCase()}`}
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                      
                      {decorations.length > 0 && (
                        <button
                          onClick={() => {
                            const lastDecoration = decorations[decorations.length - 1];
                            const decorationId = `${decorationType.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
                            const offsetX = 20 + Math.random() * 50;
                            const offsetY = 20 + Math.random() * 50;
                            
                            dispatch({
                              type: 'ADD_DECORATION',
                              payload: {
                                id: decorationId,
                                type: lastDecoration.type,
                                position: { 
                                  x: lastDecoration.position.x + offsetX, 
                                  y: lastDecoration.position.y + offsetY 
                                },
                                size: { ...lastDecoration.size },
                                properties: { ...lastDecoration.properties }
                              }
                            });
                          }}
                          className="flex items-center space-x-1 px-3 py-1 bg-primaryText hover:bg-primaryText/90 text-background rounded-lg text-sm font-medium transition-all duration-200"
                          title={`Duplicate last ${decorationType.toLowerCase()}`}
                        >
                          <Copy className="w-3 h-3" />
                          <span>Duplicate</span>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Color Picker */}
                    <div>
                      <label className="block text-primaryText/80 text-sm font-medium mb-2">Color:</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={currentColor}
                          onChange={(e) => {
                            decorations.forEach(decoration => {
                              dispatch({
                                type: 'UPDATE_DECORATION',
                                payload: {
                                  id: decoration.id,
                                  updates: {
                                    properties: {
                                      ...decoration.properties,
                                      color: e.target.value
                                    }
                                  }
                                }
                              });
                            });
                          }}
                          className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                          title="Pick color"
                        />
                        <input
                          type="text"
                          value={currentColor}
                          onChange={(e) => {
                            decorations.forEach(decoration => {
                              dispatch({
                                type: 'UPDATE_DECORATION',
                                payload: {
                                  id: decoration.id,
                                  updates: {
                                    properties: {
                                      ...decoration.properties,
                                      color: e.target.value
                                    }
                                  }
                                }
                              });
                            });
                          }}
                          className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-primaryText font-mono text-sm"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                    
                    {/* Transparency Slider */}
                    <div>
                      <label className="block text-primaryText/80 text-sm font-medium mb-2">
                        Transparency: {Math.round((1 - currentOpacity) * 100)}%
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-primaryText/60">Solid</span>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={currentOpacity}
                          onChange={(e) => {
                            const newOpacity = parseFloat(e.target.value);
                            decorations.forEach(decoration => {
                              dispatch({
                                type: 'UPDATE_DECORATION',
                                payload: {
                                  id: decoration.id,
                                  updates: {
                                    properties: {
                                      ...decoration.properties,
                                      opacity: newOpacity
                                    }
                                  }
                                }
                              });
                            });
                          }}
                          className="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer slider"
                        />
                        <span className="text-xs text-primaryText/60">Transparent</span>
                      </div>
                      <div className="text-xs text-primaryText/50 mt-1">
                        Opacity: {Math.round(currentOpacity * 100)}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Individual Decoration List */}
                  {decorations.length > 1 && (
                    <div className="mt-4">
                      <h5 className="text-primaryText/80 text-sm font-medium mb-2">Individual Elements:</h5>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {decorations.map((decoration, index) => (
                          <div
                            key={decoration.id}
                            className="flex items-center justify-between p-2 bg-card rounded border border-border/50"
                          >
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-2 h-2 rounded-full" 
                                style={{ 
                                  backgroundColor: decoration.properties?.color || '#000000',
                                  opacity: decoration.properties?.opacity || 1
                                }}
                              ></div>
                              <span className="text-primaryText/80 text-xs">
                                {decorationType} {index + 1}
                              </span>
                              <span className="text-primaryText/50 text-xs">
                                ({Math.round(decoration.position.x)}, {Math.round(decoration.position.y)})
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                dispatch({
                                  type: 'REMOVE_DECORATION',
                                  payload: decoration.id
                                });
                              }}
                              className="flex items-center justify-center w-6 h-6 text-primaryText/40 hover:text-red-500 hover:bg-red-50 rounded transition-all duration-200"
                              title="Remove this decoration"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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