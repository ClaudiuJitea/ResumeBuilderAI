import React, { useState } from 'react';
import { Edit, Palette, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import ModernTemplate from './templates/ModernTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import ColorThemeSelector from './ColorThemeSelector';
import InteractiveSeparator from './InteractiveSeparator';

const ResumePreview = () => {
  const { state } = useResume();
  const [fontSize, setFontSize] = useState(100);
  const [zoomLevel, setZoomLevel] = useState(60); // Default zoom level for preview
  const [showColorSelector, setShowColorSelector] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(parseInt(e.target.value));
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoomLevel(parseInt(e.target.value));
  };

  // Add zoom control functions
  const handleZoomOut = () => {
    setZoomLevel(Math.max(30, zoomLevel - 10));
  };

  const handleZoomIn = () => {
    setZoomLevel(Math.min(150, zoomLevel + 10));
  };

  // Determine if we need multiple pages based on content
  const { workExperience, projects, skills } = state.resumeData;
  const needsSecondPage = workExperience.length > 2 || projects.length > 0 || skills.length > 6;
  const totalPages = needsSecondPage ? 2 : 1;

  const renderTemplate = () => {
    switch (state.selectedTemplate) {
      case 'modern':
        return <ModernTemplate fontSize={fontSize} currentPage={currentPage} />;
      case 'professional':
        return <ProfessionalTemplate fontSize={fontSize} />;
      default:
        return <ModernTemplate fontSize={fontSize} currentPage={currentPage} />;
    }
  };

  // Get decorations from the context
  const decorations = state.resumeData.decoratorSettings?.decorations || [];

  return (
    <div className="h-screen overflow-y-auto relative">
      {/* Top Controls - Hide on finish step */}
      {state.builderStep !== 'finish' && (
        <div className="sticky top-0 bg-card border-b border-border p-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Edit className="w-5 h-5 text-accent" />
              <span className="text-accent font-medium">Resume Size Adjustment</span>
            </div>
            <div className="flex items-center space-x-2">
              {/* Page Navigation */}
              {totalPages > 1 && (
                <div className="flex items-center space-x-2 mr-4">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-1 bg-background border border-border text-primaryText px-2 py-1 rounded text-sm hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </button>
                  <span className="text-primaryText text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center space-x-1 bg-background border border-border text-primaryText px-2 py-1 rounded text-sm hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
              <button 
                onClick={() => setShowColorSelector(true)}
                className="flex items-center space-x-1 bg-accent text-background px-3 py-1 rounded text-sm hover:bg-accent/90 transition-colors"
              >
                <Palette className="w-4 h-4" />
                <span>Choose your own color</span>
              </button>
            </div>
          </div>
          
          {/* Size Slider */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-primaryText">Size:</span>
            <input 
              type="range" 
              min="50" 
              max="150" 
              value={fontSize}
              onChange={handleFontSizeChange}
              className="flex-1 accent-accent"
            />
            <span className="text-sm text-primaryText w-12">{fontSize}%</span>
          </div>

          {/* Multi-page Info */}
          {totalPages > 1 && (
            <div className="mt-3 p-2 bg-accent/10 border border-accent/30 rounded text-accent text-sm">
              <div className="flex items-center space-x-2">
                <span className="font-medium">📄 Multi-page Resume:</span>
                <span>Your content spans {totalPages} pages for better organization</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Resume Content - A4 Format */}
      <div className="p-8 bg-gray-100">
        <div 
          className="mx-auto bg-white shadow-2xl transition-transform duration-300 relative" 
          data-resume-preview
          style={{ 
            width: '210mm', 
            minHeight: '297mm',
            transform: state.builderStep === 'finish' 
              ? `scale(${0.8 * (zoomLevel / 100)})` 
              : `scale(${0.6 * (zoomLevel / 100)})`,
            transformOrigin: 'top center',
            fontSize: `${fontSize}%`
          }}
        >
          {renderTemplate()}
          
          {/* Decorations Overlay - Only show in decorator step */}
          {state.builderStep === 'decorator' && decorations.length > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="relative w-full h-full pointer-events-auto">
                {decorations.map((decoration) => {
                  if (decoration.type === 'separator') {
                    return (
                      <InteractiveSeparator
                        key={decoration.id}
                        decoration={decoration}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Zoom Controls - Fixed at bottom */}
      <div className="fixed bottom-0 left-1/2 right-0 bg-card/95 backdrop-blur-sm border-t border-border p-4 z-20">
        <div className="max-w-md mx-auto">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleZoomOut}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-background border border-border text-primaryText/60 hover:text-accent hover:border-accent/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={zoomLevel <= 30}
              title="Zoom Out (10%)"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <div className="flex-1 flex items-center space-x-3">
              <span className="text-sm text-primaryText/60 min-w-[40px]">Zoom:</span>
              <input 
                type="range" 
                min="30" 
                max="150" 
                value={zoomLevel}
                onChange={handleZoomChange}
                className="flex-1 accent-accent"
                style={{
                  background: `linear-gradient(to right, #00FFCC 0%, #00FFCC ${((zoomLevel - 30) / (150 - 30)) * 100}%, #30363D ${((zoomLevel - 30) / (150 - 30)) * 100}%, #30363D 100%)`
                }}
              />
              <span className="text-sm text-primaryText font-medium min-w-[45px]">{zoomLevel}%</span>
            </div>
            <button 
              onClick={handleZoomIn}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-background border border-border text-primaryText/60 hover:text-accent hover:border-accent/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={zoomLevel >= 150}
              title="Zoom In (10%)"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
          
          {/* Quick Zoom Buttons */}
          <div className="flex justify-center space-x-2 mt-3">
            {[50, 75, 100, 125].map((zoom) => (
              <button
                key={zoom}
                onClick={() => setZoomLevel(zoom)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
                  zoomLevel === zoom
                    ? 'bg-accent text-background'
                    : 'bg-background border border-border text-primaryText hover:border-accent/50 hover:text-accent'
                }`}
              >
                {zoom}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Color Theme Selector Modal */}
      <ColorThemeSelector 
        isOpen={showColorSelector}
        onClose={() => setShowColorSelector(false)}
      />
    </div>
  );
};

export default ResumePreview;