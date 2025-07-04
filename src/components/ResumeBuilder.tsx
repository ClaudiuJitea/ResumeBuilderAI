import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import PersonalInfoForm from './forms/PersonalInfoForm';
import WorkExperienceForm from './forms/WorkExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';
import LanguagesForm from './forms/LanguagesForm';
import PhotoForm from './forms/PhotoForm';
import AboutMeForm from './forms/AboutMeForm';
import ProjectsForm from './forms/ProjectsForm';
import InterestsForm from './forms/InterestsForm';
import CertificatesForm from './forms/CertificatesForm';
import AchievementsForm from './forms/AchievementsForm';
import LinksForm from './forms/LinksForm';
import DecoratorForm from './forms/DecoratorForm';
import FinishForm from './forms/FinishForm';
import StepIndicator from './StepIndicator';
import ResumePreview from './ResumePreview';

const ResumeBuilder = () => {
  const { state, dispatch } = useResume();

  const renderCurrentForm = () => {
    switch (state.builderStep) {
      case 'personal':
        return <PersonalInfoForm />;
      case 'experience':
        return <WorkExperienceForm />;
      case 'education':
        return <EducationForm />;
      case 'skills':
        return <SkillsForm />;
      case 'languages':
        return <LanguagesForm />;
      case 'photo':
        return <PhotoForm />;
      case 'aboutMe':
        return <AboutMeForm />;
      case 'projects':
        return <ProjectsForm />;
      case 'interests':
        return <InterestsForm />;
      case 'certificates':
        return <CertificatesForm />;
      case 'achievements':
        return <AchievementsForm />;
      case 'links':
        return <LinksForm />;
      case 'decorator':
        return <DecoratorForm />;
      case 'finish':
        return <FinishForm />;
      default:
        return <PersonalInfoForm />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 h-screen overflow-y-auto scrollbar-thin scrollbar-track-background scrollbar-thumb-accent/30 hover:scrollbar-thumb-accent/50">
        <div className="p-6 lg:p-8">
          {/* Back Button - Hide on finish step */}
          {state.builderStep !== 'finish' && (
            <button
              onClick={() => dispatch({ type: 'SET_STEP', payload: 'sections' })}
              className="flex items-center space-x-2 text-primaryText hover:text-accent mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          )}

          {/* Step Indicator - Hide on finish step */}
          {state.builderStep !== 'finish' && <StepIndicator />}

          {/* Form Content */}
          <div className={state.builderStep !== 'finish' ? 'mt-8' : ''}>
            {renderCurrentForm()}
          </div>
        </div>
      </div>

      {/* Vertical Separator */}
      <div className="hidden lg:block w-px bg-border"></div>

      {/* Right Panel - Resume Preview */}
      <div className="w-full lg:w-1/2 h-screen bg-card overflow-hidden">
        <ResumePreview />
      </div>
    </div>
  );
};

export default ResumeBuilder;