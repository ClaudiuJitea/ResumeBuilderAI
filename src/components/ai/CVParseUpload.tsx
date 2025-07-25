import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';

interface CVParseUploadProps {
  onClose: () => void;
  onDataExtracted: (extractedData: any) => void;
}

const CVParseUpload: React.FC<CVParseUploadProps> = ({ onClose, onDataExtracted }) => {
  const { token } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progressStage, setProgressStage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    // Validate file type
    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    // Validate file size (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  // Remove the fake progress simulation

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setProgressStage('Processing document...');

      const formData = new FormData();
      formData.append('cvFile', file);

      const response = await fetch('/api/ai/parse-cv', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to parse CV');
      }

      setProgressStage('Complete!');
      setSuccess(true);

      // Pass extracted data to parent component
      setTimeout(() => {
        onDataExtracted(data.data.extractedData);
        onClose();
      }, 1200);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to parse CV');
      setProgressStage('');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    setProgressStage('');
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl p-6 w-full max-w-lg border border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-primaryText">Upload Your CV</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-background/50 transition-colors"
          >
            <X className="w-5 h-5 text-primaryText/60" />
          </button>
        </div>

        {/* Description */}
        <p className="text-primaryText/70 text-sm mb-4">
          Upload your PDF resume to automatically extract information.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-green-700 text-sm">CV parsed successfully! Applying data...</span>
          </div>
        )}

        {/* File Upload Area */}
        {!file ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent/50 transition-colors cursor-pointer mb-4"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-10 h-10 text-primaryText/40 mx-auto mb-3" />
            <p className="text-primaryText font-medium mb-1">
              Drop your CV here or click to browse
            </p>
            <p className="text-primaryText/60 text-xs">
              PDF files up to 10MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="border border-border rounded-lg p-3 mb-4">
            {/* File Info */}
            <div className="flex items-center space-x-3 mb-3">
              <FileText className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-primaryText text-sm truncate">{file.name}</p>
                <p className="text-xs text-primaryText/60">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
              {!uploading && (
                <button
                  onClick={removeFile}
                  className="p-1 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Loading Animation */}
            {uploading && (
              <div className="flex items-center justify-center space-x-3 py-4">
                <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin"></div>
                <span className="text-primaryText text-sm">{progressStage}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-4">
          <button
            onClick={onClose}
            disabled={uploading}
            className="flex-1 px-4 py-2 bg-red-600 border border-red-600 text-white hover:bg-red-700 hover:border-red-700 transition-all duration-200 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading || success}
            className="flex-1 px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
          >
            {uploading ? 'Processing...' : success ? 'Complete!' : 'Parse CV'}
          </button>
        </div>

        {/* Tips Toggle */}
        <button
          onClick={() => setShowTips(!showTips)}
          className="w-full flex items-center justify-center space-x-2 text-xs text-primaryText/60 hover:text-primaryText/80 transition-colors"
        >
          <Info className="w-3 h-3" />
          <span>{showTips ? 'Hide' : 'Show'} tips for better results</span>
        </button>

        {/* Collapsible Tips */}
        {showTips && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Use a well-formatted PDF with clear text</li>
              <li>• Avoid image-based or scanned PDFs</li>
              <li>• Ensure sections are clearly labeled</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVParseUpload; 