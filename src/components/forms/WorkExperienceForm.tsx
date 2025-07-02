import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Undo2, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  GripVertical,
  Briefcase,
  Sparkles
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { WorkExperience } from '../../types/resume';

const WorkExperienceForm = () => {
  const { state, dispatch } = useResume();
  const { workExperience } = state.resumeData;
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [hasAutoPopulated, setHasAutoPopulated] = useState(false);

  // Auto-populate from extracted CV data
  useEffect(() => {
    if (state.extractedCVData && !hasAutoPopulated && workExperience.length === 0) {
      const cvWorkExperience = state.extractedCVData.work_experience || state.extractedCVData.workExperience;
      
      if (cvWorkExperience && Array.isArray(cvWorkExperience) && cvWorkExperience.length > 0) {
        console.log('Auto-populating work experience from CV data:', cvWorkExperience);
        
        const mappedExperience: WorkExperience[] = cvWorkExperience.map((exp: any, index: number) => {
          // Helper function to parse and format dates
          const parseDate = (dateStr: string): string => {
            if (!dateStr) return '';
            
            // Handle various date formats
            const dateString = dateStr.toString().trim();
            
            // If it's already in MM/YYYY format, return as is
            if (/^\d{2}\/\d{4}$/.test(dateString)) {
              return dateString;
            }
            
            // If it's already in MM-YYYY format, convert to MM/YYYY
            if (/^\d{2}-\d{4}$/.test(dateString)) {
              return dateString.replace('-', '/');
            }
            
            // Handle Month YYYY format (e.g., "January 2020", "Jan 2020")
            const monthYearMatch = dateString.match(/^(\w+)\s+(\d{4})$/i);
            if (monthYearMatch) {
              const monthName = monthYearMatch[1].toLowerCase();
              const year = monthYearMatch[2];
              
              const monthMap: { [key: string]: string } = {
                'january': '01', 'jan': '01',
                'february': '02', 'feb': '02',
                'march': '03', 'mar': '03',
                'april': '04', 'apr': '04',
                'may': '05',
                'june': '06', 'jun': '06',
                'july': '07', 'jul': '07',
                'august': '08', 'aug': '08',
                'september': '09', 'sep': '09', 'sept': '09',
                'october': '10', 'oct': '10',
                'november': '11', 'nov': '11',
                'december': '12', 'dec': '12'
              };
              
              const month = monthMap[monthName] || '01';
              return `${month}/${year}`;
            }
            
            // Handle YYYY-MM format
            if (/^\d{4}-\d{2}$/.test(dateString)) {
              const [year, month] = dateString.split('-');
              return `${month}/${year}`;
            }
            
            // Handle YYYY/MM format
            if (/^\d{4}\/\d{2}$/.test(dateString)) {
              const [year, month] = dateString.split('/');
              return `${month}/${year}`;
            }
            
            // Handle just year (YYYY)
            if (/^\d{4}$/.test(dateString)) {
              return `01/${dateString}`;
            }
            
            // Return as is for other formats
            return dateString;
          };

          // Determine start and end dates from various possible fields
          let startDate = '';
          let endDate = '';
          let isCurrent = false;

          // Check for start_date/end_date fields
          if (exp.start_date) {
            startDate = parseDate(exp.start_date);
          }
          if (exp.end_date) {
            endDate = parseDate(exp.end_date);
            isCurrent = ['present', 'current', 'ongoing'].some(term => 
              exp.end_date.toString().toLowerCase().includes(term)
            );
          }

          // Check for startDate/endDate fields (alternative naming)
          if (!startDate && exp.startDate) {
            startDate = parseDate(exp.startDate);
          }
          if (!endDate && exp.endDate) {
            endDate = parseDate(exp.endDate);
            isCurrent = ['present', 'current', 'ongoing'].some(term => 
              exp.endDate.toString().toLowerCase().includes(term)
            );
          }

          // Check for duration field and try to parse it
          if ((!startDate || !endDate) && exp.duration) {
            const durationStr = exp.duration.toString();
            
            // Try to parse "Month YYYY - Month YYYY" or similar formats
            const durationMatch = durationStr.match(/^(.+?)\s*[-–—]\s*(.+?)$/);
            if (durationMatch) {
              if (!startDate) {
                startDate = parseDate(durationMatch[1].trim());
              }
              if (!endDate) {
                const endPart = durationMatch[2].trim();
                isCurrent = ['present', 'current', 'ongoing'].some(term => 
                  endPart.toLowerCase().includes(term)
                );
                if (!isCurrent) {
                  endDate = parseDate(endPart);
                }
              }
            }
          }

          // Check for dates field (legacy support)
          if ((!startDate || !endDate) && exp.dates) {
            const datesStr = exp.dates.toString();
            const datesMatch = datesStr.match(/^(.+?)\s*[-–—]\s*(.+?)$/);
            if (datesMatch) {
              if (!startDate) {
                startDate = parseDate(datesMatch[1].trim());
              }
              if (!endDate) {
                const endPart = datesMatch[2].trim();
                isCurrent = ['present', 'current', 'ongoing'].some(term => 
                  endPart.toLowerCase().includes(term)
                );
                if (!isCurrent) {
                  endDate = parseDate(endPart);
                }
              }
            }
          }

          return {
            id: `cv-${Date.now()}-${index}`,
            company: exp.company || '',
            position: exp.position || exp.title || exp.role || '',
            startDate: startDate,
            endDate: endDate,
            current: isCurrent,
            description: exp.description || ''
          };
        });

        dispatch({
          type: 'UPDATE_RESUME_DATA',
          payload: { workExperience: mappedExperience }
        });

        setHasAutoPopulated(true);
        console.log('Auto-populated work experience from CV data:', mappedExperience);
        console.log(`Successfully mapped ${mappedExperience.length} work experience entries`);
      }
    }
  }, [state.extractedCVData, hasAutoPopulated, workExperience.length, dispatch]);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedEntries(newExpanded);
  };

  const addNewEntry = () => {
    const newEntry: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };

    const updatedExperience = [...workExperience, newEntry];
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { workExperience: updatedExperience }
    });

    // Auto-expand the new entry
    setExpandedEntries(prev => new Set([...prev, newEntry.id]));
  };

  const updateEntry = (id: string, field: keyof WorkExperience, value: string | boolean) => {
    const updatedExperience = workExperience.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { workExperience: updatedExperience }
    });
  };

  const deleteEntry = (id: string) => {
    const updatedExperience = workExperience.filter(exp => exp.id !== id);
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { workExperience: updatedExperience }
    });
    
    // Remove from expanded set
    const newExpanded = new Set(expandedEntries);
    newExpanded.delete(id);
    setExpandedEntries(newExpanded);
  };

  const confirmEntry = (id: string) => {
    // Collapse the entry after confirming
    const newExpanded = new Set(expandedEntries);
    newExpanded.delete(id);
    setExpandedEntries(newExpanded);
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

    const draggedIndex = workExperience.findIndex(exp => exp.id === draggedItem);
    const targetIndex = workExperience.findIndex(exp => exp.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newExperience = [...workExperience];
    const [draggedEntry] = newExperience.splice(draggedIndex, 1);
    newExperience.splice(targetIndex, 0, draggedEntry);

    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { workExperience: newExperience }
    });

    setDraggedItem(null);
  };

  const enhanceDescription = async (position: string, company: string, currentDescription: string) => {
    try {
      // If there's existing description, enhance it; otherwise create a professional template
      let textToEnhance = currentDescription;
      
      if (!textToEnhance || textToEnhance.trim().length === 0) {
        // Create a basic template if no description exists
        textToEnhance = `Worked as ${position} at ${company}. Responsible for daily tasks and contributing to team objectives.`;
      }
      
      const response = await fetch('/api/ai/rephrase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          text: textToEnhance,
          style: 'professional'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to enhance description');
      }

      const data = await response.json();
      let enhancedText = data.data.rephrasedText;
      
      // Clean up the response if it contains multiple options or explanations
      if (enhancedText.includes('**Option') || enhancedText.includes('Here are a few options')) {
        // Extract the first clean option or create a professional description
        const lines = enhancedText.split('\n');
        for (const line of lines) {
          // Look for lines that start with bullet points or quotes that contain actual content
          if (line.includes('"') && !line.includes('Option') && !line.includes('Key improvements')) {
            const match = line.match(/"([^"]+)"/);
            if (match && match[1].length > 20) {
              enhancedText = match[1];
              break;
            }
          }
        }
        
        // If we couldn't extract a clean option, create a professional one
        if (enhancedText.includes('**Option') || enhancedText.includes('Here are a few options')) {
          enhancedText = `Executed key responsibilities as ${position} at ${company}, contributing to operational excellence through strategic planning and effective collaboration. Managed daily workflows while maintaining high performance standards and delivering measurable results.`;
        }
      }
      
      return enhancedText;
    } catch (error) {
      console.error('Error enhancing description:', error);
      // Fallback to a more professional template
      return `Served as ${position} at ${company}, contributing to organizational goals through dedicated work and professional collaboration. Managed responsibilities efficiently while maintaining high standards of performance and supporting team objectives.`;
    }
  };

  const handleAIGenerate = async (id: string) => {
    const entry = workExperience.find(exp => exp.id === id);
    if (entry && entry.position && entry.company) {
      // Show loading state
      updateEntry(id, 'description', 'Enhancing with AI...');
      
      try {
        const enhancedDescription = await enhanceDescription(
          entry.position, 
          entry.company, 
          entry.description
        );
        updateEntry(id, 'description', enhancedDescription);
      } catch (error) {
        // Restore original description on error
        updateEntry(id, 'description', entry.description);
        console.error('Failed to enhance description:', error);
      }
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
        <h3 className="font-bold text-sm mb-2">STEP 2. WORK EXPERIENCE</h3>
        <p className="text-sm">
          To change the order of entries, drag the position block to swap it with another block.
        </p>
        
        {/* Character Illustration */}
        <div className="absolute -right-2 -top-2">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center">
            <Briefcase className="text-accent text-xl w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Work Experience Entries */}
      <div className="space-y-4 mb-6">
        {workExperience.map((entry, index) => {
          const isExpanded = expandedEntries.has(entry.id);
          const isFirst = index === 0;
          
          return (
            <div
              key={entry.id}
              className={`bg-card border-2 rounded-lg transition-all duration-200 ${
                draggedItem === entry.id ? 'opacity-50' : ''
              } ${isExpanded ? 'border-accent' : 'border-border'}`}
              draggable
              onDragStart={(e) => handleDragStart(e, entry.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, entry.id)}
            >
              {/* Entry Header */}
              <div 
                className="p-4 cursor-pointer flex items-center justify-between hover:bg-background/50 transition-colors"
                onClick={() => toggleExpanded(entry.id)}
              >
                <div className="flex items-center space-x-3">
                  <GripVertical className="w-5 h-5 text-primaryText/50 cursor-grab" />
                  <div>
                    <div className="text-primaryText font-medium">
                      {isFirst && !entry.position ? 'First Entry' : entry.position || 'Position'}
                    </div>
                    <div className="text-primaryText/60 text-sm">
                      {isExpanded ? 'Collapse to hide details' : 'Expand to describe more details'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!isExpanded && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEntry(entry.id);
                      }}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-primaryText" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-primaryText" />
                  )}
                </div>
              </div>

              {/* Expanded Form */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border">
                  <div className="space-y-4 pt-4">
                    {/* Position and Company */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-primaryText text-sm font-medium mb-2">
                          Position <span className="text-accent">*</span>
                        </label>
                        <input
                          type="text"
                          value={entry.position}
                          onChange={(e) => updateEntry(entry.id, 'position', e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div>
                        <label className="block text-primaryText text-sm font-medium mb-2">
                          Company
                        </label>
                        <input
                          type="text"
                          value={entry.company}
                          onChange={(e) => updateEntry(entry.id, 'company', e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                          placeholder="Tech Company Inc."
                        />
                      </div>
                    </div>

                    {/* Job Description */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-primaryText text-sm font-medium">
                          Job Description & Responsibilities
                        </label>
                        <button
                          onClick={() => handleAIGenerate(entry.id)}
                          disabled={!entry.position || !entry.company}
                          className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                            entry.position && entry.company
                              ? 'bg-accent text-background hover:bg-accent/90'
                              : 'bg-border text-primaryText/50 cursor-not-allowed'
                          }`}
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>AI Enhance</span>
                        </button>
                      </div>
                      <textarea
                        value={entry.description}
                        onChange={(e) => updateEntry(entry.id, 'description', e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                        placeholder="Describe your key responsibilities, daily tasks, achievements, and workflow. Include specific projects, technologies used, and measurable results. Click 'AI Enhance' to polish your description with professional language and industry-specific terminology."
                      />
                    </div>

                    {/* Start Date and End Date */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-primaryText text-sm font-medium mb-2">
                          Start Date
                        </label>
                        <input
                          type="text"
                          value={entry.startDate}
                          onChange={(e) => updateEntry(entry.id, 'startDate', e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                          placeholder="MM/YYYY"
                        />
                      </div>
                      <div>
                        <label className="block text-primaryText text-sm font-medium mb-2">
                          End Date
                        </label>
                        <input
                          type="text"
                          value={entry.current ? 'present' : entry.endDate}
                          onChange={(e) => updateEntry(entry.id, 'endDate', e.target.value)}
                          disabled={entry.current}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50"
                          placeholder="present"
                        />
                        <label className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            checked={entry.current}
                            onChange={(e) => {
                              updateEntry(entry.id, 'current', e.target.checked);
                              if (e.target.checked) {
                                updateEntry(entry.id, 'endDate', '');
                              }
                            }}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded border-2 mr-2 flex items-center justify-center ${
                            entry.current ? 'border-accent bg-accent' : 'border-border'
                          }`}>
                            {entry.current && <div className="w-2 h-2 bg-background rounded-sm" />}
                          </div>
                          <span className="text-primaryText text-sm">I currently work here</span>
                        </label>
                      </div>
                    </div>

                    {/* Confirm Button */}
                    <button
                      onClick={() => confirmEntry(entry.id)}
                      className="w-full bg-accent hover:bg-accent/90 text-background py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                    >
                      CONFIRM
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="w-full bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-background py-2 rounded-lg font-semibold transition-all duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add Another Entry Button */}
        <button
          onClick={addNewEntry}
          className="w-full border-2 border-dashed border-border hover:border-accent text-primaryText hover:text-accent py-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 group"
        >
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Add another entry</span>
        </button>
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

export default WorkExperienceForm;