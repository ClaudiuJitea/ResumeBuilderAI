import { TemplateConfig, StepType } from '../types/resume';

export const templateConfigs: Record<string, TemplateConfig> = {
  modern: {
    id: 'modern',
    name: 'Modern Professional',
    availableSections: [
      'education', 'experience', 'about', 'photo', 'languages', 
      'interests', 'skills', 'certificates', 'links', 'achievements', 'projects'
    ],
    requiredSections: ['education', 'experience', 'about', 'skills'],
    buildSteps: ['personal', 'experience', 'education', 'skills', 'aboutMe', 'languages', 'projects', 'interests', 'certificates', 'achievements', 'links', 'photo', 'decorator', 'finish']
  },
  professional: {
    id: 'professional',
    name: 'Professional Clean',
    availableSections: [
      'education', 'experience', 'about', 'photo', 'skills', 
      'certificates', 'achievements', 'projects', 'links'
    ],
    requiredSections: ['education', 'experience', 'about', 'skills'],
    buildSteps: ['personal', 'experience', 'education', 'skills', 'aboutMe', 'projects', 'certificates', 'achievements', 'links', 'photo', 'decorator', 'finish']
  },
  creative: {
    id: 'creative',
    name: 'Creative Designer',
    availableSections: [
      'education', 'experience', 'about', 'photo', 'skills', 
      'projects', 'links', 'interests', 'achievements'
    ],
    requiredSections: ['experience', 'about', 'skills', 'projects'],
    buildSteps: ['personal', 'experience', 'education', 'skills', 'aboutMe', 'projects', 'interests', 'achievements', 'links', 'photo', 'decorator', 'finish']
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal Elegance',
    availableSections: [
      'education', 'experience', 'about', 'skills', 'links'
    ],
    requiredSections: ['education', 'experience', 'about', 'skills'],
    buildSteps: ['personal', 'experience', 'education', 'skills', 'aboutMe', 'links', 'decorator', 'finish']
  },
  executive: {
    id: 'executive',
    name: 'Executive Premium',
    availableSections: [
      'education', 'experience', 'about', 'skills', 
      'achievements', 'certificates', 'links'
    ],
    requiredSections: ['experience', 'about', 'skills', 'achievements'],
    buildSteps: ['personal', 'experience', 'education', 'skills', 'aboutMe', 'achievements', 'certificates', 'links', 'decorator', 'finish']
  },
  academic: {
    id: 'academic',
    name: 'Academic Scholar',
    availableSections: [
      'education', 'experience', 'about', 'skills', 
      'achievements', 'certificates', 'projects', 'links'
    ],
    requiredSections: ['education', 'about', 'skills', 'achievements'],
    buildSteps: ['personal', 'education', 'experience', 'skills', 'aboutMe', 'achievements', 'projects', 'certificates', 'links', 'decorator', 'finish']
  }
};

export const getTemplateConfig = (templateId: string): TemplateConfig => {
  return templateConfigs[templateId] || templateConfigs.modern;
};

export const getSectionsForTemplate = (templateId: string) => {
  const config = getTemplateConfig(templateId);
  
  const allSections = [
    { id: 'education', name: 'Education', icon: 'GraduationCap' },
    { id: 'experience', name: 'Work Experience', icon: 'Briefcase' },
    { id: 'about', name: 'About Me', icon: 'Edit3' },
    { id: 'photo', name: 'Photo', icon: 'Image' },
    { id: 'languages', name: 'Languages', icon: 'Languages' },
    { id: 'interests', name: 'Interests', icon: 'Heart' },
    { id: 'skills', name: 'Skills', icon: 'Lightbulb' },
    { id: 'certificates', name: 'Certificates', icon: 'Award' },
    { id: 'links', name: 'Links / Socials', icon: 'Globe' },
    { id: 'achievements', name: 'Achievements', icon: 'Trophy' },
    { id: 'projects', name: 'Projects', icon: 'Code' },
  ];

  return allSections.map(section => ({
    ...section,
    available: config.availableSections.includes(section.id),
    selected: config.requiredSections.includes(section.id),
    required: config.requiredSections.includes(section.id)
  }));
};

export const getBuildStepsForTemplate = (templateId: string, selectedSections: string[]): StepType[] => {
  const config = getTemplateConfig(templateId);
  
  // Filter build steps based on selected sections
  const filteredSteps = config.buildSteps.filter(step => {
    if (step === 'personal' || step === 'decorator' || step === 'finish') return true;
    
    // Map step names to section IDs
    const stepToSectionMap: Record<string, string> = {
      'experience': 'experience',
      'education': 'education',
      'skills': 'skills',
      'aboutMe': 'about',
      'languages': 'languages',
      'interests': 'interests',
      'certificates': 'certificates',
      'achievements': 'achievements',
      'projects': 'projects',
      'links': 'links',
      'photo': 'photo'
    };
    
    const sectionId = stepToSectionMap[step];
    return sectionId ? selectedSections.includes(sectionId) : false;
  });
  
  return filteredSteps;
};