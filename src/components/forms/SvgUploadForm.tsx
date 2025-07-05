import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  RefreshCw
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { Decoration } from '../../types/resume';

interface SvgUploadFormProps {
  onSvgUploaded?: (svgContent: string) => void;
}

const SvgUploadForm: React.FC<SvgUploadFormProps> = ({ onSvgUploaded }) => {
  const { dispatch } = useResume();
  const [selectedSvg, setSelectedSvg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const responsiveSvg = makeResponsiveSvg(result);
        setSelectedSvg(responsiveSvg);
        // Don't call onSvgUploaded here - only call it when user adds to resume
      };
      reader.readAsText(file);
    } else {
      alert('Please select a valid SVG file.');
    }
  };

  const makeResponsiveSvg = (svgContent: string) => {
    // Parse the SVG to make it responsive
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    
    if (svgElement) {
      // Remove fixed width and height attributes
      svgElement.removeAttribute('width');
      svgElement.removeAttribute('height');
      
      // Ensure viewBox is set for proper scaling
      if (!svgElement.getAttribute('viewBox')) {
        const width = svgElement.getAttribute('width') || '100';
        const height = svgElement.getAttribute('height') || '100';
        svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
      }
      
      // Add responsive attributes
      svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svgElement.style.maxWidth = '100%';
      svgElement.style.maxHeight = '100%';
      svgElement.style.width = 'auto';
      svgElement.style.height = 'auto';
      
      return new XMLSerializer().serializeToString(svgDoc);
    }
    
    return svgContent;
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(event.dataTransfer.files);
    const svgFile = files.find(file => file.type === 'image/svg+xml' || file.name.endsWith('.svg'));
    
    if (svgFile) {
      handleFile(svgFile);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const addSvgDecoration = () => {
    if (!selectedSvg) return;
    
    const newDecoration: Decoration = {
      id: `svg-${Date.now()}`,
      type: 'svg-graphic',
      position: { x: 100, y: 100 },
      size: { width: 100, height: 100 },
      properties: {
        svgContent: selectedSvg
      }
    };
    
    dispatch({
      type: 'ADD_DECORATION',
      payload: newDecoration
    });
    
    // Call the callback to notify parent component
    if (onSvgUploaded) {
      onSvgUploaded(selectedSvg);
    }
    
    // Clear the form
    clearSvg();
  };

  const clearSvg = () => {
    setSelectedSvg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-accent bg-accent/10'
            : 'border-primaryText/20 hover:border-accent/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".svg,image/svg+xml"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {selectedSvg ? (
          <div className="space-y-4">
            <div 
              className="mx-auto w-32 h-32 border border-primaryText/20 rounded-lg flex items-center justify-center bg-white overflow-hidden svg-container"
            >
              <div 
                dangerouslySetInnerHTML={{ __html: selectedSvg }}
                className="w-full h-full flex items-center justify-center"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              />
            </div>
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Change SVG</span>
              </button>
              <button
                onClick={clearSvg}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primaryText mb-2">
                Upload SVG Graphics
              </h3>
              <p className="text-primaryText/70 mb-4">
                Drag and drop your SVG file here, or click to browse
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Upload className="w-5 h-5" />
                <span>Choose SVG File</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add to Resume Button */}
      {selectedSvg && (
        <button
          onClick={addSvgDecoration}
          className="w-full py-3 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors font-medium flex items-center justify-center space-x-2"
        >
          <ImageIcon className="w-5 h-5" />
          <span>Add SVG to Resume</span>
        </button>
      )}
    </div>
  );
};

export default SvgUploadForm;