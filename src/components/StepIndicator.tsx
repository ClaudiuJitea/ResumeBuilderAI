import React from 'react';
import { User, Briefcase, GraduationCap, Lightbulb, Download, Check, Edit3, Languages, Heart, Award, Trophy, Code, Globe, Image, Sparkles } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { StepType } from '../types/resume';

const StepIndicator = () => {
  const { state, dispatch } = useResume();

  const stepIconMap = {
    personal: User,
    experience: Briefcase,
    education: GraduationCap,
    skills: Lightbulb,
    aboutMe: Edit3,
    languages: Languages,
    interests: Heart,
    certificates: Award,
    achievements: Trophy,
    projects: Code,
    links: Globe,
    photo: Image,
    decorator: Sparkles,
    finish: Download,
  };

  const stepNameMap = {
    personal: 'Personal Info',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    aboutMe: 'About Me',
    languages: 'Languages',
    interests: 'Interests',
    certificates: 'Certificates',
    achievements: 'Achievements',
    projects: 'Projects',
    links: 'Links',
    photo: 'Photo',
    decorator: 'Decorator',
    finish: 'Finish',
  };

  const getCurrentStepIndex = () => {
    return state.availableBuildSteps.findIndex(step => step === state.builderStep);
  };

  const isStepCompleted = (stepIndex: number) => {
    return stepIndex < getCurrentStepIndex();
  };

  const isCurrentStep = (stepId: string) => {
    return stepId === state.builderStep;
  };

  const isStepAccessible = (stepIndex: number) => {
    // Allow access to completed steps, current step, and next step
    const currentIndex = getCurrentStepIndex();
    return stepIndex <= currentIndex + 1;
  };

  const handleStepClick = (stepId: StepType, stepIndex: number) => {
    if (isStepAccessible(stepIndex)) {
      dispatch({ type: 'SET_BUILDER_STEP', payload: stepId });
    }
  };

  // Split steps into two rows
  const totalSteps = state.availableBuildSteps.length;
  const stepsPerRow = Math.ceil(totalSteps / 2);
  const firstRowSteps = state.availableBuildSteps.slice(0, stepsPerRow);
  const secondRowSteps = state.availableBuildSteps.slice(stepsPerRow);

  const renderStepRow = (steps: StepType[], rowIndex: number) => (
    <div className="flex items-center justify-center">
      {steps.map((stepId, index) => {
        const actualIndex = rowIndex === 0 ? index : stepsPerRow + index;
        const IconComponent = stepIconMap[stepId as keyof typeof stepIconMap];
        const stepName = stepNameMap[stepId as keyof typeof stepNameMap];
        const completed = isStepCompleted(actualIndex);
        const current = isCurrentStep(stepId);
        const accessible = isStepAccessible(actualIndex);
        
        return (
          <div key={stepId} className="flex items-center">
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleStepClick(stepId, actualIndex)}
                disabled={!accessible}
                className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                  completed 
                    ? 'bg-heading border-heading text-background hover:bg-heading/90 cursor-pointer' 
                    : current
                    ? 'bg-accent border-accent text-background'
                    : accessible
                    ? 'bg-card border-border text-primaryText hover:border-accent/50 hover:text-accent cursor-pointer'
                    : 'bg-card border-border/50 text-primaryText/30 cursor-not-allowed'
                } ${accessible && !current ? 'hover:scale-105' : ''}`}
                title={accessible ? `Go to ${stepName}` : `Complete previous steps to unlock ${stepName}`}
              >
                {completed ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <IconComponent className="w-5 h-5" />
                )}
                
                {/* Accessibility indicator */}
                {accessible && !completed && !current && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full opacity-60"></div>
                )}
              </button>
              
              <span className={`text-xs mt-2 text-center max-w-16 transition-colors truncate ${
                current ? 'text-accent font-medium' : 
                completed ? 'text-heading font-medium' :
                accessible ? 'text-primaryText/80 hover:text-accent' :
                'text-primaryText/30'
              }`} title={stepName}>
                {stepName.length > 8 ? `${stepName.substring(0, 8)}...` : stepName}
              </span>
            </div>
            
            {/* Connection line to next step in the same row - centered */}
            {index < steps.length - 1 && (
              <div className="flex items-center justify-center mx-2">
                <div className={`w-4 lg:w-8 h-0.5 transition-colors ${
                  completed && isStepCompleted(actualIndex + 1) ? 'bg-heading' : 'bg-border'
                }`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-primaryText/60">Progress</span>
          <span className="text-sm text-accent font-medium">
            {getCurrentStepIndex() + 1} of {state.availableBuildSteps.length}
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div 
            className="bg-accent rounded-full h-2 transition-all duration-300"
            style={{ width: `${((getCurrentStepIndex() + 1) / state.availableBuildSteps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Icons in Two Rows */}
      <div className="space-y-6">
        {/* First Row */}
        {firstRowSteps.length > 0 && renderStepRow(firstRowSteps, 0)}
        
        {/* Second Row */}
        {secondRowSteps.length > 0 && renderStepRow(secondRowSteps, 1)}
      </div>

      {/* Navigation Hint */}
      <div className="mt-4 text-center">
        <p className="text-xs text-primaryText/60">
          Click on any accessible step to navigate directly to that section
        </p>
      </div>
    </div>
  );
};

export default StepIndicator;