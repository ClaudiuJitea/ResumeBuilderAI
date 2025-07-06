import React, { useState } from 'react';
import { ArrowLeft, Sparkles, FileText, CheckCircle, Circle, Wand2, Loader2 } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface UploadedCV {
  id: number;
  originalName: string;
  fileName: string;
  fileSize: number;
  extractedData: any;
  createdAt: string;
}

interface CVGenieProps {
  uploadedCVs: UploadedCV[];
  onBack: () => void;
  onProfileCreated: (profile: any) => void;
}

const CVGenie: React.FC<CVGenieProps> = ({ uploadedCVs, onBack, onProfileCreated }) => {
  const { success, error, warning } = useNotification();
  const [selectedCVs, setSelectedCVs] = useState<number[]>([]);
  const [targetRole, setTargetRole] = useState('');
  const [profileName, setProfileName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<'select' | 'configure' | 'preview' | 'edit'>('select');
  const [generatedProfile, setGeneratedProfile] = useState<any>(null);
  const [userFeedback, setUserFeedback] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // Filter CVs that have extracted data
  const validCVs = uploadedCVs.filter(cv => cv.extractedData);

  const toggleCVSelection = (cvId: number) => {
    setSelectedCVs(prev => 
      prev.includes(cvId) 
        ? prev.filter(id => id !== cvId)
        : [...prev, cvId]
    );
  };

  const handleGenerate = async () => {
    if (selectedCVs.length === 0 || !targetRole.trim() || !profileName.trim()) {
      warning('Missing Information', 'Please select at least one CV, enter a target role, and profile name');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/cvs/genie/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          selectedCVIds: selectedCVs,
          targetRole: targetRole.trim(),
          profileName: profileName.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedProfile(data.profile);
        setStep('preview');
      } else {
        const errorData = await response.json();
        error('Generation Failed', errorData.error || 'Failed to generate profile');
      }
    } catch (err) {
      console.error('Error generating profile:', err);
      error('Generation Failed', 'Failed to generate profile. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveProfile = () => {
    if (generatedProfile) {
      onProfileCreated(generatedProfile);
      success('Profile Created', 'CV Profile created successfully!');
    }
  };

  const handleRegenerateWithFeedback = async () => {
    if (!userFeedback.trim()) {
      warning('Missing Feedback', 'Please provide your suggestions for improvements');
      return;
    }

    if (!generatedProfile?.id) {
      error('Error', 'Profile ID not found. Please regenerate the profile.');
      return;
    }

    setIsRegenerating(true);
    try {
      const response = await fetch('/api/cvs/genie/regenerate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          profileId: generatedProfile.id,
          userFeedback: userFeedback.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedProfile(data.profile);
        setUserFeedback('');
        setShowEditForm(false);
        success('Profile Updated', 'Your profile has been enhanced based on your feedback!');
      } else {
        const errorData = await response.json();
        error('Regeneration Failed', errorData.error || 'Failed to regenerate profile');
      }
    } catch (err) {
      console.error('Error regenerating profile:', err);
      error('Regeneration Failed', 'Failed to regenerate profile. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleEditProfile = () => {
    setShowEditForm(true);
    setUserFeedback('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderCVPreview = (cvData: any) => {
    if (!cvData) return null;

    return (
      <div className="text-xs text-primaryText/70 mt-2 space-y-1">
        {cvData.personal_information?.name && (
          <p><span className="font-medium">Name:</span> {cvData.personal_information.name}</p>
        )}
        {cvData.personal_information?.position && (
          <p><span className="font-medium">Position:</span> {cvData.personal_information.position}</p>
        )}
        {cvData.work_experience?.length > 0 && (
          <p><span className="font-medium">Experience:</span> {cvData.work_experience.length} positions</p>
        )}
        {cvData.skills?.length > 0 && (
          <p><span className="font-medium">Skills:</span> {cvData.skills.slice(0, 3).join(', ')}
          {cvData.skills.length > 3 ? ` +${cvData.skills.length - 3} more` : ''}</p>
        )}
      </div>
    );
  };

  const renderProfilePreview = (profile: any) => {
    if (!profile || !profile.combinedData) return null;

    const data = profile.combinedData;
    
    return (
      <div className="space-y-6">
        {/* Job Relevance Score */}
        {data.job_relevance_score && (
          <div className="bg-gradient-to-r from-accent/10 to-heading/10 border border-accent/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-heading">Job Match Score</h4>
              <div className="flex items-center space-x-2">
                <div className={`text-2xl font-bold ${
                  data.job_relevance_score >= 8 ? 'text-green-500' :
                  data.job_relevance_score >= 6 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {data.job_relevance_score}/10
                </div>
                <div className="text-xs text-primaryText/60">
                  {data.job_relevance_score >= 8 ? 'Excellent Match' :
                   data.job_relevance_score >= 6 ? 'Good Match' : 'Needs Improvement'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Personal Information */}
        {data.personal_information && (
          <div>
            <h4 className="font-semibold text-heading mb-2">Personal Information</h4>
            <div className="bg-cardBg border border-border/30 rounded-lg p-4 space-y-1 text-sm">
              {data.personal_information.name && <p className="text-primaryText"><span className="font-medium text-heading">Name:</span> {data.personal_information.name}</p>}
              {data.personal_information.position && <p className="text-primaryText"><span className="font-medium text-heading">Position:</span> {data.personal_information.position}</p>}
              {data.personal_information.email && <p className="text-primaryText"><span className="font-medium text-heading">Email:</span> {data.personal_information.email}</p>}
              {data.personal_information.location && <p className="text-primaryText"><span className="font-medium text-heading">Location:</span> {data.personal_information.location}</p>}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {data.work_experience?.length > 0 && (
          <div>
            <h4 className="font-semibold text-heading mb-2">Work Experience ({data.work_experience.length} positions)</h4>
            <div className="bg-cardBg border border-border/30 rounded-lg p-4 space-y-3">
              {data.work_experience.slice(0, 3).map((exp: any, index: number) => (
                <div key={index} className="text-sm">
                  <p className="font-medium text-heading">{exp.position} at {exp.company}</p>
                  {exp.duration && <p className="text-primaryText/90">{exp.duration}</p>}
                  {exp.description && <p className="text-primaryText/85 text-xs mt-1">{exp.description.substring(0, 150)}...</p>}
                </div>
              ))}
              {data.work_experience.length > 3 && (
                <p className="text-xs text-accent font-medium">+{data.work_experience.length - 3} more positions</p>
              )}
            </div>
          </div>
        )}

        {/* Skills - Enhanced Display */}
        {data.skills && (
          <div>
            {(() => {
              // Handle different skill formats
              let skillsToDisplay: string[] = [];
              let totalSkillCount = 0;
              
              if (Array.isArray(data.skills)) {
                // Check if skills are in categorized format {category, list}
                const categorizedSkills = data.skills.filter((skill: any) => 
                  skill && typeof skill === 'object' && skill.category && skill.list
                );
                
                if (categorizedSkills.length > 0) {
                  // Handle categorized skills format
                  const allSkills: string[] = [];
                  categorizedSkills.forEach((categoryGroup: any) => {
                    if (Array.isArray(categoryGroup.list)) {
                      allSkills.push(...categoryGroup.list);
                    }
                  });
                  skillsToDisplay = allSkills.slice(0, 12);
                  totalSkillCount = allSkills.length;
                } else {
                  // Handle flat skills array
                  skillsToDisplay = data.skills.slice(0, 12).map((skill: any) => {
                    if (typeof skill === 'string') {
                      return skill;
                    } else if (skill && typeof skill === 'object' && skill.name) {
                      return skill.name;
                    } else {
                      return String(skill);
                    }
                  }).filter((skill: string) => skill);
                  totalSkillCount = data.skills.length;
                }
              }
              
              if (skillsToDisplay.length === 0) {
                return null;
              }
              
              return (
                <>
                  <h4 className="font-semibold text-heading mb-2">Skills ({totalSkillCount} skills)</h4>
                  <div className="bg-cardBg border border-border/30 rounded-lg p-4">
                    <div className="flex flex-wrap gap-2">
                      {skillsToDisplay.map((skill: string, index: number) => (
                        <span key={index} className="bg-accent/20 text-accent px-2 py-1 rounded text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                      {totalSkillCount > 12 && (
                        <span className="text-xs text-primaryText/90 font-medium">+{totalSkillCount - 12} more</span>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Achievements */}
        {data.achievements?.length > 0 && (
          <div>
            <h4 className="font-semibold text-heading mb-2">Key Achievements ({data.achievements.length})</h4>
            <div className="bg-cardBg border border-border/30 rounded-lg p-4 space-y-2">
              {data.achievements.slice(0, 3).map((achievement: any, index: number) => (
                <div key={index} className="text-sm">
                  <p className="text-primaryText">• {typeof achievement === 'string' ? achievement : achievement.description || achievement}</p>
                </div>
              ))}
              {data.achievements.length > 3 && (
                <p className="text-xs text-accent font-medium">+{data.achievements.length - 3} more achievements</p>
              )}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education?.length > 0 && (
          <div>
            <h4 className="font-semibold text-heading mb-2">Education ({data.education.length} entries)</h4>
            <div className="bg-cardBg border border-border/30 rounded-lg p-4 space-y-2">
              {data.education.slice(0, 2).map((edu: any, index: number) => (
                <div key={index} className="text-sm">
                  <p className="font-medium text-heading">{edu.degree}</p>
                  <p className="text-primaryText/90">{edu.school}</p>
                </div>
              ))}
              {data.education.length > 2 && (
                <p className="text-xs text-accent font-medium">+{data.education.length - 2} more entries</p>
              )}
            </div>
          </div>
        )}

        {/* Recommended Improvements */}
        {data.recommended_improvements?.length > 0 && (
          <div>
            <h4 className="font-semibold text-heading mb-2 flex items-center">
              <Wand2 className="w-4 h-4 mr-2 text-accent" />
              AI Recommendations
            </h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <ul className="space-y-1 text-sm">
                {data.recommended_improvements.slice(0, 3).map((improvement: string, index: number) => (
                  <li key={index} className="text-blue-700 dark:text-blue-300">
                    • {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Back Button - Fixed Position */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-primaryText hover:text-accent transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        {/* Main Content - Moved Lower */}
        <div className="mt-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-heading mb-4">
              <span className="text-accent">CVGenie</span>
            </h1>
            <p className="text-primaryText/70">
              Combine multiple CVs into an optimized profile for your target role
            </p>
          </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${step === 'select' ? 'text-accent' : 'text-primaryText/40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'select' ? 'bg-accent text-background' : 'bg-primaryText/20'}`}>
                1
              </div>
              <span className="text-sm font-medium">Select CVs</span>
            </div>
            <div className="w-12 h-0.5 bg-primaryText/20"></div>
            <div className={`flex items-center space-x-2 ${step === 'configure' ? 'text-accent' : 'text-primaryText/40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'configure' ? 'bg-accent text-background' : 'bg-primaryText/20'}`}>
                2
              </div>
              <span className="text-sm font-medium">Configure</span>
            </div>
            <div className="w-12 h-0.5 bg-primaryText/20"></div>
            <div className={`flex items-center space-x-2 ${step === 'preview' ? 'text-accent' : 'text-primaryText/40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'preview' ? 'bg-accent text-background' : 'bg-primaryText/20'}`}>
                3
              </div>
              <span className="text-sm font-medium">Preview</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {step === 'select' && (
          <div>
            <h2 className="text-2xl font-semibold text-heading mb-6 text-center">Select CVs to Combine</h2>
            
            {validCVs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-primaryText/30 mx-auto mb-4" />
                <p className="text-primaryText/60 mb-2">No processed CVs available</p>
                <p className="text-sm text-primaryText/40">Upload and process CVs first to use CVGenie</p>
              </div>
            ) : (
              <div className="flex justify-center mb-8">
                <div className="w-full max-w-2xl">
                  <div className="grid gap-4">
                    {validCVs.map((cv) => (
                      <div
                        key={cv.id}
                        className={`bg-cardBg border rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                          selectedCVs.includes(cv.id)
                            ? 'border-accent bg-accent/5'
                            : 'border-border hover:border-accent/50'
                        }`}
                        onClick={() => toggleCVSelection(cv.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            {selectedCVs.includes(cv.id) ? (
                              <CheckCircle className="w-6 h-6 text-accent mt-1" />
                            ) : (
                              <Circle className="w-6 h-6 text-primaryText/40 mt-1" />
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold text-heading">{cv.originalName}</h3>
                              <p className="text-sm text-primaryText/60 mb-2">
                                Uploaded: {formatDate(cv.createdAt)}
                              </p>
                              {renderCVPreview(cv.extractedData)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {validCVs.length > 0 && (
              <div className="flex justify-center">
                <button
                  onClick={() => setStep('configure')}
                  disabled={selectedCVs.length === 0}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    selectedCVs.length === 0
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-accent hover:bg-accent/90 text-background hover:scale-105 hover:shadow-lg hover:shadow-accent/25'
                  }`}
                >
                  Continue with {selectedCVs.length} CV{selectedCVs.length !== 1 ? 's' : ''}
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'configure' && (
          <div>
            <h2 className="text-2xl font-semibold text-heading mb-6 text-center">Configure Profile</h2>
            
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-2xl">
                <div className="bg-cardBg border border-border rounded-xl p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Profile Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="e.g., Senior Developer Profile, Marketing Manager CV"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primaryText"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Target Role
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g., System Administrator, Network Engineer, Full Stack Developer"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primaryText"
                  />
                  <p className="text-xs text-primaryText/60 mt-1">
                    CVGenie will optimize the combined data for this specific role
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Selected CVs ({selectedCVs.length})
                  </label>
                  <div className="space-y-2">
                    {selectedCVs.map(cvId => {
                      const cv = validCVs.find(c => c.id === cvId);
                      return cv ? (
                        <div key={cvId} className="flex items-center space-x-3 p-3 bg-background rounded-lg">
                          <FileText className="w-4 h-4 text-accent" />
                          <span className="text-sm text-primaryText">{cv.originalName}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setStep('select')}
                className="px-6 py-3 border border-border rounded-xl font-semibold text-primaryText hover:bg-border/50 transition-colors duration-200"
              >
                Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !targetRole.trim() || !profileName.trim()}
                className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isGenerating || !targetRole.trim() || !profileName.trim()
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-accent hover:bg-accent/90 text-background hover:scale-105 hover:shadow-lg hover:shadow-accent/25'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating Profile...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>Generate Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 'preview' && generatedProfile && (
          <div>
            <h2 className="text-2xl font-semibold text-heading mb-6 text-center">Profile Preview</h2>
            
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-4xl">
                <div className="bg-cardBg border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-heading">{generatedProfile.profileName}</h3>
                  <p className="text-primaryText/60">Target Role: {generatedProfile.targetRole}</p>
                  <p className="text-sm text-primaryText/40">
                    Generated from {generatedProfile.sourceFiles.length} CV{generatedProfile.sourceFiles.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <Sparkles className="w-8 h-8 text-purple-500" />
              </div>

              {renderProfilePreview(generatedProfile)}
                </div>
              </div>
            </div>

            {/* Edit Profile Section */}
            {showEditForm && (
              <div className="mb-8">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                  <h4 className="font-semibold text-heading mb-4 flex items-center">
                    <Wand2 className="w-5 h-5 mr-2 text-accent" />
                    Suggest Improvements
                  </h4>
                  <p className="text-sm text-primaryText/80 mb-4">
                    Tell CVGenie what you'd like to improve, add, or change in your profile. Be specific about skills, experiences, or descriptions you want enhanced.
                  </p>
                  <textarea
                    value={userFeedback}
                    onChange={(e) => setUserFeedback(e.target.value)}
                    placeholder="Examples:
• Add more cloud computing skills like AWS and Azure
• Emphasize leadership experience in the work descriptions  
• Include more specific achievements with numbers
• Add project management methodologies like Agile and Scrum
• Improve the summary to sound more senior-level"
                    className="w-full h-32 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primaryText resize-none"
                  />
                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={() => setShowEditForm(false)}
                      className="px-4 py-2 border border-border rounded-lg font-medium text-primaryText hover:bg-border/50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRegenerateWithFeedback}
                      disabled={isRegenerating || !userFeedback.trim()}
                      className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isRegenerating || !userFeedback.trim()
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-accent hover:bg-accent/90 text-background'
                      }`}
                    >
                      {isRegenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Regenerating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Enhance Profile</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setStep('configure')}
                className="px-6 py-3 border border-border rounded-xl font-semibold text-primaryText hover:bg-border/50 transition-colors duration-200"
              >
                Back
              </button>
              <button
                onClick={handleEditProfile}
                className="flex items-center space-x-2 px-6 py-3 border border-accent text-accent rounded-xl font-semibold hover:bg-accent/10 transition-colors duration-200"
              >
                <Wand2 className="w-5 h-5" />
                <span>Suggest Changes</span>
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex items-center space-x-2 px-8 py-3 bg-accent hover:bg-accent/90 text-background rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-accent/25"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Save Profile</span>
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
        );
    };
  
  export default CVGenie; 