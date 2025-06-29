import React, { useState } from 'react';
import { 
  ArrowRight, 
  Undo2, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  GripVertical,
  Award,
  Calendar,
  Building2,
  ExternalLink
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

const CertificatesForm = () => {
  const { state, dispatch } = useResume();
  const { certificates } = state.resumeData;
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Convert string array to Certificate objects for backward compatibility
  const certificateObjects: Certificate[] = certificates.map((cert, index) => {
    if (typeof cert === 'string') {
      return {
        id: `cert-${index}`,
        name: cert,
        issuer: '',
        date: ''
      };
    }
    return cert as Certificate;
  });

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
    const newEntry: Certificate = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: ''
    };

    const updatedCertificates = [...certificateObjects, newEntry];
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { certificates: updatedCertificates }
    });

    // Auto-expand the new entry
    setExpandedEntries(prev => new Set([...prev, newEntry.id]));
  };

  const updateEntry = (id: string, field: keyof Certificate, value: string) => {
    const updatedCertificates = certificateObjects.map(cert =>
      cert.id === id ? { ...cert, [field]: value } : cert
    );
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { certificates: updatedCertificates }
    });
  };

  const deleteEntry = (id: string) => {
    const updatedCertificates = certificateObjects.filter(cert => cert.id !== id);
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { certificates: updatedCertificates }
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

    const draggedIndex = certificateObjects.findIndex(cert => cert.id === draggedItem);
    const targetIndex = certificateObjects.findIndex(cert => cert.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newCertificates = [...certificateObjects];
    const [draggedEntry] = newCertificates.splice(draggedIndex, 1);
    newCertificates.splice(targetIndex, 0, draggedEntry);

    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { certificates: newCertificates }
    });

    setDraggedItem(null);
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
        <h3 className="font-bold text-sm mb-2">CERTIFICATES & CERTIFICATIONS</h3>
        <p className="text-sm">
          Add your professional certifications, licenses, and completed courses to showcase your expertise and commitment to learning.
        </p>
        
        {/* Character Illustration */}
        <div className="absolute -right-2 -top-2">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center">
            <Award className="text-accent w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Certificate Entries */}
      <div className="space-y-4 mb-6">
        {certificateObjects.map((entry, index) => {
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
                  <Award className="w-5 h-5 text-accent" />
                  <div>
                    <div className="text-primaryText font-medium">
                      {entry.name || `Certificate ${index + 1}`}
                    </div>
                    <div className="text-primaryText/60 text-sm">
                      {isExpanded ? 'Collapse to hide details' : 'Expand to add details'}
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
                    {/* Certificate Name */}
                    <div>
                      <label className="block text-primaryText text-sm font-medium mb-2">
                        Certificate Name <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        value={entry.name}
                        onChange={(e) => updateEntry(entry.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="AWS Certified Solutions Architect"
                      />
                    </div>

                    {/* Issuing Organization */}
                    <div>
                      <label className="block text-primaryText text-sm font-medium mb-2">
                        Issuing Organization <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        value={entry.issuer}
                        onChange={(e) => updateEntry(entry.id, 'issuer', e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="Amazon Web Services"
                      />
                    </div>

                    {/* Issue Date and Expiry Date */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-primaryText text-sm font-medium mb-2">
                          Issue Date <span className="text-accent">*</span>
                        </label>
                        <input
                          type="text"
                          value={entry.date}
                          onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                          placeholder="MM/YYYY"
                        />
                      </div>
                      <div>
                        <label className="block text-primaryText text-sm font-medium mb-2">
                          Expiry Date (optional)
                        </label>
                        <input
                          type="text"
                          value={entry.expiryDate || ''}
                          onChange={(e) => updateEntry(entry.id, 'expiryDate', e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                          placeholder="MM/YYYY or Never"
                        />
                      </div>
                    </div>

                    {/* Credential ID */}
                    <div>
                      <label className="block text-primaryText text-sm font-medium mb-2">
                        Credential ID (optional)
                      </label>
                      <input
                        type="text"
                        value={entry.credentialId || ''}
                        onChange={(e) => updateEntry(entry.id, 'credentialId', e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="ABC123456789"
                      />
                    </div>

                    {/* Credential URL */}
                    <div>
                      <label className="block text-primaryText text-sm font-medium mb-2">
                        Credential URL (optional)
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={entry.credentialUrl || ''}
                          onChange={(e) => updateEntry(entry.id, 'credentialUrl', e.target.value)}
                          className="w-full px-3 py-2 pr-10 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                          placeholder="https://www.credly.com/badges/..."
                        />
                        <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primaryText/50" />
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
          <span className="font-medium">Add another certificate</span>
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

export default CertificatesForm;