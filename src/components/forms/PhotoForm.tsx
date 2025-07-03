import React, { useState, useRef } from 'react';
import { 
  ArrowRight, 
  Undo2, 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  X, 
  RotateCw, 
  Move, 
  ZoomIn, 
  ZoomOut,
  User,
  Check
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

const PhotoForm = () => {
  const { state, dispatch } = useResume();
  const { personalInfo } = state.resumeData;
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(personalInfo.photo || null);
  const [photoStyle, setPhotoStyle] = useState<'circle' | 'square' | 'rounded'>(personalInfo.photoStyle || 'circle');
  const [photoSize, setPhotoSize] = useState<'small' | 'medium' | 'large'>(personalInfo.photoSize || 'medium');
  const [photoPosition, setPhotoPosition] = useState<'left' | 'center' | 'right'>(personalInfo.photoPosition || 'center');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedPhoto(result);
        updatePersonalInfo({ photo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(event.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFile(imageFile);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const removePhoto = () => {
    setSelectedPhoto(null);
    updatePersonalInfo({ 
      photo: undefined,
      photoStyle: undefined,
      photoSize: undefined,
      photoPosition: undefined
    });
  };

  const updatePersonalInfo = (updates: Partial<typeof personalInfo>) => {
    dispatch({
      type: 'UPDATE_PERSONAL_INFO',
      payload: updates
    });
  };

  const handlePhotoStyleChange = (style: 'circle' | 'square' | 'rounded') => {
    setPhotoStyle(style);
    updatePersonalInfo({ photoStyle: style });
  };

  const handlePhotoSizeChange = (size: 'small' | 'medium' | 'large') => {
    setPhotoSize(size);
    updatePersonalInfo({ photoSize: size });
  };

  const handlePhotoPositionChange = (position: 'left' | 'center' | 'right') => {
    setPhotoPosition(position);
    updatePersonalInfo({ photoPosition: position });
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

  const getPhotoPreviewClass = () => {
    let sizeClass = '';
    switch (photoSize) {
      case 'small':
        sizeClass = 'w-16 h-16';
        break;
      case 'medium':
        sizeClass = 'w-24 h-24';
        break;
      case 'large':
        sizeClass = 'w-32 h-32';
        break;
    }

    let shapeClass = '';
    switch (photoStyle) {
      case 'circle':
        shapeClass = 'rounded-full';
        break;
      case 'square':
        shapeClass = 'rounded-none';
        break;
      case 'rounded':
        shapeClass = 'rounded-lg';
        break;
    }

    return `${sizeClass} ${shapeClass}`;
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Info Box */}
      <div className="bg-accent text-background p-4 rounded-lg mb-8 relative">
        <h3 className="font-bold text-sm mb-2">PHOTO UPLOAD</h3>
        <p className="text-sm">
          Add a professional photo to your resume. Choose from different styles and positions to match your template.
        </p>
        
        {/* Character Illustration */}
        <div className="absolute -right-2 -top-2">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center">
            <Camera className="text-accent w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Photo Upload Area */}
      <div className="mb-8">
        <h4 className="text-primaryText font-medium mb-4">Upload Photo</h4>
        
        {!selectedPhoto ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
              isDragging 
                ? 'border-accent bg-accent/10' 
                : 'border-border hover:border-accent/50 hover:bg-accent/5'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-accent" />
              </div>
              <div>
                <p className="text-primaryText font-medium mb-2">
                  Drop your photo here or click to browse
                </p>
                <p className="text-primaryText/60 text-sm">
                  Supports JPG, PNG, GIF up to 10MB
                </p>
              </div>
              <button className="bg-accent hover:bg-accent/90 text-background px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2">
                <ImageIcon className="w-4 h-4" />
                <span>Choose Photo</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <img
                  src={selectedPhoto}
                  alt="Profile"
                  className={`${getPhotoPreviewClass()} object-cover border-2 border-accent`}
                />
                <button
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1">
                <h5 className="text-primaryText font-medium mb-2">Photo Preview</h5>
                <p className="text-primaryText/60 text-sm mb-4">
                  This is how your photo will appear on your resume.
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-background border border-border text-primaryText px-4 py-2 rounded-lg text-sm hover:border-accent transition-colors flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Change Photo</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Photo Style Options */}
      {selectedPhoto && (
        <>
          <div className="mb-6">
            <h4 className="text-primaryText font-medium mb-4">Photo Style</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'circle', name: 'Circle', icon: '●' },
                { id: 'square', name: 'Square', icon: '■' },
                { id: 'rounded', name: 'Rounded', icon: '▢' }
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => handlePhotoStyleChange(style.id as 'circle' | 'square' | 'rounded')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                    photoStyle === style.id
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-primaryText hover:border-accent/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{style.icon}</div>
                  <div className="text-sm font-medium">{style.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-primaryText font-medium mb-4">Photo Size</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'small', name: 'Small', size: 'w-8 h-8' },
                { id: 'medium', name: 'Medium', size: 'w-12 h-12' },
                { id: 'large', name: 'Large', size: 'w-16 h-16' }
              ].map((size) => (
                <button
                  key={size.id}
                  onClick={() => handlePhotoSizeChange(size.id as 'small' | 'medium' | 'large')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                    photoSize === size.id
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-primaryText hover:border-accent/50'
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    <div className={`${size.size} bg-accent/30 rounded-full`}></div>
                  </div>
                  <div className="text-sm font-medium">{size.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-primaryText font-medium mb-4">Position</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'left', name: 'Left', icon: '◀' },
                { id: 'center', name: 'Center', icon: '●' },
                { id: 'right', name: 'Right', icon: '▶' }
              ].map((position) => (
                <button
                  key={position.id}
                  onClick={() => handlePhotoPositionChange(position.id as 'left' | 'center' | 'right')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                    photoPosition === position.id
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-primaryText hover:border-accent/50'
                  }`}
                >
                  <div className="text-xl mb-2">{position.icon}</div>
                  <div className="text-sm font-medium">{position.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Tips */}
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <h5 className="text-primaryText font-medium mb-3 flex items-center">
              <Camera className="w-4 h-4 mr-2 text-accent" />
              Photo Tips
            </h5>
            <ul className="text-primaryText/70 text-sm space-y-2">
              <li className="flex items-start">
                <Check className="w-4 h-4 text-heading mr-2 mt-0.5 flex-shrink-0" />
                <span>Use a high-quality, professional headshot</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-heading mr-2 mt-0.5 flex-shrink-0" />
                <span>Ensure good lighting and clear facial features</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-heading mr-2 mt-0.5 flex-shrink-0" />
                <span>Wear professional attire appropriate for your field</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-heading mr-2 mt-0.5 flex-shrink-0" />
                <span>Keep the background simple and uncluttered</span>
              </li>
            </ul>
          </div>
        </>
      )}

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

export default PhotoForm;