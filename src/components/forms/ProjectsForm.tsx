import React, { useState } from 'react';
import { 
  ArrowRight, 
  Undo2, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  GripVertical,
  Code,
  Sparkles,
  ExternalLink,
  Calendar,
  Tag
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { Project } from '../../types/resume';

const ProjectsForm = () => {
  const { state, dispatch } = useResume();
  const { projects } = state.resumeData;
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

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
    const newEntry: Project = {
      id: Date.now().toString(),
      title: '',
      description: '',
      link: '',
      technologies: [],
      startDate: '',
      endDate: '',
      current: false
    };

    const updatedProjects = [...projects, newEntry];
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { projects: updatedProjects }
    });

    // Auto-expand the new entry
    setExpandedEntries(prev => new Set([...prev, newEntry.id]));
  };

  const updateEntry = (id: string, field: keyof Project, value: string | boolean | string[]) => {
    const updatedProjects = projects.map(project =>
      project.id === id ? { ...project, [field]: value } : project
    );
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { projects: updatedProjects }
    });
  };

  const deleteEntry = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { projects: updatedProjects }
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

    const draggedIndex = projects.findIndex(project => project.id === draggedItem);
    const targetIndex = projects.findIndex(project => project.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newProjects = [...projects];
    const [draggedEntry] = newProjects.splice(draggedIndex, 1);
    newProjects.splice(targetIndex, 0, draggedEntry);

    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { projects: newProjects }
    });

    setDraggedItem(null);
  };

  const generateAIDescription = (title: string) => {
    // Simulate AI generation with realistic project descriptions
    const aiDescriptions = [
      `Developed a comprehensive ${title} using modern web technologies. Implemented responsive design, user authentication, and real-time data processing. Optimized performance and ensured cross-browser compatibility.`,
      `Built ${title} from scratch with focus on user experience and scalability. Integrated third-party APIs, implemented automated testing, and deployed using CI/CD pipelines. Achieved 99% uptime and positive user feedback.`,
      `Created ${title} as a full-stack solution addressing specific business needs. Utilized agile development methodologies, collaborated with cross-functional teams, and delivered the project on time and within budget.`
    ];
    
    const randomDescription = aiDescriptions[Math.floor(Math.random() * aiDescriptions.length)];
    return randomDescription;
  };

  const handleAIGenerate = (id: string) => {
    const entry = projects.find(project => project.id === id);
    if (entry && entry.title) {
      const aiDescription = generateAIDescription(entry.title);
      updateEntry(id, 'description', aiDescription);
    }
  };

  const handleTechnologiesChange = (id: string, techString: string) => {
    const technologies = techString.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0);
    updateEntry(id, 'technologies', technologies);
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
        <h3 className="font-bold text-sm mb-2">PROJECTS</h3>
        <p className="text-sm">
          Showcase your best projects and portfolio work. Include links to live demos or repositories to impress employers.
        </p>
        
        {/* Character Illustration */}
        <div className="absolute -right-2 -top-2">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center">
            <Code className="text-accent w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Project Entries */}
      <div className="space-y-4 mb-6">
        {projects.map((entry, index) => {
          const isExpanded = expandedEntries.has(entry.id);
          
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
                  <Code className="w-5 h-5 text-accent" />
                  <div>
                    <div className="text-primaryText font-medium">
                      {entry.title || `Project ${index + 1}`}
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
                    {/* Project Title */}
                    <div>
                      <label className="block text-primaryText text-sm font-medium mb-2">
                        Project Title <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        value={entry.title}
                        onChange={(e) => updateEntry(entry.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="E-commerce Website"
                      />
                    </div>

                    {/* Project Description */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-primaryText text-sm font-medium">
                          Project Description <span className="text-accent">*</span>
                        </label>
                        <button
                          onClick={() => handleAIGenerate(entry.id)}
                          disabled={!entry.title}
                          className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                            entry.title
                              ? 'bg-accent text-background hover:bg-accent/90'
                              : 'bg-border text-primaryText/50 cursor-not-allowed'
                          }`}
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>AI</span>
                        </button>
                      </div>
                      <textarea
                        value={entry.description}
                        onChange={(e) => updateEntry(entry.id, 'description', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                        placeholder="Describe your project, technologies used, and key achievements..."
                      />
                    </div>

                    {/* Technologies Used */}
                    <div>
                      <label className="block text-primaryText text-sm font-medium mb-2">
                        Technologies Used
                      </label>
                      <input
                        type="text"
                        value={entry.technologies?.join(', ') || ''}
                        onChange={(e) => handleTechnologiesChange(entry.id, e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="React, Node.js, MongoDB, Express"
                      />
                      <p className="text-primaryText/60 text-xs mt-1">Separate technologies with commas</p>
                    </div>

                    {/* Project Link */}
                    <div>
                      <label className="block text-primaryText text-sm font-medium mb-2">
                        Project Link (optional)
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={entry.link || ''}
                          onChange={(e) => updateEntry(entry.id, 'link', e.target.value)}
                          className="w-full px-3 py-2 pr-10 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                          placeholder="https://github.com/username/project"
                        />
                        <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primaryText/50" />
                      </div>
                    </div>

                    {/* Project Duration */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-primaryText text-sm font-medium mb-2">
                          Start Date
                        </label>
                        <input
                          type="text"
                          value={entry.startDate || ''}
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
                          value={entry.current ? 'ongoing' : entry.endDate || ''}
                          onChange={(e) => updateEntry(entry.id, 'endDate', e.target.value)}
                          disabled={entry.current}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50"
                          placeholder="ongoing"
                        />
                        <label className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            checked={entry.current || false}
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
                          <span className="text-primaryText text-sm">Ongoing project</span>
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
          <span className="font-medium">Add another project</span>
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

export default ProjectsForm;