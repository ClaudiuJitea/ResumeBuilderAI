import React, { useState, useEffect } from 'react';
import { Upload, FileText, Download, Trash2, Plus, Sparkles, FolderOpen, FileImage, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useResume } from '../context/ResumeContext';
import { useNotification } from '../context/NotificationContext';
import CVGenie from './CVGenie';

interface UploadedCV {
  id: number;
  originalName: string;
  fileName: string;
  fileSize: number;
  extractedData: any;
  createdAt: string;
}

interface GeneratedResume {
  id: number;
  title: string;
  template: string;
  resumeData: any;
  createdAt: string;
  updatedAt: string;
}

interface CVProfile {
  id: number;
  profileName: string;
  targetRole: string;
  combinedData: any;
  sourceFiles: any[];
  createdAt: string;
}

const YourCVs = () => {
  const { user } = useAuth();
  const { dispatch } = useResume();
  const { success, error, warning } = useNotification();
  const [uploadedCVs, setUploadedCVs] = useState<UploadedCV[]>([]);
  const [generatedResumes, setGeneratedResumes] = useState<GeneratedResume[]>([]);
  const [cvProfiles, setCVProfiles] = useState<CVProfile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'uploaded' | 'generated' | 'profiles'>('uploaded');
  const [showCVGenie, setShowCVGenie] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<{
    show: boolean;
    type: 'cv' | 'resume' | 'profile';
    id: number;
    name: string;
  }>({ show: false, type: 'cv', id: 0, name: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchUploadedCVs(),
        fetchGeneratedResumes(),
        fetchCVProfiles()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUploadedCVs = async () => {
    try {
      const response = await fetch('/api/cvs/uploaded', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUploadedCVs(data);
      }
    } catch (error) {
      console.error('Error fetching uploaded CVs:', error);
    }
  };

  const fetchGeneratedResumes = async () => {
    try {
      const response = await fetch('/api/auth/resumes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setGeneratedResumes(data.resumes || []);
      }
    } catch (error) {
      console.error('Error fetching generated resumes:', error);
    }
  };

  const fetchCVProfiles = async () => {
    try {
      const response = await fetch('/api/cvs/profiles', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCVProfiles(data);
      }
    } catch (error) {
      console.error('Error fetching CV profiles:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file || file.type !== 'application/pdf') {
      warning('Invalid File Type', 'Please upload a PDF file');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('cv', file);

    try {
      const response = await fetch('/api/cvs/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedCVs(prev => [data.cv, ...prev]);
        success('CV Uploaded', 'Your CV has been uploaded and processed successfully!');
      } else {
        const errorData = await response.json();
        error('Upload Failed', errorData.error || 'Failed to upload CV');
      }
    } catch (err) {
      console.error('Error uploading CV:', err);
      error('Upload Failed', 'Failed to upload CV. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const deleteUploadedCV = async (id: number) => {
    try {
      const response = await fetch(`/api/cvs/uploaded/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setUploadedCVs(prev => prev.filter(cv => cv.id !== id));
        success('CV Deleted', 'Your CV has been deleted successfully');
      } else {
        error('Delete Failed', 'Failed to delete CV');
      }
    } catch (err) {
      console.error('Error deleting CV:', err);
      error('Delete Failed', 'Failed to delete CV');
    }
  };

  const deleteResume = async (id: number) => {
    try {
      const response = await fetch(`/api/auth/resumes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setGeneratedResumes(prev => prev.filter(resume => resume.id !== id));
        success('Resume Deleted', 'Your resume has been deleted successfully');
      } else {
        error('Delete Failed', 'Failed to delete resume');
      }
    } catch (err) {
      console.error('Error deleting resume:', err);
      error('Delete Failed', 'Failed to delete resume');
    }
  };

  const deleteCVProfile = async (id: number) => {
    try {
      const response = await fetch(`/api/cvs/profiles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setCVProfiles(prev => prev.filter(profile => profile.id !== id));
        success('Profile Deleted', 'Your CV profile has been deleted successfully');
      } else {
        error('Delete Failed', 'Failed to delete CV profile');
      }
    } catch (err) {
      console.error('Error deleting CV profile:', err);
      error('Delete Failed', 'Failed to delete CV profile');
    }
  };

  const handleDeleteConfirm = (type: 'cv' | 'resume' | 'profile', id: number, name: string) => {
    setConfirmDelete({ show: true, type, id, name });
  };

  const handleDeleteCancel = () => {
    setConfirmDelete({ show: false, type: 'cv', id: 0, name: '' });
  };

  const handleDeleteExecute = async () => {
    const { type, id } = confirmDelete;
    setConfirmDelete({ show: false, type: 'cv', id: 0, name: '' });
    
    switch (type) {
      case 'cv':
        await deleteUploadedCV(id);
        break;
      case 'resume':
        await deleteResume(id);
        break;
      case 'profile':
        await deleteCVProfile(id);
        break;
    }
  };

  const applyCVProfile = async (profileId: number) => {
    try {
      const response = await fetch(`/api/cvs/profiles/${profileId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Update the resume context with the applied data
        dispatch({ type: 'UPDATE_RESUME_DATA', payload: data.resumeData });
        dispatch({ type: 'SET_STEP', payload: 'templates' });
        success('Profile Applied', `CV profile "${data.profileInfo.profileName}" applied successfully! You can now select a template.`);
      } else {
        error('Apply Failed', 'Failed to apply CV profile');
      }
    } catch (err) {
      console.error('Error applying CV profile:', err);
      error('Apply Failed', 'Failed to apply CV profile');
    }
  };

  const loadResume = async (resumeId: number) => {
    try {
      const response = await fetch(`/api/auth/resumes/${resumeId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const resumeData = JSON.parse(data.resume.resumeData);
        
        dispatch({ type: 'UPDATE_RESUME_DATA', payload: resumeData });
        dispatch({ type: 'SET_TEMPLATE', payload: data.resume.template });
        dispatch({ type: 'SET_STEP', payload: 'builder' });
        success('Resume Loaded', 'Your resume has been loaded successfully!');
      } else {
        error('Load Failed', 'Failed to load resume');
      }
    } catch (err) {
      console.error('Error loading resume:', err);
      error('Load Failed', 'Failed to load resume');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (showCVGenie) {
    return (
      <CVGenie
        uploadedCVs={uploadedCVs}
        onBack={() => setShowCVGenie(false)}
        onProfileCreated={(profile: CVProfile) => {
          setCVProfiles(prev => [profile, ...prev]);
          setShowCVGenie(false);
          setActiveTab('profiles');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => dispatch({ type: 'SET_STEP', payload: 'landing' })}
            className="flex items-center space-x-2 text-primaryText hover:text-accent transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-heading mb-4">
            Your <span className="bg-gradient-to-r from-accent to-heading bg-clip-text text-transparent">CVs & Profiles</span>
          </h1>
          <p className="text-lg text-primaryText/80 max-w-2xl mx-auto">
            Manage your uploaded CVs, generated resumes, and create intelligent CV profiles with AI
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <button
            onClick={() => setShowCVGenie(true)}
            disabled={uploadedCVs.length === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              uploadedCVs.length === 0
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-accent hover:bg-accent/90 text-background hover:scale-105 hover:shadow-lg hover:shadow-accent/25'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>CVGenie</span>
          </button>
          
          <button
            onClick={() => dispatch({ type: 'SET_STEP', payload: 'templates' })}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold bg-accent hover:bg-accent/90 text-background transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-accent/25"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Resume</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-border/20 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('uploaded')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'uploaded'
                  ? 'bg-accent text-background shadow-md'
                  : 'text-primaryText/60 hover:text-primaryText'
              }`}
            >
              Uploaded CVs ({uploadedCVs.length})
            </button>
            <button
              onClick={() => setActiveTab('generated')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'generated'
                  ? 'bg-accent text-background shadow-md'
                  : 'text-primaryText/60 hover:text-primaryText'
              }`}
            >
              Generated Resumes ({generatedResumes.length})
            </button>
            <button
              onClick={() => setActiveTab('profiles')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'profiles'
                  ? 'bg-accent text-background shadow-md'
                  : 'text-primaryText/60 hover:text-primaryText'
              }`}
            >
              CV Profiles ({cvProfiles.length})
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Uploaded CVs Tab */}
            {activeTab === 'uploaded' && (
              <div>
                {/* Upload Area */}
                <div className="mb-8">
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                      dragActive
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent/50'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={() => setDragActive(true)}
                    onDragLeave={() => setDragActive(false)}
                  >
                    <Upload className="w-12 h-12 text-accent mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-heading mb-2">
                      Upload Your CV
                    </h3>
                    <p className="text-primaryText/60 mb-4">
                      Drag and drop your PDF CV here, or click to browse
                    </p>
                    <label className="inline-flex items-center px-6 py-3 bg-accent text-background rounded-lg cursor-pointer hover:bg-accent/90 transition-colors duration-200">
                      <span>{isUploading ? 'Uploading...' : 'Choose File'}</span>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleInputChange}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                    <p className="text-sm text-primaryText/40 mt-2">
                      Maximum file size: 10MB • PDF only
                    </p>
                  </div>
                </div>

                {/* Uploaded CVs List */}
                <div className="grid gap-4">
                  {uploadedCVs.length === 0 ? (
                    <div className="text-center py-12">
                      <FolderOpen className="w-16 h-16 text-primaryText/30 mx-auto mb-4" />
                      <p className="text-primaryText/60">No uploaded CVs yet</p>
                      <p className="text-sm text-primaryText/40">Upload your first CV to get started</p>
                    </div>
                  ) : (
                    uploadedCVs.map((cv) => (
                      <div key={cv.id} className="bg-cardBg border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <FileText className="w-8 h-8 text-accent" />
                            <div>
                              <h3 className="font-semibold text-heading">{cv.originalName}</h3>
                              <p className="text-sm text-primaryText/60">
                                {formatFileSize(cv.fileSize)} • {formatDate(cv.createdAt)}
                              </p>
                              {cv.extractedData && (
                                <p className="text-xs text-accent">✓ AI Processed</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDeleteConfirm('cv', cv.id, cv.originalName)}
                              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Generated Resumes Tab */}
            {activeTab === 'generated' && (
              <div className="grid gap-4">
                {generatedResumes.length === 0 ? (
                  <div className="text-center py-12">
                    <FileImage className="w-16 h-16 text-primaryText/30 mx-auto mb-4" />
                    <p className="text-primaryText/60">No generated resumes yet</p>
                    <p className="text-sm text-primaryText/40">Create your first resume to see it here</p>
                  </div>
                ) : (
                  generatedResumes.map((resume) => (
                    <div key={resume.id} className="bg-cardBg border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <FileImage className="w-8 h-8 text-accent" />
                          <div>
                            <h3 className="font-semibold text-heading">{resume.title}</h3>
                            <p className="text-sm text-primaryText/60">
                              Template: {resume.template} • {formatDate(resume.updatedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => loadResume(resume.id)}
                            className="flex items-center space-x-2 px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors duration-200"
                          >
                            <span>Edit</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteConfirm('resume', resume.id, resume.title)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* CV Profiles Tab */}
            {activeTab === 'profiles' && (
              <div className="grid gap-4">
                {cvProfiles.length === 0 ? (
                  <div className="text-center py-12">
                    <Sparkles className="w-16 h-16 text-primaryText/30 mx-auto mb-4" />
                    <p className="text-primaryText/60">No CV profiles yet</p>
                    <p className="text-sm text-primaryText/40">Use CVGenie to create intelligent CV profiles</p>
                  </div>
                ) : (
                  cvProfiles.map((profile) => (
                    <div key={profile.id} className="bg-cardBg border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Sparkles className="w-8 h-8 text-purple-500" />
                          <div>
                            <h3 className="font-semibold text-heading">{profile.profileName}</h3>
                            <p className="text-sm text-primaryText/60">
                              Target Role: {profile.targetRole} • {formatDate(profile.createdAt)}
                            </p>
                            <p className="text-xs text-primaryText/40">
                              Based on {profile.sourceFiles.length} CV{profile.sourceFiles.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => applyCVProfile(profile.id)}
                            className="flex items-center space-x-2 px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent/90 transition-all duration-200 hover:scale-105"
                          >
                            <span>Apply</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteConfirm('profile', profile.id, profile.profileName)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDelete.show && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-background border border-border rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-heading">Confirm Deletion</h3>
                  <p className="text-sm text-primaryText/60">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-primaryText mb-6">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-heading">"{confirmDelete.name}"</span>
                {confirmDelete.type === 'profile' ? ' profile' : confirmDelete.type === 'resume' ? ' resume' : ' CV'}?
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 border border-border rounded-lg font-medium text-primaryText hover:bg-border/50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteExecute}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourCVs; 