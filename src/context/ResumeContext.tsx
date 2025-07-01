import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ResumeData, ResumeSection, StepType, ColorTheme, DecoratorSettings, Decoration } from '../types/resume';
import { getSectionsForTemplate, getBuildStepsForTemplate } from '../utils/templateConfig';

interface ResumeState {
  currentStep: 'landing' | 'templates' | 'sections' | 'builder' | 'gallery' | 'admin' | 'yourCVs';
  builderStep: StepType;
  selectedTemplate: string;
  selectedSections: ResumeSection[];
  availableBuildSteps: StepType[];
  resumeData: ResumeData;
  extractedCVData?: any;
}

type ResumeAction = 
  | { type: 'SET_STEP'; payload: ResumeState['currentStep'] }
  | { type: 'SET_BUILDER_STEP'; payload: StepType }
  | { type: 'SET_TEMPLATE'; payload: string }
  | { type: 'SET_SECTIONS'; payload: ResumeSection[] }
  | { type: 'UPDATE_PERSONAL_INFO'; payload: Partial<ResumeData['personalInfo']> }
  | { type: 'UPDATE_RESUME_DATA'; payload: Partial<ResumeData> }
  | { type: 'UPDATE_BUILD_STEPS'; payload: StepType[] }
  | { type: 'SET_COLOR_THEME'; payload: ColorTheme }
  | { type: 'UPDATE_DECORATOR_SETTINGS'; payload: Partial<DecoratorSettings> }
  | { type: 'ADD_DECORATION'; payload: Decoration }
  | { type: 'UPDATE_DECORATION'; payload: { id: string; updates: Partial<Decoration> } }
  | { type: 'REMOVE_DECORATION'; payload: string }
  | { type: 'SET_EXTRACTED_CV_DATA'; payload: any };

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
      contactStyle: 'symbols',
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
    },
    skillsConfig: {
      style: 'dots',
      position: 'left'
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
    case 'UPDATE_DECORATOR_SETTINGS':
      const defaultDecoratorSettings: DecoratorSettings = {
        selectedFont: 'Roboto',
        selectedTemplate: 'Classic',
        selectedColorScheme: '#2563eb',
        selectedDecorations: [],
        gdprContent: '',
        decorations: []
      };
      
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          decoratorSettings: {
            ...defaultDecoratorSettings,
            ...state.resumeData.decoratorSettings,
            ...action.payload
          }
        }
      };
    case 'ADD_DECORATION':
      const currentDecorations = state.resumeData.decoratorSettings?.decorations || [];
      const defaultSettings1: DecoratorSettings = {
        selectedFont: 'Roboto',
        selectedTemplate: 'Classic',
        selectedColorScheme: '#2563eb',
        selectedDecorations: [],
        gdprContent: '',
        decorations: []
      };
      
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          decoratorSettings: {
            ...defaultSettings1,
            ...state.resumeData.decoratorSettings,
            decorations: [...currentDecorations, action.payload]
          }
        }
      };
    case 'UPDATE_DECORATION':
      const existingDecorations = state.resumeData.decoratorSettings?.decorations || [];
      const defaultSettings2: DecoratorSettings = {
        selectedFont: 'Roboto',
        selectedTemplate: 'Classic',
        selectedColorScheme: '#2563eb',
        selectedDecorations: [],
        gdprContent: '',
        decorations: []
      };
      
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          decoratorSettings: {
            ...defaultSettings2,
            ...state.resumeData.decoratorSettings,
            decorations: existingDecorations.map(decoration =>
              decoration.id === action.payload.id
                ? { ...decoration, ...action.payload.updates }
                : decoration
            )
          }
        }
      };
    case 'REMOVE_DECORATION':
      const decorationsToFilter = state.resumeData.decoratorSettings?.decorations || [];
      const defaultSettings3: DecoratorSettings = {
        selectedFont: 'Roboto',
        selectedTemplate: 'Classic',
        selectedColorScheme: '#2563eb',
        selectedDecorations: [],
        gdprContent: '',
        decorations: []
      };
      
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          decoratorSettings: {
            ...defaultSettings3,
            ...state.resumeData.decoratorSettings,
            decorations: decorationsToFilter.filter(
              decoration => decoration.id !== action.payload
            )
          }
        }
      };
    case 'SET_EXTRACTED_CV_DATA':
      return {
        ...state,
        extractedCVData: action.payload
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