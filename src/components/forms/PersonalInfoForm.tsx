import React, { useState } from 'react';
import { ArrowRight, Undo2, User, Upload } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import AIAssistanceButton from '../ai/AIAssistanceButton';
import CVParseUpload from '../ai/CVParseUpload';

const PersonalInfoForm = () => {
  const { state, dispatch } = useResume();
  const { personalInfo } = state.resumeData;
  const [showCVUpload, setShowCVUpload] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string>('');

  const handleInputChange = (field: string, value: string) => {
    dispatch({
      type: 'UPDATE_PERSONAL_INFO',
      payload: { [field]: value }
    });
  };

  const handleNext = () => {
    const currentIndex = state.availableBuildSteps.findIndex(step => step === state.builderStep);
    const nextStep = state.availableBuildSteps[currentIndex + 1];
    if (nextStep) {
      dispatch({ type: 'SET_BUILDER_STEP', payload: nextStep });
    }
  };

  const handleUndo = () => {
    dispatch({ type: 'SET_STEP', payload: 'sections' });
  };

  const handleCVDataExtracted = (extractedData: any) => {
    try {
      // Map extracted data to personal info fields
      const personalData = extractedData.personal_information || extractedData.personalInfo;
      
      if (personalData) {
        if (personalData.name) {
          // Split full name into first and last name
          const nameParts = personalData.name.trim().split(' ');
          if (nameParts.length >= 2) {
            handleInputChange('firstName', nameParts[0]);
            handleInputChange('lastName', nameParts.slice(1).join(' '));
          } else if (nameParts.length === 1) {
            handleInputChange('firstName', nameParts[0]);
          }
        }
        
        // Handle individual name fields if available
        if (personalData.firstName || personalData.first_name) {
          handleInputChange('firstName', personalData.firstName || personalData.first_name);
        }
        if (personalData.lastName || personalData.last_name) {
          handleInputChange('lastName', personalData.lastName || personalData.last_name);
        }
        
        if (personalData.email) {
          handleInputChange('email', personalData.email);
        }
        if (personalData.phone) {
          handleInputChange('phone', personalData.phone);
        }
        if (personalData.location) {
          handleInputChange('location', personalData.location);
        }
        if (personalData.position) {
          handleInputChange('position', personalData.position);
        }
      }

      // Store the full extracted data in resume context for use in other forms
      dispatch({ type: 'SET_EXTRACTED_CV_DATA', payload: extractedData });
      console.log('Extracted CV data applied to personal info and stored in context:', extractedData);

    } catch (error) {
      console.error('Error processing extracted CV data:', error);
    }
  };

  const handleAISuggestion = (suggestions: string) => {
    setAiSuggestions(suggestions);
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Info Box */}
      <div className="bg-accent text-background p-4 rounded-lg mb-8 relative">
        <h3 className="font-bold text-sm mb-2">STEP 1. PERSONAL INFORMATION</h3>
        <p className="text-sm">
          In this blue rectangle, you'll find important tips available on every page. 
          The Position and Location fields are optional.
        </p>
        
        {/* Character Illustration */}
        <div className="absolute -right-2 -top-2">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center">
            <User className="text-accent w-6 h-6" />
          </div>
        </div>
      </div>

      {/* AI Assistance Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="text-center mb-4">
          <h4 className="font-medium text-blue-900 mb-1">AI-Powered Assistance</h4>
          <p className="text-xs text-blue-700">
            Get AI help with your personal information
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowCVUpload(true)}
            className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors text-sm font-medium h-8"
          >
            <Upload className="w-4 h-4" />
            <span>Upload CV</span>
          </button>
          <AIAssistanceButton
            type="suggest"
            section="personalInfo"
            context={`Current info: ${personalInfo.firstName} ${personalInfo.lastName}, ${personalInfo.position || 'no position specified'}`}
            onResult={handleAISuggestion}
            className="w-full justify-center h-8"
            size="sm"
          />
        </div>
        
        {/* AI Suggestions Display */}
        {aiSuggestions && (
          <div className="mt-4 p-3 bg-white border border-blue-200 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2 text-sm">AI Suggestions:</h5>
            <div className="text-sm text-blue-800 whitespace-pre-wrap">{aiSuggestions}</div>
          </div>
        )}
      </div>

      {/* Form Fields */}
      <form className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-primaryText text-sm font-medium mb-2">
              First Name <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              value={personalInfo.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-primaryText text-sm font-medium mb-2">
              Last Name <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              value={personalInfo.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-primaryText text-sm font-medium mb-2">
            Position or Title
          </label>
          <input
            type="text"
            value={personalInfo.position}
            onChange={(e) => handleInputChange('position', e.target.value)}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Student / Designer"
          />
        </div>

        <div>
          <label className="block text-primaryText text-sm font-medium mb-2">
            Email <span className="text-accent">*</span>
          </label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="john.doe@email.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-primaryText text-sm font-medium mb-2">
              Phone Number <span className="text-accent">*</span>
            </label>
            <input
              type="tel"
              value={personalInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label className="block text-primaryText text-sm font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              value={personalInfo.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Wrocław Poland"
            />
          </div>
        </div>

        {/* Contact Information Styles */}
        <div>
          <label className="block text-primaryText text-sm font-medium mb-3">
            Contact Information Styles
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="contactStyle"
                value="symbols"
                checked={personalInfo.contactStyle === 'symbols'}
                onChange={(e) => handleInputChange('contactStyle', e.target.value)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-2 ${
                personalInfo.contactStyle === 'symbols' 
                  ? 'border-accent bg-accent' 
                  : 'border-border'
              }`} />
              <span className="text-primaryText text-sm">Symbols</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="contactStyle"
                value="none"
                checked={personalInfo.contactStyle === 'none'}
                onChange={(e) => handleInputChange('contactStyle', e.target.value)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-2 ${
                personalInfo.contactStyle === 'none' 
                  ? 'border-accent bg-accent' 
                  : 'border-border'
              }`} />
              <span className="text-primaryText text-sm">None</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-6">
          <button
            type="button"
            onClick={handleNext}
            className="w-full bg-accent hover:bg-accent/90 text-background py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
          >
            <span>NEXT</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            type="button"
            onClick={handleUndo}
            className="w-full bg-card border border-border hover:border-accent text-primaryText py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Undo2 className="w-5 h-5" />
            <span>UNDO</span>
          </button>
        </div>
      </form>

      {/* CV Upload Modal */}
      {showCVUpload && (
        <CVParseUpload
          onClose={() => setShowCVUpload(false)}
          onDataExtracted={handleCVDataExtracted}
        />
      )}
    </div>
  );
};

export default PersonalInfoForm;