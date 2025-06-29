import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ResumeData, ResumeSection, StepType, ColorTheme } from '../types/resume';
import { getSectionsForTemplate, getBuildStepsForTemplate } from '../utils/templateConfig';

interface ResumeState {
  currentStep: 'landing' | 'templates' | 'sections' | 'builder' | 'gallery';
  builderStep: StepType;
  selectedTemplate: string;
  selectedSections: ResumeSection[];
  availableBuildSteps: StepType[];
  resumeData: ResumeData;
}

type ResumeAction = 
  | { type: 'SET_STEP'; payload: ResumeState['currentStep'] }
  | { type: 'SET_BUILDER_STEP'; payload: StepType }
  | { type: 'SET_TEMPLATE'; payload: string }
  | { type: 'SET_SECTIONS'; payload: ResumeSection[] }
  | { type: 'UPDATE_PERSONAL_INFO'; payload: Partial<ResumeData['personalInfo']> }
  | { type: 'UPDATE_RESUME_DATA'; payload: Partial<ResumeData> }
  | { type: 'UPDATE_BUILD_STEPS'; payload: StepType[] }
  | { type: 'SET_COLOR_THEME'; payload: ColorTheme };

const initialState: ResumeState = {
  currentStep: 'landing',
  builderStep: 'personal',
  selectedTemplate: '',
  selectedSections: [],
  availableBuildSteps: ['personal', 'experience', 'education', 'skills', 'finish'],
  resumeData: {
    personalInfo: {
      firstName: '',
      lastName: '',
      position: '',
      email: '',
      phone: '',
      location: '',
      contactStyle: 'none',
    },
    workExperience: [],
    education: [],
    skills: [],
    languages: [],
    interests: [],
    aboutMe: '',
    certificates: [],
    achievements: [],
    projects: [],
    links: [],
    references: [],
    colorTheme: {
      id: 'cyan',
      name: 'Cyan Professional',
      primary: '#00FFCC',
      secondary: '#00E6B8',
      accent: '#3DDC91',
      gradient: {
        from: '#00FFCC',
        to: '#3DDC91'
      }
    }
  },
};

const resumeReducer = (state: ResumeState, action: ResumeAction): ResumeState => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_BUILDER_STEP':
      return { ...state, builderStep: action.payload };
    case 'SET_TEMPLATE': {
      const templateId = action.payload;
      const sectionsForTemplate = getSectionsForTemplate(templateId);
      const selectedSectionIds = sectionsForTemplate
        .filter(section => section.selected)
        .map(section => section.id);
      const buildSteps = getBuildStepsForTemplate(templateId, selectedSectionIds);
      
      return { 
        ...state, 
        selectedTemplate: templateId,
        selectedSections: sectionsForTemplate,
        availableBuildSteps: buildSteps,
        builderStep: buildSteps[0] || 'personal'
      };
    }
    case 'SET_SECTIONS': {
      const selectedSectionIds = action.payload
        .filter(section => section.selected)
        .map(section => section.id);
      const buildSteps = getBuildStepsForTemplate(state.selectedTemplate, selectedSectionIds);
      
      return { 
        ...state, 
        selectedSections: action.payload,
        availableBuildSteps: buildSteps,
        builderStep: buildSteps[0] || 'personal'
      };
    }
    case 'UPDATE_PERSONAL_INFO':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          personalInfo: { ...state.resumeData.personalInfo, ...action.payload },
        },
      };
    case 'UPDATE_RESUME_DATA':
      return {
        ...state,
        resumeData: { ...state.resumeData, ...action.payload },
      };
    case 'UPDATE_BUILD_STEPS':
      return {
        ...state,
        availableBuildSteps: action.payload,
        builderStep: action.payload[0] || 'personal'
      };
    case 'SET_COLOR_THEME':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          colorTheme: action.payload
        }
      };
    default:
      return state;
  }
};

const ResumeContext = createContext<{
  state: ResumeState;
  dispatch: React.Dispatch<ResumeAction>;
} | null>(null);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(resumeReducer, initialState);

  return (
    <ResumeContext.Provider value={{ state, dispatch }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};