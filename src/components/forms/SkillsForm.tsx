import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Undo2, 
  Plus, 
  X, 
  GripVertical,
  Lightbulb,
  Circle,
  Sparkles,
  Check,
  RefreshCw,
  Brain,
  ChevronDown,
  ChevronRight,
  List,
  TreePine
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useAuth } from '../../context/AuthContext';
import { Skill } from '../../types/resume';

const SkillsForm = () => {
  const { state, dispatch } = useResume();
  const { token } = useAuth();
  const { skills, skillsConfig } = state.resumeData;
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(3);
  const [skillPosition, setSkillPosition] = useState<'left' | 'right'>(skillsConfig?.position || 'left');
  const [skillStyle, setSkillStyle] = useState<'dots' | 'pills' | 'bars'>(skillsConfig?.style || 'dots');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [hasAutoPopulated, setHasAutoPopulated] = useState(false);
  
  // AI Suggestion states
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [hasTriggeredAISuggestions, setHasTriggeredAISuggestions] = useState(false);

  // Tree view states
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list');
  const [treeData, setTreeData] = useState<Record<string, string[]>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

        // Auto-populate from extracted CV data
  useEffect(() => {
    if (state.extractedCVData && !hasAutoPopulated && skills.length === 0) {
      const cvSkills = state.extractedCVData.skills;
      
      console.log('SkillsForm: Checking for skills in extracted CV data');
      console.log('Raw skills data:', cvSkills);
      console.log('Is array?', Array.isArray(cvSkills));
      console.log('Length:', cvSkills?.length);
      
      if (cvSkills && Array.isArray(cvSkills) && cvSkills.length > 0) {
        console.log('Auto-populating skills from CV data:', cvSkills);
        
        const mappedSkills: Skill[] = cvSkills.map((skill: any, index: number) => {
          const skillName = typeof skill === 'string' ? skill : (skill.name || skill.skill || '');
          const skillLevel = typeof skill === 'object' && skill.level ? 
                Math.min(Math.max(skill.level, 1), 5) : 
                4; // Default to level 4 for extracted skills
          const skillCategory = typeof skill === 'object' && skill.category ? skill.category : 'Technical Skills';
          
          console.log(`Processing skill ${index}: "${skillName}" (level: ${skillLevel}, category: ${skillCategory})`);
          
          return {
            id: `cv-skill-${Date.now()}-${index}`,
            name: skillName,
            level: skillLevel,
            category: skillCategory
          };
        }).filter((skill: Skill) => skill.name.trim() !== '');

        console.log('Mapped skills:', mappedSkills);

        if (mappedSkills.length > 0) {
          dispatch({
            type: 'UPDATE_RESUME_DATA',
            payload: { skills: mappedSkills }
          });

          setHasAutoPopulated(true);
          console.log('Successfully auto-populated skills from CV data:', mappedSkills);
          
          // Check if skills are properly categorized (more than 1 category means AI categorization worked)
          const categories = [...new Set(mappedSkills.map(skill => skill.category).filter(Boolean))];
          console.log('Skills organized into categories:', categories);
          
          if (categories.length === 1 && categories[0] === 'Technical Skills' && mappedSkills.length > 10) {
            console.log('All skills are in one generic category, this suggests AI categorization may not have worked properly during CV parsing');
            console.log('Skills will be available for manual AI organization using the "AI Organize" button');
          } else if (categories.length >= 6) {
            console.log(`✓ Skills are well-categorized into ${categories.length} categories!`);
          }
        } else {
          console.log('No valid skills after mapping, triggering AI suggestions');
          setHasAutoPopulated(true);
          if (!hasTriggeredAISuggestions) {
            generateAISuggestions();
            setHasTriggeredAISuggestions(true);
          }
        }
      } else {
        console.log('No skills found in CV data, triggering AI suggestions');
        // No skills found in CV - trigger AI suggestions
        setHasAutoPopulated(true);
        if (!hasTriggeredAISuggestions) {
          generateAISuggestions();
          setHasTriggeredAISuggestions(true);
        }
      }
    } else if (!hasAutoPopulated && skills.length === 0 && !hasTriggeredAISuggestions) {
      console.log('No extracted CV data and no skills, triggering AI suggestions');
      // No extracted CV data and no skills - show AI suggestions
      setHasAutoPopulated(true);
      generateAISuggestions();
      setHasTriggeredAISuggestions(true);
    }
  }, [state.extractedCVData, hasAutoPopulated, skills.length, hasTriggeredAISuggestions]);

  const generateAISuggestions = async () => {
    try {
      setIsGeneratingSuggestions(true);
      
      const response = await fetch('/api/ai/suggest-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          workExperience: state.resumeData.workExperience || [],
          position: state.resumeData.personalInfo?.position || '',
          education: state.resumeData.education || []
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiSuggestions(data.data.suggestedSkills);
        setShowAISuggestions(true);
        setSelectedSuggestions(new Set());
        console.log('Generated AI skill suggestions:', data.data.suggestedSkills);
      } else {
        console.error('Failed to generate skill suggestions');
      }
    } catch (error) {
      console.error('Error generating skill suggestions:', error);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const regenerateRemainingSkills = async () => {
    try {
      setIsGeneratingSuggestions(true);
      
      const response = await fetch('/api/ai/suggest-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          workExperience: state.resumeData.workExperience || [],
          position: state.resumeData.personalInfo?.position || '',
          education: state.resumeData.education || []
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newSuggestions = data.data.suggestedSkills;
        
        // Replace unselected suggestions with new ones
        const updatedSuggestions = aiSuggestions.map((suggestion, index) => {
          if (selectedSuggestions.has(suggestion)) {
            return suggestion; // Keep selected ones
          } else {
            // Replace with new suggestion, cycling through if needed
            const newIndex = index % newSuggestions.length;
            return newSuggestions[newIndex];
          }
        });
        
        setAiSuggestions(updatedSuggestions);
        console.log('Regenerated remaining skill suggestions:', updatedSuggestions);
      }
    } catch (error) {
      console.error('Error regenerating skill suggestions:', error);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const toggleSuggestionSelection = (suggestion: string) => {
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(suggestion)) {
      newSelected.delete(suggestion);
    } else {
      newSelected.add(suggestion);
    }
    setSelectedSuggestions(newSelected);
  };

  const applySelectedSuggestions = () => {
    const selectedSkillsArray = Array.from(selectedSuggestions);
    const newSkills: Skill[] = selectedSkillsArray.map((skillName, index) => ({
      id: `ai-skill-${Date.now()}-${index}`,
      name: skillName,
      level: 4 // Default to good level for AI suggestions
    }));

    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { skills: [...skills, ...newSkills] }
    });

    // Hide AI suggestions after applying
    setShowAISuggestions(false);
    setAiSuggestions([]);
    setSelectedSuggestions(new Set());
  };

  const dismissAISuggestions = () => {
    setShowAISuggestions(false);
    setAiSuggestions([]);
    setSelectedSuggestions(new Set());
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Check if a skill appears in multiple categories
  const getSkillCategoryCount = (skillName: string): number => {
    let count = 0;
    Object.values(treeData).forEach(skillsInCategory => {
      if (skillsInCategory.includes(skillName)) {
        count++;
      }
    });
    return count;
  };

  // Get all categories a skill appears in
  const getSkillCategories = (skillName: string): string[] => {
    const categories: string[] = [];
    Object.entries(treeData).forEach(([category, skillsInCategory]) => {
      if (skillsInCategory.includes(skillName)) {
        categories.push(category);
      }
    });
    return categories;
  };

  const switchToListView = () => {
    // Convert category skills back to individual skills if we have tree data
    if (viewMode === 'tree' && Object.keys(treeData).length > 0) {
      const individualSkills: Skill[] = [];
      const seenSkills = new Set<string>(); // Track seen skills to avoid duplicates
      let index = 0;
      
      Object.entries(treeData).forEach(([category, skillNames]) => {
        skillNames.forEach(skillName => {
          // Only add skill if we haven't seen it before (deduplication)
          if (!seenSkills.has(skillName)) {
            seenSkills.add(skillName);
            individualSkills.push({
              id: `skill-${Date.now()}-${index++}`,
              name: skillName,
              level: 4, // Default level
              category: category
            });
          }
        });
      });
      
      console.log(`Converting tree view to list view: ${individualSkills.length} unique skills from ${Object.keys(treeData).length} categories`);
      console.log('Unique skills:', individualSkills.map(s => s.name));
      
      dispatch({
        type: 'UPDATE_RESUME_DATA',
        payload: { skills: individualSkills }
      });
    }
    
    setViewMode('list');
    setTreeData({});
    setExpandedCategories(new Set());
  };

  const addSkill = () => {
    if (newSkillName.trim()) {
      const newSkill: Skill = {
        id: `skill-${Date.now()}`,
        name: newSkillName.trim(),
        level: 4,
        category: viewMode === 'tree' ? 'Skill Categories' : 'Technical Skills'
      };
      
      dispatch({
        type: 'UPDATE_RESUME_DATA',
        payload: { 
          skills: [...skills, newSkill] 
        }
      });
      
      setNewSkillName('');
    }
  };

  // Group skills by category for display
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Technical Skills';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categoryOrder = [
    'Systems Administration',
    'Networking', 
    'Virtualization',
    'Programming Languages',
    'Cloud Technologies',
    'Database Management',
    'Security',
    'Project Management',
    'Technical Skills',
    'Additional Skills'
  ];

  // Sort categories based on predefined order, with unknowns at the end
  const sortedCategories = Object.keys(groupedSkills).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

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
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-primaryText font-medium">Skills</h4>
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            {(skills.length > 0 || Object.keys(treeData).length > 0) && (
              <div className="flex items-center bg-background border border-border rounded-lg p-1">
                <button
                  onClick={() => switchToListView()}
                  className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-accent text-background' 
                      : 'text-primaryText/60 hover:text-primaryText'
                  }`}
                >
                  <List className="w-3 h-3" />
                  <span>List</span>
                </button>
                <button
                  onClick={() => setViewMode('tree')}
                  disabled={Object.keys(treeData).length === 0}
                  className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    viewMode === 'tree' 
                      ? 'bg-accent text-background' 
                      : 'text-primaryText/60 hover:text-primaryText'
                  }`}
                >
                  <TreePine className="w-3 h-3" />
                  <span>Tree</span>
                </button>
              </div>
            )}
            
            {/* AI Organize Button */}
            {skills.length > 0 && viewMode === 'list' && (
              <button
                onClick={async () => {
                  try {
                    setIsGeneratingSuggestions(true);
                    console.log('Manually triggering AI skill categorization...');
                    
                    const response = await fetch('/api/ai/recategorize-skills', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        skills: skills.map(s => s.name),
                      }),
                    });

                    if (response.ok) {
                      const data = await response.json();
                      const categorizedSkills = data.data.categorizedSkills;
                      
                      // Create tree data structure with cross-categorization support
                      const newTreeData: Record<string, string[]> = {};
                      const skillCounts: Record<string, number> = {};
                      
                      // Process categorized skills (skills can appear in multiple categories)
                      categorizedSkills.forEach((skill: any) => {
                        const category = skill.category || 'Technical Skills';
                        const skillName = skill.name;
                        
                        // Initialize category if it doesn't exist
                        if (!newTreeData[category]) {
                          newTreeData[category] = [];
                          skillCounts[category] = 0;
                        }
                        
                        // Add skill to category if not already present
                        if (!newTreeData[category].includes(skillName)) {
                          newTreeData[category].push(skillName);
                          skillCounts[category]++;
                        }
                      });
                      
                      // Sort skills within each category
                      Object.keys(newTreeData).forEach(category => {
                        newTreeData[category].sort();
                      });
                      
                      // Convert categories to main skills (only category names become skills)
                      const categorySkills: Skill[] = Object.keys(newTreeData)
                        .sort() // Sort categories alphabetically
                        .map((category, index) => ({
                          id: `category-${Date.now()}-${index}`,
                          name: category,
                          level: 4, // Default level for categories
                          category: 'Skill Categories'
                        }));
                      
                      // Update state
                      setTreeData(newTreeData);
                      setViewMode('tree');
                      setExpandedCategories(new Set(Object.keys(newTreeData))); // Expand all by default
                      
                      dispatch({
                        type: 'UPDATE_RESUME_DATA',
                        payload: { skills: categorySkills }
                      });
                      
                      console.log('Skills organized into tree view with granular categories and cross-categorization');
                      console.log('Tree data:', newTreeData);
                      console.log('Category counts:', skillCounts);
                      console.log('Category skills for CV:', categorySkills);
                    }
                  } catch (error) {
                    console.error('Error re-categorizing skills:', error);
                  } finally {
                    setIsGeneratingSuggestions(false);
                  }
                }}
                disabled={isGeneratingSuggestions}
                className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-lg transition-colors disabled:opacity-50 ${
                  sortedCategories.length === 1 && skills.length > 10 
                    ? 'bg-accent text-background hover:bg-accent/90 font-medium animate-pulse' 
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                }`}
              >
                <Brain className="w-3 h-3" />
                <span>
                  {sortedCategories.length === 1 && skills.length > 10 
                    ? 'Organize into Categories' 
                    : 'AI Organize'}
                </span>
                {isGeneratingSuggestions && <RefreshCw className="w-3 h-3 animate-spin" />}
              </button>
            )}
          </div>
        </div>

        {/* AI Organization Suggestion */}
        {viewMode === 'list' && sortedCategories.length === 1 && sortedCategories[0] === 'Technical Skills' && skills.length > 10 && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h5 className="text-yellow-800 font-medium mb-1">Organize Your Skills</h5>
                <p className="text-yellow-700 text-sm mb-3">
                  You have {skills.length} skills in one category. Click "Organize into Categories" to automatically group them into 6-8 professional skill categories that will make your CV stand out.
                </p>
                <div className="text-yellow-600 text-xs">
                  This will create categories like "System Administration", "Networking", "Programming", etc.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conditional View Rendering */}
        {viewMode === 'list' ? (
          /* List View */
          <div className="space-y-6">
            {sortedCategories.map((category) => (
              <div key={category} className="border border-border/50 rounded-lg p-4 bg-card/50">
                <h5 className="text-accent font-semibold mb-3 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>{category}</span>
                  <span className="text-xs text-primaryText/60 font-normal">({groupedSkills[category].length})</span>
                </h5>
                <div className="space-y-3">
                  {groupedSkills[category].map((skill) => (
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
            ))}
          </div>
        ) : (
          /* Tree View */
          <div className="space-y-3">
            {skills.map((categorySkill) => {
              const category = categorySkill.name;
              const childSkills = treeData[category] || [];
              const isExpanded = expandedCategories.has(category);
              
              return (
                <div key={categorySkill.id} className="border border-border rounded-lg bg-card">
                  {/* Category Skill (Main skill that goes to CV) */}
                  <div
                    className={`p-4 transition-all duration-200 ${
                      draggedItem === categorySkill.id ? 'opacity-50' : ''
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, categorySkill.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, categorySkill.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <GripVertical className="w-4 h-4 text-primaryText/50 cursor-grab" />
                        
                        {/* Expand/Collapse Button */}
                        <button
                          onClick={() => toggleCategory(category)}
                          className="p-1 hover:bg-background/50 rounded transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-primaryText/60" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-primaryText/60" />
                          )}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-primaryText font-semibold">{categorySkill.name}</span>
                              <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                                CV Skill
                              </span>
                              <span className="text-xs text-primaryText/60">
                                ({childSkills.length} items)
                              </span>
                            </div>
                            <button
                              onClick={() => removeSkill(categorySkill.id)}
                              className="text-red-500 hover:text-red-400 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {/* Skill Level Selector for Category */}
                          <div className="flex items-center space-x-3">
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                  key={level}
                                  onClick={() => updateSkillLevel(categorySkill.id, level)}
                                  className={`w-6 h-6 rounded-full border-2 transition-colors ${
                                    level <= categorySkill.level
                                      ? 'border-accent bg-accent text-background'
                                      : 'border-border text-primaryText/50 hover:border-accent/50'
                                  }`}
                                >
                                  <span className="text-xs font-bold">{level}</span>
                                </button>
                              ))}
                            </div>
                            <div className="ml-auto">
                              {renderSkillLevel(categorySkill.level, skillStyle)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Child Skills (Reference only - not added to CV) */}
                  {isExpanded && childSkills.length > 0 && (
                    <div className="border-t border-border/50 bg-background/30">
                      <div className="p-4">
                        <div className="text-xs text-primaryText/60 mb-3 font-medium">
                          Reference Skills (not added to CV):
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {childSkills.map((skillName, index) => {
                            const categoryCount = getSkillCategoryCount(skillName);
                            const allCategories = getSkillCategories(skillName);
                            const otherCategories = allCategories.filter(cat => cat !== category);
                            
                            return (
                              <div
                                key={index}
                                className="flex items-center space-x-2 p-2 bg-background/50 rounded border border-border/30 relative group"
                              >
                                <div className="w-1.5 h-1.5 bg-primaryText/40 rounded-full"></div>
                                <span className="text-sm text-primaryText/80 flex-1">{skillName}</span>
                                
                                {/* Cross-categorization indicator */}
                                {categoryCount > 1 && (
                                  <div className="flex items-center space-x-1">
                                    <div className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                      {categoryCount}
                                    </div>
                                    
                                    {/* Tooltip on hover */}
                                    <div className="absolute hidden group-hover:block bg-background border border-border rounded-lg p-2 shadow-lg z-10 bottom-full left-0 mb-1 min-w-max">
                                      <div className="text-xs text-primaryText/80 font-medium mb-1">
                                        Also appears in:
                                      </div>
                                      <div className="text-xs text-primaryText/60">
                                        {otherCategories.join(', ')}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Skill */}
      <div className="border border-border rounded-lg p-4 bg-card">
        <h4 className="text-primaryText font-medium mb-3">
          {viewMode === 'tree' ? 'Add Category Skill' : 'Add New Skill'}
        </h4>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder={viewMode === 'tree' ? 'e.g., Database Management, Cloud Computing' : 'e.g., JavaScript, Python, Adobe Photoshop'}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-primaryText placeholder-primaryText/50 focus:outline-none focus:ring-2 focus:ring-accent"
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            {viewMode === 'tree' && (
              <p className="text-xs text-primaryText/60 mt-1">
                Add a skill category that will appear in your CV
              </p>
            )}
          </div>
          
          <button
            onClick={addSkill}
            disabled={!newSkillName.trim()}
            className="flex items-center space-x-2 px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>{viewMode === 'tree' ? 'Add Category' : 'Add Skill'}</span>
          </button>
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

      {/* AI Skill Suggestions */}
      {showAISuggestions && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-blue-800 font-medium flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>AI Skill Suggestions</span>
            </h4>
            <button
              onClick={dismissAISuggestions}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-blue-700 text-sm mb-4">
            Based on your profile, here are suggested skills. Select the ones you want to add:
          </p>

          {isGeneratingSuggestions ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2 text-blue-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating suggestions...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-2 mb-4">
                {aiSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => toggleSuggestionSelection(suggestion)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedSuggestions.has(suggestion)
                        ? 'border-blue-500 bg-blue-100 text-blue-800'
                        : 'border-blue-200 hover:border-blue-300 text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{suggestion}</span>
                      {selectedSuggestions.has(suggestion) && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between space-x-2">
                <button
                  onClick={regenerateRemainingSkills}
                  disabled={isGeneratingSuggestions}
                  className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Regenerate Unselected</span>
                </button>

                <div className="flex space-x-2">
                  <button
                    onClick={dismissAISuggestions}
                    className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Skip
                  </button>
                  <button
                    onClick={applySelectedSuggestions}
                    disabled={selectedSuggestions.size === 0}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedSuggestions.size > 0
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Add Selected ({selectedSuggestions.size})
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Manual AI Suggestion Trigger */}
      {!showAISuggestions && skills.length === 0 && (
        <div className="mb-6 text-center">
          <button
            onClick={generateAISuggestions}
            disabled={isGeneratingSuggestions}
            className="flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-accent/90 text-background rounded-lg font-medium transition-all duration-200 hover:scale-105 mx-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Get AI Skill Suggestions</span>
          </button>
        </div>
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

export default SkillsForm;