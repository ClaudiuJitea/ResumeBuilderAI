import React from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  Edit3, 
  Image, 
  Languages, 
  Heart, 
  Lightbulb, 
  Award,
  Globe,
  Trophy,
  Code,
  ArrowRight,
  ArrowLeft,
  Check,
  Lock
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { getTemplateConfig } from '../utils/templateConfig';

const iconMap = {
  GraduationCap,
  Briefcase,
  Edit3,
  Image,
  Languages,
  Heart,
  Lightbulb,
  Award,
  Globe,
  Trophy,
  Code,
};

const SectionSelection = () => {
  const { state, dispatch } = useResume();

  const toggleSection = (sectionId: string) => {
    const updatedSections = state.selectedSections.map(section => {
      if (section.id === sectionId && section.available && !section.required) {
        return { ...section, selected: !section.selected };
      }
      return section;
    });
    
    dispatch({ type: 'SET_SECTIONS', payload: updatedSections });
  };

  const handleConfirm = () => {
    dispatch({ type: 'SET_STEP', payload: 'builder' });
  };

  const templateConfig = getTemplateConfig(state.selectedTemplate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => dispatch({ type: 'SET_STEP', payload: 'templates' })}
            className="flex items-center space-x-2 text-primaryText hover:text-accent mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-primaryText mb-4">
              Select sections for <span className="text-heading">{templateConfig.name}</span>
            </h1>
            <p className="text-primaryText/70 text-lg">
              Choose which sections to include in your resume. Some sections are required for this template.
            </p>
          </div>

          {/* Template Info */}
          <div className="bg-card rounded-2xl p-6 border border-border mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-primaryText mb-2">Template: {templateConfig.name}</h3>
                <p className="text-primaryText/60">
                  This template supports {templateConfig.availableSections.length} sections with {templateConfig.requiredSections.length} required sections.
                </p>
              </div>
              <div className="text-accent font-bold text-2xl">
                {state.selectedSections.filter(s => s.selected).length}/{state.selectedSections.length}
              </div>
            </div>
          </div>

          {/* Sections Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
            {state.selectedSections.map((section, index) => {
              const IconComponent = iconMap[section.icon as keyof typeof iconMap];
              const isDisabled = !section.available;
              const isRequired = section.required;
              
              return (
                <div
                  key={section.id}
                  className={`relative group animate-scale-in ${
                    isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => !isDisabled && toggleSection(section.id)}
                >
                  <div className={`bg-card border-2 rounded-2xl p-6 text-center transition-all duration-200 ${
                    isDisabled 
                      ? 'border-border/50 opacity-50' 
                      : section.selected 
                        ? 'border-accent bg-accent/10 group-hover:scale-105' 
                        : 'border-border hover:border-accent/50 group-hover:scale-105'
                  } ${!isDisabled && 'group-hover:shadow-lg'}`}>
                    
                    {/* Icon Container */}
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center relative ${
                      isDisabled
                        ? 'bg-border/30 text-primaryText/30'
                        : section.selected 
                          ? 'bg-accent text-background' 
                          : 'bg-icon/20 text-icon'
                    }`}>
                      <IconComponent className="w-8 h-8" />
                      
                      {/* Disabled/Required Indicators */}
                      {isDisabled && (
                        <div className="absolute -top-1 -right-1 bg-border rounded-full p-1">
                          <Lock className="w-3 h-3 text-primaryText/50" />
                        </div>
                      )}
                      {isRequired && section.available && (
                        <div className="absolute -top-1 -right-1 bg-loginBtn rounded-full p-1">
                          <span className="text-background text-xs font-bold">!</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Section Name */}
                    <h3 className={`font-semibold text-sm mb-2 ${
                      isDisabled ? 'text-primaryText/30' : 'text-primaryText'
                    }`}>
                      {section.name}
                    </h3>
                    
                    {/* Status Indicators */}
                    <div className="flex justify-center space-x-1">
                      {isRequired && (
                        <span className="bg-loginBtn text-background px-2 py-1 rounded text-xs font-medium">
                          Required
                        </span>
                      )}
                      {isDisabled && (
                        <span className="bg-border text-primaryText/50 px-2 py-1 rounded text-xs font-medium">
                          Not Available
                        </span>
                      )}
                    </div>
                    
                    {/* Selection Indicator */}
                    {section.selected && section.available && (
                      <div className="absolute -top-2 -right-2 bg-accent rounded-full p-1">
                        <Check className="w-4 h-4 text-background" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section Summary */}
          <div className="bg-card rounded-2xl p-6 border border-border mb-8">
            <h3 className="text-lg font-bold text-primaryText mb-4">Section Summary</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {state.selectedSections.filter(s => s.selected && s.required).length}
                </div>
                <div className="text-sm text-primaryText/60">Required Sections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-heading">
                  {state.selectedSections.filter(s => s.selected && !s.required).length}
                </div>
                <div className="text-sm text-primaryText/60">Optional Sections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primaryText/50">
                  {state.selectedSections.filter(s => !s.available).length}
                </div>
                <div className="text-sm text-primaryText/60">Unavailable</div>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <div className="text-center">
            <button
              onClick={handleConfirm}
              className="bg-loginBtn hover:bg-loginBtn/90 text-background px-12 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-loginBtn/20 flex items-center space-x-2 mx-auto group"
            >
              <span>START BUILDING</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-primaryText/60 text-sm mt-4">
              You'll be guided through {state.availableBuildSteps.length - 1} steps to complete your resume
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionSelection;