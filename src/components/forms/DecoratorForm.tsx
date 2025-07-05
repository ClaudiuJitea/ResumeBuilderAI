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
  X,
  Image,
  Upload
} from 'lucide-react';
import SvgUploadForm from './SvgUploadForm';
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
  const [separatorColor, setSeparatorColor] = useState('#14B8A6');
  const [showSvgUpload, setShowSvgUpload] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const availableDecorations = [
    'Separator', 'Corner Frame', 'Circle Frame', 'Triangle Frame',
    'Triangle Shape', 'Square Shape',
    'Circle Shape', 'Dust Overlay', 'Gradient Shapes', 'SVG Graphics'
  ];

  // Initialize separator color from existing decorations
  useEffect(() => {
    const separatorDecoration = decoratorSettings?.decorations?.find(d => d.type === 'separator');
    if (separatorDecoration?.properties?.color) {
      setSeparatorColor(separatorDecoration.properties.color);
    } else {
      setSeparatorColor('#14B8A6');
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
            properties: { color: separatorColor, thickness: 4, opacity: 1, rotation: 0 }
          };
          break;
        case 'Corner Frame':
          decorationConfig = {
            type: 'corner-frame' as const,
            position: { x: 20, y: 20 },
            size: { width: 60, height: 60 },
            properties: { color: '#14B8A6', thickness: 3, opacity: 0.7, style: 'solid' as const }
          };
          break;
        case 'Circle Frame':
          decorationConfig = {
            type: 'circle-frame' as const,
            position: { x: 20, y: 20 },
            size: { width: 60, height: 60 },
            properties: { color: '#14B8A6', thickness: 3, opacity: 0.7, style: 'solid' as const }
          };
          break;
        case 'Triangle Frame':
          decorationConfig = {
            type: 'triangle-frame' as const,
            position: { x: 20, y: 20 },
            size: { width: 60, height: 60 },
            properties: { color: '#14B8A6', thickness: 3, opacity: 0.7, style: 'solid' as const }
          };
          break;
        case 'Triangle Shape':
          decorationConfig = {
            type: 'geometric-shape' as const,
            position: { x: 250, y: 100 },
            size: { width: 40, height: 40 },
            properties: { color: '#14B8A6', opacity: 0.6, shape: 'triangle' as const, style: 'solid' as const, rotation: 0 }
          };
          break;

        case 'Square Shape':
          decorationConfig = {
            type: 'highlight-box' as const,
            position: { x: 60, y: 180 },
            size: { width: 100, height: 30 },
            properties: { color: '#14B8A6', opacity: 0.2, borderRadius: 6, style: 'solid' as const, rotation: 0 }
          };
          break;

        case 'Circle Shape':
          decorationConfig = {
            type: 'visual-element' as const,
            position: { x: 200, y: 350 },
            size: { width: 50, height: 50 },
            properties: { color: '#14B8A6', opacity: 0.7, shape: 'circle' as const, style: 'solid' as const }
          };
          break;
        case 'Dust Overlay':
          decorationConfig = {
            type: 'dust-overlay' as const,
            position: { x: 50, y: 100 },
            size: { width: 200, height: 150 },
            properties: { color: '#14B8A6', opacity: 0.3, particleCount: 50, particleSize: 3 }
          };
          break;
        case 'Gradient Shapes':
          decorationConfig = {
            type: 'hexagonal-overlay' as const,
            position: { x: 150, y: 200 },
            size: { width: 120, height: 120 },
            properties: { color: '#14B8A6', opacity: 0.2, shape: 'flowing' as const }
          };
          break;
        case 'SVG Graphics':
          // Show SVG upload form instead of creating decoration immediately
          setShowSvgUpload(true);
          return;
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
      let decorationType: string;
      
      // Map UI names to actual decoration types
      switch (decoration) {
        case 'Separator':
          decorationType = 'separator';
          break;
        case 'Corner Frame':
           decorationType = 'corner-frame';
           break;
         case 'Circle Frame':
           decorationType = 'circle-frame';
           break;
         case 'Triangle Frame':
           decorationType = 'triangle-frame';
           break;
        case 'Triangle Shape':
          decorationType = 'geometric-shape';
          break;
        
        case 'Square Shape':
          decorationType = 'highlight-box';
          break;
        
        case 'Circle Shape':
          decorationType = 'visual-element';
          break;
        case 'Dust Overlay':
          decorationType = 'dust-overlay';
          break;
        case 'Gradient Shapes':
          decorationType = 'hexagonal-overlay';
          break;
        case 'SVG Graphics':
          decorationType = 'svg-graphic';
          break;
        default:
          decorationType = decoration.toLowerCase().replace(/\s+/g, '-');
      }
      
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
              <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-background scrollbar-thumb-accent/30 hover:scrollbar-thumb-accent/50 space-y-2">
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

        {/* SVG Upload Form */}
        {showSvgUpload && (
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-primaryText flex items-center">
                <Image className="w-5 h-5 mr-2 text-accent" />
                Upload SVG Graphics
              </h3>
              <button
                onClick={() => setShowSvgUpload(false)}
                className="p-2 text-primaryText/60 hover:text-primaryText hover:bg-background rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <SvgUploadForm onSvgUploaded={() => {
              setShowSvgUpload(false);
              // Add SVG Graphics to selected decorations if not already present
              if (!selectedDecorations.includes('SVG Graphics')) {
                setSelectedDecorations(prev => [...prev, 'SVG Graphics']);
              }
            }} />
          </div>
        )}

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
                  'Corner Frame': 'corner-frame',
                  'Circle Frame': 'circle-frame',
                  'Triangle Frame': 'triangle-frame',
                  'Triangle Shape': 'geometric-shape',
                  'Section Divider': 'section-divider',
                  'Square Shape': 'highlight-box',
                  'Decorative Border': 'decorative-border',
                  'Circle Shape': 'visual-element',
                  'Dust Overlay': 'dust-overlay',
                  'Gradient Shapes': 'hexagonal-overlay',
                  'SVG Graphics': 'svg-graphic'
                };
                return d.type === typeMap[decorationType];
              }) || [];
              
              if (decorations.length === 0) return null;
              
              // If no element is selected, select the first one
              const currentDecoration = selectedElementId 
                ? decorations.find(d => d.id === selectedElementId) || decorations[0]
                : decorations[0];
              
              const currentColor = currentDecoration.properties?.color || '#000000';
              const currentOpacity = currentDecoration.properties?.opacity || 1;
              
              // Special handling for SVG Graphics
              const isSvgGraphic = decorationType === 'SVG Graphics';
              const svgColor = isSvgGraphic ? '#00FFCC' : currentColor; // Use accent color for SVG graphics
              
              return (
                <div key={decorationType} className="mb-6 p-4 bg-background rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-primaryText font-medium flex items-center">
                      <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: svgColor, opacity: currentOpacity }}></span>
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
                            'Corner Frame': 'corner-frame',
                            'Circle Frame': 'circle-frame',
                            'Triangle Frame': 'triangle-frame',
                            'Triangle Shape': 'geometric-shape',
                            'Section Divider': 'section-divider',
                            'Square Shape': 'highlight-box',
                            'Decorative Border': 'decorative-border',
                            'Circle Shape': 'visual-element',
                            'Dust Overlay': 'dust-overlay',
                            'Gradient Shapes': 'hexagonal-overlay',
                            'SVG Graphics': 'svg-graphic'
                          };
                          
                          const decorationType_mapped = typeMap[decorationType] as 'separator' | 'corner-frame' | 'geometric-shape' | 'section-divider' | 'highlight-box' | 'decorative-border' | 'visual-element' | 'dust-overlay' | 'hexagonal-overlay' | 'svg-graphic';
                          
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
                            case 'Corner Frame':
                              decorationConfig = {
                                id: decorationId,
                                type: decorationType_mapped,
                                position: { x: 50, y: 100 + (decorations.length * 60) },
                                size: { width: 100, height: 100 },
                                properties: { color: currentColor, thickness: 2, borderRadius: 8, opacity: currentOpacity }
                              };
                              break;
                            case 'Circle Frame':
                              decorationConfig = {
                                id: decorationId,
                                type: decorationType_mapped,
                                position: { x: 50, y: 100 + (decorations.length * 60) },
                                size: { width: 100, height: 100 },
                                properties: { color: currentColor, thickness: 2, opacity: currentOpacity, style: 'solid' as const }
                              };
                              break;
                            case 'Triangle Frame':
                              decorationConfig = {
                                id: decorationId,
                                type: decorationType_mapped,
                                position: { x: 50, y: 100 + (decorations.length * 60) },
                                size: { width: 100, height: 100 },
                                properties: { color: currentColor, thickness: 2, opacity: currentOpacity, style: 'solid' as const }
                              };
                              break;
                            case 'Triangle Shape':
                              decorationConfig = {
                                id: decorationId,
                                type: decorationType_mapped,
                                position: { x: 80, y: 120 + (decorations.length * 50) },
                                size: { width: 60, height: 60 },
                                properties: { color: currentColor, shape: 'circle' as const, opacity: currentOpacity }
                              };
                              break;
                            case 'Dust Overlay':
                              decorationConfig = {
                                id: decorationId,
                                type: decorationType_mapped,
                                position: { x: 50, y: 50 + (decorations.length * 30) },
                                size: { width: 300, height: 200 },
                                properties: { color: currentColor, opacity: currentOpacity, particleCount: 85, particleSize: 3 }
                              };
                              break;
                            case 'Gradient Shapes':
                              decorationConfig = {
                                id: decorationId,
                                type: decorationType_mapped,
                                position: { x: 100, y: 80 + (decorations.length * 40) },
                                size: { width: 250, height: 180 },
                                properties: { color: currentColor, opacity: currentOpacity, shape: 'hexagon' as const }
                              };
                              break;
                            case 'SVG Graphics':
                              // Show SVG upload form instead of creating default SVG
                              setShowSvgUpload(true);
                              return;
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
                    {/* Color Picker - Show for all decoration types */}
                    <div>
                      <label className="block text-primaryText/80 text-sm font-medium mb-2">Color:</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={currentColor}
                          onChange={(e) => {
                            dispatch({
                              type: 'UPDATE_DECORATION',
                              payload: {
                                id: currentDecoration.id,
                                updates: {
                                  properties: {
                                    ...currentDecoration.properties,
                                    color: e.target.value
                                  }
                                }
                              }
                            });
                          }}
                          className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                          title="Pick color"
                        />
                        <input
                          type="text"
                          value={currentColor}
                          onChange={(e) => {
                            dispatch({
                              type: 'UPDATE_DECORATION',
                              payload: {
                                id: currentDecoration.id,
                                updates: {
                                  properties: {
                                    ...currentDecoration.properties,
                                    color: e.target.value
                                  }
                                }
                              }
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
                            dispatch({
                              type: 'UPDATE_DECORATION',
                              payload: {
                                id: currentDecoration.id,
                                updates: {
                                  properties: {
                                    ...currentDecoration.properties,
                                    opacity: newOpacity
                                  }
                                }
                              }
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
                    
                    {/* SVG Graphics Controls */}
                    {isSvgGraphic && (
                      <>
                        {/* Rotation Control */}
                        <div>
                          <label className="block text-primaryText/80 text-sm font-medium mb-2">
                            Rotation: {currentDecoration.properties?.rotation || 0}°
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            step="15"
                            value={currentDecoration.properties?.rotation || 0}
                            onChange={(e) => {
                              const newRotation = parseInt(e.target.value);
                              dispatch({
                                type: 'UPDATE_DECORATION',
                                payload: {
                                  id: currentDecoration.id,
                                  updates: {
                                    properties: {
                                      ...currentDecoration.properties,
                                      rotation: newRotation
                                    }
                                  }
                                }
                              });
                            }}
                            className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                        
                        {/* Aspect Ratio Control */}
                        <div>
                          <label className="block text-primaryText/80 text-sm font-medium mb-2">Aspect Ratio:</label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={currentDecoration.properties?.preserveAspectRatio !== false}
                              onChange={(e) => {
                                const preserve = e.target.checked;
                                dispatch({
                                  type: 'UPDATE_DECORATION',
                                  payload: {
                                    id: currentDecoration.id,
                                    updates: {
                                      properties: {
                                        ...currentDecoration.properties,
                                        preserveAspectRatio: preserve
                                      }
                                    }
                                  }
                                });
                              }}
                              className="w-4 h-4 text-accent rounded border-border"
                            />
                            <span className="text-sm text-primaryText/70">Preserve aspect ratio</span>
                          </label>
                        </div>
                        

                      </>
                    )}
                    
                    {/* Specific Controls for Different Decoration Types */}
                    {decorationType === 'Dust Overlay' && (
                      <>
                        {/* Particle Count Slider */}
                        <div>
                          <label className="block text-primaryText/80 text-sm font-medium mb-2">
                             Particle Count: {currentDecoration.properties?.particleCount || 85}
                           </label>
                           <input
                             type="range"
                             min="10"
                             max="200"
                             step="10"
                             value={currentDecoration.properties?.particleCount || 85}
                            onChange={(e) => {
                              const newCount = parseInt(e.target.value);
                              dispatch({
                                type: 'UPDATE_DECORATION',
                                payload: {
                                  id: currentDecoration.id,
                                  updates: {
                                    properties: {
                                      ...currentDecoration.properties,
                                      particleCount: newCount
                                    }
                                  }
                                }
                              });
                            }}
                            className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                        
                        {/* Particle Size Slider */}
                        <div>
                          <label className="block text-primaryText/80 text-sm font-medium mb-2">
                            Particle Size: {currentDecoration.properties?.particleSize || 3}px
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="0.5"
                            value={currentDecoration.properties?.particleSize || 3}
                            onChange={(e) => {
                              const newSize = parseFloat(e.target.value);
                              dispatch({
                                type: 'UPDATE_DECORATION',
                                payload: {
                                  id: currentDecoration.id,
                                  updates: {
                                    properties: {
                                      ...currentDecoration.properties,
                                      particleSize: newSize
                                    }
                                  }
                                }
                              });
                            }}
                            className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                      </>
                    )}
                    
                    {/* Gradient Shapes Controls */}
                    {currentDecoration.type === 'hexagonal-overlay' && (
                      <>
                        {/* Shape Style Selector */}
                        <div>
                          <label className="block text-primaryText/80 text-sm font-medium mb-2">
                            Shape Style: {currentDecoration.properties?.shape || 'flowing'}
                          </label>
                          <select
                            value={currentDecoration.properties?.shape || 'flowing'}
                            onChange={(e) => {
                              const newShape = e.target.value as 'triangle' | 'circle' | 'diamond' | 'hexagon' | 'rectangle' | 'flowing' | 'geometric' | 'organic' | 'crystalline' | 'waves' | 'spiral';
                              dispatch({
                                type: 'UPDATE_DECORATION',
                                payload: {
                                  id: currentDecoration.id,
                                  updates: {
                                    properties: {
                                      ...currentDecoration.properties,
                                      shape: newShape
                                    }
                                  }
                                }
                              });
                            }}
                            className="w-full px-3 py-2 bg-card border border-border rounded-md text-primaryText focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            <option value="flowing">Flowing Gradients</option>
                            <option value="geometric">Geometric Shapes</option>
                            <option value="organic">Organic Forms</option>
                            <option value="crystalline">Crystalline Patterns</option>
                            <option value="waves">Wave Patterns</option>
                            <option value="spiral">Spiral Forms</option>
                          </select>
                        </div>
                        
                        {/* Rotation Control */}
                        <div>
                          <label className="block text-primaryText/80 text-sm font-medium mb-1">
                            Rotation: {currentDecoration.properties?.rotation || 0}°
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            step="15"
                            value={currentDecoration.properties?.rotation || 0}
                            onChange={(e) => {
                              const newRotation = parseInt(e.target.value);
                              dispatch({
                                type: 'UPDATE_DECORATION',
                                payload: {
                                  id: currentDecoration.id,
                                  updates: {
                                    properties: {
                                      ...currentDecoration.properties,
                                      rotation: newRotation
                                    }
                                  }
                                }
                              });
                            }}
                            className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                      </>
                    )}
                    
                    {/* Frame Controls (Separator, Corner Frame, Circle Frame, Triangle Frame) */}
                    {(currentDecoration.type === 'separator' || currentDecoration.type === 'corner-frame' || currentDecoration.type === 'circle-frame' || currentDecoration.type === 'triangle-frame') && (
                      <>
                        {/* Thickness Slider */}
                        <div>
                          <label className="block text-primaryText/80 text-sm font-medium mb-2">
                            Thickness: {currentDecoration.properties?.thickness || 2}px
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={currentDecoration.properties?.thickness || 2}
                            onChange={(e) => {
                              const newThickness = parseInt(e.target.value);
                              dispatch({
                                type: 'UPDATE_DECORATION',
                                payload: {
                                  id: currentDecoration.id,
                                  updates: {
                                    properties: {
                                      ...currentDecoration.properties,
                                      thickness: newThickness
                                    }
                                  }
                                }
                              });
                            }}
                            className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                        
                        {/* Style Selector */}
                        <div>
                          <label className="block text-primaryText/80 text-sm font-medium mb-2">
                            Border Style: {currentDecoration.properties?.style || 'solid'}
                          </label>
                          <select
                            value={currentDecoration.properties?.style || 'solid'}
                            onChange={(e) => {
                              const newStyle = e.target.value as 'solid' | 'dashed' | 'dotted';
                              dispatch({
                                type: 'UPDATE_DECORATION',
                                payload: {
                                  id: currentDecoration.id,
                                  updates: {
                                    properties: {
                                      ...currentDecoration.properties,
                                      style: newStyle
                                    }
                                  }
                                }
                              });
                            }}
                            className="w-full px-3 py-2 bg-card border border-border rounded-md text-primaryText focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            <option value="solid">Solid</option>
                            <option value="dashed">Dashed</option>
                            <option value="dotted">Dotted</option>
                          </select>
                        </div>
                        
                        {/* Border Radius Slider (only for Corner Frame) */}
                         {currentDecoration.type === 'corner-frame' && (
                           <div>
                             <label className="block text-primaryText/80 text-sm font-medium mb-2">
                               Corner Radius: {currentDecoration.properties?.borderRadius || 8}px
                             </label>
                             <input
                               type="range"
                               min="0"
                               max="50"
                               step="2"
                               value={currentDecoration.properties?.borderRadius || 8}
                               onChange={(e) => {
                                 const newBorderRadius = parseInt(e.target.value);
                                 dispatch({
                                   type: 'UPDATE_DECORATION',
                                   payload: {
                                     id: currentDecoration.id,
                                     updates: {
                                       properties: {
                                         ...currentDecoration.properties,
                                         borderRadius: newBorderRadius
                                       }
                                     }
                                   }
                                 });
                               }}
                               className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer slider"
                             />
                           </div>
                         )}
                         
                         {/* Rotation Control (for Separator, Corner Frame, Circle Frame, Triangle Frame, Triangle Shape, and Square Shape) */}
                          {(currentDecoration.type === 'separator' || currentDecoration.type === 'corner-frame' || currentDecoration.type === 'circle-frame' || currentDecoration.type === 'triangle-frame' || currentDecoration.type === 'geometric-shape' || currentDecoration.type === 'highlight-box') && (
                            <div>
                              <label className="block text-primaryText/80 text-sm font-medium mb-2">
                                Rotation: {currentDecoration.properties?.rotation || 0}°
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="360"
                                step="15"
                                value={currentDecoration.properties?.rotation || 0}
                                onChange={(e) => {
                                  const newRotation = parseInt(e.target.value);
                                  dispatch({
                                    type: 'UPDATE_DECORATION',
                                    payload: {
                                      id: currentDecoration.id,
                                      updates: {
                                        properties: {
                                          ...currentDecoration.properties,
                                          rotation: newRotation
                                        }
                                      }
                                    }
                                  });
                                }}
                                className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer slider"
                              />
                            </div>
                          )}
                      </>
                    )}
                  </div>
                  
                  {/* Individual Element Selector */}
                  {decorations.length > 1 && (
                    <div className="mt-4 p-3 bg-background rounded-lg border border-border">
                      <h5 className="text-primaryText/80 text-sm font-medium mb-2">Select Element to Customize:</h5>
                      <div className="grid grid-cols-1 gap-2">
                        {decorations.map((decoration, index) => (
                          <button
                            key={decoration.id}
                            onClick={() => setSelectedElementId(decoration.id)}
                            className={`flex items-center justify-between p-2 rounded border transition-all duration-200 ${
                              selectedElementId === decoration.id || (!selectedElementId && index === 0)
                                ? 'border-accent bg-accent/10 text-accent'
                                : 'border-border/50 bg-card hover:bg-card/50 text-primaryText/80'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ 
                                  backgroundColor: decoration.properties?.color || '#000000',
                                  opacity: decoration.properties?.opacity || 1
                                }}
                              ></div>
                              <span className="text-sm">
                                {decorationType} {index + 1}
                              </span>
                              <span className="text-xs opacity-60">
                                ({Math.round(decoration.position.x)}, {Math.round(decoration.position.y)})
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {(selectedElementId === decoration.id || (!selectedElementId && index === 0)) && (
                                <div className="w-2 h-2 rounded-full bg-accent"></div>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch({
                                    type: 'REMOVE_DECORATION',
                                    payload: decoration.id
                                  });
                                  // Reset selection if we're deleting the selected element
                                  if (selectedElementId === decoration.id) {
                                    setSelectedElementId(null);
                                  }
                                }}
                                className="flex items-center justify-center w-5 h-5 text-primaryText/40 hover:text-red-500 hover:bg-red-50 rounded transition-all duration-200"
                                title="Remove this decoration"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </button>
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