import React, { useState } from 'react';
import { 
  ArrowRight, 
  Undo2, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  GripVertical,
  GraduationCap,
  School,
  Building2,
  Wrench,
  BookOpen
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { Education } from '../../types/resume';

const EducationForm = () => {
  const { state, dispatch } = useResume();
  const { education } = state.resumeData;
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const educationTypes = [
    { id: 'high-school', name: 'High School', icon: School },
    { id: 'university', name: 'University', icon: GraduationCap },
    { id: 'technical', name: 'Technical School', icon: Wrench },
    { id: 'other', name: 'Other', icon: BookOpen }
  ];

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedEntries(newExpanded);
  };

  const addNewEntry = (type: string) => {
    const newEntry: Education = {
      id: Date.now().toString(),
      type: type,
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      additionalInfo: ''
    };

    const updatedEducation = [...education, newEntry];
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { education: updatedEducation }
    });

    // Auto-expand the new entry
    setExpandedEntries(prev => new Set([...prev, newEntry.id]));
  };

  const updateEntry = (id: string, field: keyof Education, value: string | boolean) => {
    const updatedEducation = education.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { education: updatedEducation }
    });
  };

  const deleteEntry = (id: string) => {
    const updatedEducation = education.filter(edu => edu.id !== id);
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { education: updatedEducation }
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

    const draggedIndex = education.findIndex(edu => edu.id === draggedItem);
    const targetIndex = education.findIndex(edu => edu.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newEducation = [...education];
    const [draggedEntry] = newEducation.splice(draggedIndex, 1);
    newEducation.splice(targetIndex, 0, draggedEntry);

    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { education: newEducation }
    });

    setDraggedItem(null);
  };

  const getFieldsForType = (type: string) => {
    switch (type) {
      case 'high-school':
        return {
          primaryField: 'Full School Name',
          secondaryField: 'Class Profile',
          showField: false
        };
      case 'university':
        return {
          primaryField: 'Full University Name',
          secondaryField: 'Major',
          thirdField: 'Additional Information',
          showField: true
        };
      case 'technical':
        return {
          primaryField: 'Full School Name',
          secondaryField: 'Professional Title',
          showField: false
        };
      case 'other':
        return {
          primaryField: 'Full Institution Name',
          secondaryField: 'Title',
          showField: false
        };
      default:
        return {
          primaryField: 'Institution Name',
          secondaryField: 'Degree/Title',
          showField: false
        };
    }
  };

  const getEntryDisplayName = (entry: Education) => {
    const typeObj = educationTypes.find(t => t.id === entry.type);
    return typeObj ? typeObj.name : 'Education Entry';
  };

  const getEntryIcon = (type: string) => {
    const typeObj = educationTypes.find(t => t.id === type);
    return typeObj ? typeObj.icon : BookOpen;
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
        <h3 className="font-bold text-sm mb-2">STEP 3. EDUCATION</h3>
        <p className="text-sm">
          Drag blocks to change their order. Add your education history, starting with the most recent events.
        </p>
        
        {/* Character Illustration */}
        <div className="absolute -right-2 -top-2">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center">
            <GraduationCap className="text-accent w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Education Type Selection */}
      {education.length === 0 && (
        <div className="mb-8">
          <h4 className="text-primaryText font-medium mb-4">Select the type of education to add</h4>
          <div className="grid grid-cols-2 gap-3">
            {educationTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => addNewEntry(type.id)}
                  className="bg-card border-2 border-dashed border-border hover:border-accent text-primaryText hover:text-accent py-4 px-3 rounded-lg transition-all duration-200 flex flex-col items-center space-y-2 group"
                >
                  <IconComponent className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{type.name}</span>
                  <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Education Entries */}
      <div className="space-y-4 mb-6">
        {education.map((entry, index) => {
          const isExpanded = expandedEntries.has(entry.id);
          const fields = getFieldsForType(entry.type);
          const EntryIcon = getEntryIcon(entry.type);
          
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
                  <EntryIcon className="w-5 h-5 text-accent" />
                  <div>
                    <div className="text-primaryText font-medium">
                      {getEntryDisplayName(entry)} {entry.institution && `- ${entry.institution}`}
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
                    {/* Primary Field (Institution Name) */}
                    <div>
                      <label className="block text-primaryText text-sm font-medium mb-2">
                        {fields.primaryField} <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        value={entry.institution}
                        onChange={(e) => updateEntry(entry.id, 'institution', e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder={entry.type === 'high-school' ? 'Lincoln High School' : entry.type === 'university' ? 'Harvard University' : 'Institution Name'}
                      />
                    </div>

                    {/* Secondary and Third Fields */}
                    <div className={fields.showField ? 'grid grid-cols-2 gap-4' : ''}>
                      <div>
                        <label className="block text-primaryText text-sm font-medium mb-2">
                          {fields.secondaryField} {entry.type === 'university' ? <span className="text-accent">*</span> : ''}
                        </label>
                        <input
                          type="text"
                          value={entry.degree}
                          onChange={(e) => updateEntry(entry.id, 'degree', e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                          placeholder={
                            entry.type === 'high-school' ? 'Science Track' :
                            entry.type === 'university' ? 'Computer Science' :
                            entry.type === 'technical' ? 'Web Development Certificate' :
                            'Title or Certification'
                          }
                        />
                      </div>
                      
                      {fields.showField && (
                        <div>
                          <label className="block text-primaryText text-sm font-medium mb-2">
                            {fields.thirdField}
                          </label>
                          <input
                            type="text"
                            value={entry.additionalInfo || ''}
                            onChange={(e) => updateEntry(entry.id, 'additionalInfo', e.target.value)}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            placeholder="GPA, Honors, etc."
                          />
                        </div>
                      )}
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
                          <span className="text-primaryText text-sm">I currently study here</span>
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
        {education.length > 0 && (
          <div className="space-y-3">
            <div className="text-primaryText text-sm font-medium">Add another education entry:</div>
            <div className="grid grid-cols-2 gap-3">
              {educationTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => addNewEntry(type.id)}
                    className="bg-card border-2 border-dashed border-border hover:border-accent text-primaryText hover:text-accent py-3 px-2 rounded-lg transition-all duration-200 flex flex-col items-center space-y-1 group text-xs"
                  >
                    <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{type.name}</span>
                    <Plus className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
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

export default EducationForm;