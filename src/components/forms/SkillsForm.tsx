import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Undo2, 
  Plus, 
  X, 
  GripVertical,
  Lightbulb,
  Circle
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { Skill } from '../../types/resume';

const SkillsForm = () => {
  const { state, dispatch } = useResume();
  const { skills, skillsConfig } = state.resumeData;
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(3);
  const [skillPosition, setSkillPosition] = useState<'left' | 'right'>(skillsConfig?.position || 'left');
  const [skillStyle, setSkillStyle] = useState<'dots' | 'pills' | 'bars'>(skillsConfig?.style || 'dots');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [hasAutoPopulated, setHasAutoPopulated] = useState(false);

  // Auto-populate from extracted CV data
  useEffect(() => {
    if (state.extractedCVData && !hasAutoPopulated && skills.length === 0) {
      const cvSkills = state.extractedCVData.skills;
      
      if (cvSkills && Array.isArray(cvSkills) && cvSkills.length > 0) {
        const mappedSkills: Skill[] = cvSkills.map((skill: any, index: number) => ({
          id: `cv-skill-${Date.now()}-${index}`,
          name: typeof skill === 'string' ? skill : (skill.name || skill.skill || ''),
          level: typeof skill === 'object' && skill.level ? 
                Math.min(Math.max(skill.level, 1), 5) : 
                3 // Default level
        })).filter((skill: Skill) => skill.name.trim() !== '');

        if (mappedSkills.length > 0) {
          dispatch({
            type: 'UPDATE_RESUME_DATA',
            payload: { skills: mappedSkills }
          });

          setHasAutoPopulated(true);
          console.log('Auto-populated skills from CV data:', mappedSkills);
        }
      }
    }
  }, [state.extractedCVData, hasAutoPopulated, skills.length, dispatch]);

  const addSkill = () => {
    if (newSkillName.trim()) {
      const newSkill: Skill = {
        id: Date.now().toString(),
        name: newSkillName.trim(),
        level: newSkillLevel
      };

      const updatedSkills = [...skills, newSkill];
      dispatch({
        type: 'UPDATE_RESUME_DATA',
        payload: { skills: updatedSkills }
      });

      setNewSkillName('');
      setNewSkillLevel(3);
    }
  };

  const removeSkill = (id: string) => {
    const updatedSkills = skills.filter(skill => skill.id !== id);
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { skills: updatedSkills }
    });
  };

  const updateSkillLevel = (id: string, level: number) => {
    const updatedSkills = skills.map(skill =>
      skill.id === id ? { ...skill, level } : skill
    );
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { skills: updatedSkills }
    });
  };

  const updateSkillsConfig = (config: Partial<{ style: 'dots' | 'pills' | 'bars'; position: 'left' | 'right' }>) => {
    const currentConfig = skillsConfig || { style: 'dots' as const, position: 'left' as const };
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { 
        skillsConfig: { 
          ...currentConfig, 
          ...config 
        } 
      }
    });
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = skills.findIndex(skill => skill.id === draggedItem);
    const targetIndex = skills.findIndex(skill => skill.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newSkills = [...skills];
    const [draggedSkill] = newSkills.splice(draggedIndex, 1);
    newSkills.splice(targetIndex, 0, draggedSkill);

    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { skills: newSkills }
    });

    setDraggedItem(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addSkill();
    }
  };

  const renderSkillLevel = (level: number, style: string) => {
    switch (style) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((dot) => (
              <Circle
                key={dot}
                className={`w-3 h-3 ${
                  dot <= level ? 'fill-accent text-accent' : 'text-border'
                }`}
              />
            ))}
          </div>
        );
      case 'bars':
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((bar) => (
              <div
                key={bar}
                className={`w-2 h-4 rounded-sm ${
                  bar <= level ? 'bg-accent' : 'bg-border'
                }`}
              />
            ))}
          </div>
        );
      case 'pills':
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((pill) => (
              <div
                key={pill}
                className={`w-4 h-2 rounded-full ${
                  pill <= level ? 'bg-accent' : 'bg-border'
                }`}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
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

  return (
    <div className="max-w-md mx-auto">
      {/* Info Box */}
      <div className="bg-accent text-background p-4 rounded-lg mb-8 relative">
        <h3 className="font-bold text-sm mb-2">STEP 4. SKILLS</h3>
        <p className="text-sm">
          List skills most relevant to the position you're applying for. Press X to delete, drag to reorder.
        </p>
        
        {/* Character Illustration */}
        <div className="absolute -right-2 -top-2">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center">
            <Lightbulb className="text-accent w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Current Skills */}
      <div className="mb-6">
        <h4 className="text-primaryText font-medium mb-4">Skills</h4>
        <div className="space-y-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className={`bg-card border border-border rounded-lg p-3 transition-all duration-200 ${
                draggedItem === skill.id ? 'opacity-50' : ''
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, skill.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, skill.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <GripVertical className="w-4 h-4 text-primaryText/50 cursor-grab" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-primaryText font-medium">{skill.name}</span>
                      <button
                        onClick={() => removeSkill(skill.id)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Skill Level Selector */}
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            onClick={() => updateSkillLevel(skill.id, level)}
                            className={`w-6 h-6 rounded-full border-2 transition-colors ${
                              level <= skill.level
                                ? 'border-accent bg-accent text-background'
                                : 'border-border text-primaryText/50 hover:border-accent/50'
                            }`}
                          >
                            <span className="text-xs font-bold">{level}</span>
                          </button>
                        ))}
                      </div>
                      <div className="ml-auto">
                        {renderSkillLevel(skill.level, skillStyle)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Skill */}
      <div className="mb-6">
        <h4 className="text-primaryText font-medium mb-4">Add Skill</h4>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter skill name"
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            <button
              onClick={addSkill}
              disabled={!newSkillName.trim()}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                newSkillName.trim()
                  ? 'bg-accent hover:bg-accent/90 text-background hover:scale-105'
                  : 'bg-border text-primaryText/50 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Skill Level Selector for New Skill */}
          <div>
            <label className="block text-primaryText text-sm font-medium mb-2">
              Skill Level
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setNewSkillLevel(level)}
                  className={`w-8 h-8 rounded-full border-2 transition-colors ${
                    level <= newSkillLevel
                      ? 'border-accent bg-accent text-background'
                      : 'border-border text-primaryText/50 hover:border-accent/50'
                  }`}
                >
                  <span className="text-sm font-bold">{level}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-primaryText/60 mt-1">
              <span>Beginner</span>
              <span>Expert</span>
            </div>
          </div>
        </div>
      </div>

      {/* Position Settings */}
      <div className="mb-6">
        <h4 className="text-primaryText font-medium mb-3">Position</h4>
        <div className="flex space-x-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="position"
              value="left"
              checked={skillPosition === 'left'}
              onChange={(e) => {
                const position = e.target.value as 'left' | 'right';
                setSkillPosition(position);
                updateSkillsConfig({ position });
              }}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 mr-2 ${
              skillPosition === 'left' 
                ? 'border-accent bg-accent' 
                : 'border-border'
            }`}>
              {skillPosition === 'left' && <div className="w-2 h-2 bg-background rounded-full m-0.5" />}
            </div>
            <span className="text-primaryText text-sm">Left</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="position"
              value="right"
              checked={skillPosition === 'right'}
              onChange={(e) => {
                const position = e.target.value as 'left' | 'right';
                setSkillPosition(position);
                updateSkillsConfig({ position });
              }}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 mr-2 ${
              skillPosition === 'right' 
                ? 'border-accent bg-accent' 
                : 'border-border'
            }`}>
              {skillPosition === 'right' && <div className="w-2 h-2 bg-background rounded-full m-0.5" />}
            </div>
            <span className="text-primaryText text-sm">Right</span>
          </label>
        </div>
      </div>

      {/* Style Settings */}
      <div className="mb-8">
        <h4 className="text-primaryText font-medium mb-3">Styles</h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center">
              <input
                type="radio"
                name="style"
                value="dots"
                checked={skillStyle === 'dots'}
                onChange={(e) => {
                  const style = e.target.value as 'dots' | 'pills' | 'bars';
                  setSkillStyle(style);
                  updateSkillsConfig({ style });
                }}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                skillStyle === 'dots' 
                  ? 'border-accent bg-accent' 
                  : 'border-border'
              }`}>
                {skillStyle === 'dots' && <div className="w-2 h-2 bg-background rounded-full m-0.5" />}
              </div>
              <span className="text-primaryText text-sm">Dots</span>
            </div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((dot) => (
                <Circle
                  key={dot}
                  className={`w-2 h-2 ${
                    dot <= 3 ? 'fill-accent text-accent' : 'text-border'
                  }`}
                />
              ))}
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center">
              <input
                type="radio"
                name="style"
                value="pills"
                checked={skillStyle === 'pills'}
                onChange={(e) => {
                  const style = e.target.value as 'dots' | 'pills' | 'bars';
                  setSkillStyle(style);
                  updateSkillsConfig({ style });
                }}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                skillStyle === 'pills' 
                  ? 'border-accent bg-accent' 
                  : 'border-border'
              }`}>
                {skillStyle === 'pills' && <div className="w-2 h-2 bg-background rounded-full m-0.5" />}
              </div>
              <span className="text-primaryText text-sm">Pills</span>
            </div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((pill) => (
                <div
                  key={pill}
                  className={`w-3 h-1.5 rounded-full ${
                    pill <= 3 ? 'bg-accent' : 'bg-border'
                  }`}
                />
              ))}
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center">
              <input
                type="radio"
                name="style"
                value="bars"
                checked={skillStyle === 'bars'}
                onChange={(e) => {
                  const style = e.target.value as 'dots' | 'pills' | 'bars';
                  setSkillStyle(style);
                  updateSkillsConfig({ style });
                }}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                skillStyle === 'bars' 
                  ? 'border-accent bg-accent' 
                  : 'border-border'
              }`}>
                {skillStyle === 'bars' && <div className="w-2 h-2 bg-background rounded-full m-0.5" />}
              </div>
              <span className="text-primaryText text-sm">Bars</span>
            </div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((bar) => (
                <div
                  key={bar}
                  className={`w-1.5 h-3 rounded-sm ${
                    bar <= 3 ? 'bg-accent' : 'bg-border'
                  }`}
                />
              ))}
            </div>
          </label>
        </div>
      </div>

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

export default SkillsForm;