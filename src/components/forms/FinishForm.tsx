import React, { useState } from 'react';
import { 
  Download, 
  CheckCircle, 
  Star, 
  Trophy, 
  Sparkles, 
  FileText, 
  Share2, 
  RefreshCw,
  Heart,
  Rocket,
  Target,
  Award
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const FinishForm = () => {
  const { state, dispatch } = useResume();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const { personalInfo, workExperience, education, skills, projects, interests, certificates, links } = state.resumeData;

  // Calculate completion stats
  const totalSections = state.availableBuildSteps.length - 1; // Exclude finish step
  const completedSections = state.availableBuildSteps.length - 1; // All sections completed to reach finish
  const completionPercentage = Math.round((completedSections / totalSections) * 100);

  const generatePDF = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadComplete(false);

    try {
      // Find the resume preview element
      const resumeElement = document.querySelector('[data-resume-preview]') as HTMLElement;
      
      if (!resumeElement) {
        throw new Error('Resume preview not found');
      }

      setDownloadProgress(25);

      // Store original styles
      const originalStyles = {
        transform: resumeElement.style.transform,
        transformOrigin: resumeElement.style.transformOrigin,
        width: resumeElement.style.width,
        height: resumeElement.style.height,
        maxHeight: resumeElement.style.maxHeight,
        overflow: resumeElement.style.overflow
      };

      // Temporarily modify the preview to show all content
      resumeElement.style.transform = 'scale(1)';
      resumeElement.style.transformOrigin = 'top left';
      resumeElement.style.width = '210mm';
      resumeElement.style.height = 'auto';
      resumeElement.style.maxHeight = 'none';
      resumeElement.style.overflow = 'visible';

      // Find page navigation and hide it temporarily
      const pageNavigation = document.querySelector('[data-page-navigation]') as HTMLElement;
      const originalPageNavDisplay = pageNavigation ? pageNavigation.style.display : '';
      if (pageNavigation) {
        pageNavigation.style.display = 'none';
      }

      // Get the template content and determine if we need multiple pages
      const { workExperience, projects, skills, certificates, links } = state.resumeData;
      const needsSecondPage = 
        workExperience.length > 2 || 
        projects.length > 0 || 
        skills.length > 6 ||
        certificates.length > 2 ||
        links.length > 3 ||
        (skills.length > 4 && certificates.length > 0) ||
        (skills.length > 4 && links.length > 0);

      setDownloadProgress(40);

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfWidth = 210;
      const pdfHeight = 297;

      // Capture page 1
      const canvas1 = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: resumeElement.offsetWidth,
        height: resumeElement.offsetHeight
      });

      setDownloadProgress(60);

      // Add page 1 to PDF
      const imgData1 = canvas1.toDataURL('image/jpeg', 0.95);
      
      // Calculate scaling to fit A4
      const scale = Math.min(pdfWidth / (canvas1.width * 0.352778), pdfHeight / (canvas1.height * 0.352778));
      const scaledWidth = (canvas1.width * 0.352778) * scale;
      const scaledHeight = (canvas1.height * 0.352778) * scale;
      
      // Center on page
      const xOffset = (pdfWidth - scaledWidth) / 2;
      const yOffset = (pdfHeight - scaledHeight) / 2;
      
      pdf.addImage(imgData1, 'JPEG', xOffset, yOffset, scaledWidth, scaledHeight);

      // If we need a second page, capture it
      if (needsSecondPage && state.selectedTemplate === 'modern') {
        setDownloadProgress(75);

        // Temporarily change to page 2 by dispatching a custom event
        const changePageEvent = new CustomEvent('changePage', { detail: { page: 2 } });
        window.dispatchEvent(changePageEvent);

        // Wait for page change
        await new Promise(resolve => setTimeout(resolve, 500));

        // Capture page 2
        const canvas2 = await html2canvas(resumeElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: resumeElement.offsetWidth,
          height: resumeElement.offsetHeight
        });

        // Add page 2 to PDF
        pdf.addPage();
        const imgData2 = canvas2.toDataURL('image/jpeg', 0.95);
        
        const scale2 = Math.min(pdfWidth / (canvas2.width * 0.352778), pdfHeight / (canvas2.height * 0.352778));
        const scaledWidth2 = (canvas2.width * 0.352778) * scale2;
        const scaledHeight2 = (canvas2.height * 0.352778) * scale2;
        
        const xOffset2 = (pdfWidth - scaledWidth2) / 2;
        const yOffset2 = (pdfHeight - scaledHeight2) / 2;
        
        pdf.addImage(imgData2, 'JPEG', xOffset2, yOffset2, scaledWidth2, scaledHeight2);

        // Change back to page 1
        const changeBackEvent = new CustomEvent('changePage', { detail: { page: 1 } });
        window.dispatchEvent(changeBackEvent);
      }

      setDownloadProgress(90);

      // Restore original styles
      Object.assign(resumeElement.style, originalStyles);
      
      // Restore page navigation
      if (pageNavigation) {
        pageNavigation.style.display = originalPageNavDisplay;
      }

      // Generate filename and download
      const fileName = `${personalInfo.firstName}_${personalInfo.lastName}_Resume.pdf`.replace(/\s+/g, '_');
      pdf.save(fileName);

      setDownloadProgress(100);
      setDownloadComplete(true);

      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
        setDownloadComplete(false);
      }, 3000);

    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Restore styles in case of error
      const resumeElement = document.querySelector('[data-resume-preview]') as HTMLElement;
      if (resumeElement) {
        resumeElement.style.transform = '';
        resumeElement.style.transformOrigin = '';
        resumeElement.style.width = '';
        resumeElement.style.height = '';
        resumeElement.style.maxHeight = '';
        resumeElement.style.overflow = '';
      }

      // Restore page navigation
      const pageNavigation = document.querySelector('[data-page-navigation]') as HTMLElement;
      if (pageNavigation) {
        pageNavigation.style.display = '';
      }

      setIsDownloading(false);
      setDownloadProgress(0);
      alert('There was an error generating your PDF. Please try again.');
    }
  };

  const handleStartOver = () => {
    if (confirm('Are you sure you want to start over? This will clear all your current data.')) {
      // Reset to landing page and clear data
      dispatch({ type: 'SET_STEP', payload: 'landing' });
      // You might want to add a reset action to clear all resume data
    }
  };

  const handleEditResume = () => {
    // Go back to the first step to edit
    dispatch({ type: 'SET_BUILDER_STEP', payload: 'personal' });
  };

  const achievements = [
    { icon: CheckCircle, text: 'Completed all resume sections', color: 'text-green-500' },
    { icon: Star, text: 'Added professional information', color: 'text-yellow-500' },
    { icon: Trophy, text: 'Created a standout resume', color: 'text-accent' },
    { icon: Target, text: 'Ready for job applications', color: 'text-blue-500' }
  ];

  return (
    <div className="max-w-md mx-auto">
      {/* Congratulations Header */}
      <div className="text-center mb-8">
        <div className="relative">
          {/* Celebration Animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-accent/20 rounded-full animate-ping"></div>
          </div>
          <div className="relative w-32 h-32 bg-accent rounded-full mx-auto flex items-center justify-center mb-6">
            <Trophy className="w-16 h-16 text-background" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-primaryText mb-4">
          🎉 Congratulations!
        </h1>
        <p className="text-lg text-primaryText/80 mb-2">
          You've successfully created your professional resume!
        </p>
        <p className="text-primaryText/60">
          Your resume is now ready to help you land your dream job.
        </p>
      </div>

      {/* Success Stats */}
      <div className="bg-card rounded-2xl p-6 border border-border mb-8">
        <h3 className="text-lg font-bold text-primaryText mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-accent" />
          Your Achievement
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{completedSections}</div>
            <div className="text-sm text-primaryText/60">Sections Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{completionPercentage}%</div>
            <div className="text-sm text-primaryText/60">Profile Complete</div>
          </div>
        </div>

        {/* Achievement List */}
        <div className="space-y-3">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <div key={index} className="flex items-center space-x-3">
                <IconComponent className={`w-5 h-5 ${achievement.color}`} />
                <span className="text-primaryText text-sm">{achievement.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resume Summary */}
      <div className="bg-card rounded-2xl p-6 border border-border mb-8">
        <h3 className="text-lg font-bold text-primaryText mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-accent" />
          Resume Summary
        </h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-primaryText/60">Name:</span>
            <span className="text-primaryText font-medium">
              {personalInfo.firstName} {personalInfo.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-primaryText/60">Position:</span>
            <span className="text-primaryText font-medium">
              {personalInfo.position || 'Professional'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-primaryText/60">Work Experience:</span>
            <span className="text-primaryText font-medium">
              {workExperience.length} {workExperience.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-primaryText/60">Education:</span>
            <span className="text-primaryText font-medium">
              {education.length} {education.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-primaryText/60">Skills:</span>
            <span className="text-primaryText font-medium">
              {skills.length} {skills.length === 1 ? 'skill' : 'skills'}
            </span>
          </div>
          {interests.length > 0 && (
            <div className="flex justify-between">
              <span className="text-primaryText/60">Interests:</span>
              <span className="text-primaryText font-medium">
                {interests.length} {interests.length === 1 ? 'interest' : 'interests'}
              </span>
            </div>
          )}
          {certificates.length > 0 && (
            <div className="flex justify-between">
              <span className="text-primaryText/60">Certificates:</span>
              <span className="text-primaryText font-medium">
                {certificates.length} {certificates.length === 1 ? 'certificate' : 'certificates'}
              </span>
            </div>
          )}
          {links.length > 0 && (
            <div className="flex justify-between">
              <span className="text-primaryText/60">Links:</span>
              <span className="text-primaryText font-medium">
                {links.length} {links.length === 1 ? 'link' : 'links'}
              </span>
            </div>
          )}
          {projects.length > 0 && (
            <div className="flex justify-between">
              <span className="text-primaryText/60">Projects:</span>
              <span className="text-primaryText font-medium">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-accent/20 to-heading/20 rounded-2xl p-6 border border-accent/30 mb-8">
        <div className="flex items-start space-x-3">
          <Rocket className="w-6 h-6 text-accent mt-1" />
          <div>
            <h3 className="text-lg font-bold text-primaryText mb-2">
              You're Ready to Succeed! 🚀
            </h3>
            <p className="text-primaryText/80 text-sm leading-relaxed">
              Your professional resume showcases your skills, experience, and potential. 
              We believe in your ability to land that dream job. Go out there and show 
              the world what you're capable of!
            </p>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="space-y-4 mb-8">
        <button
          onClick={generatePDF}
          disabled={isDownloading}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-3 ${
            isDownloading
              ? 'bg-border text-primaryText/50 cursor-not-allowed'
              : downloadComplete
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-accent hover:bg-accent/90 text-background hover:scale-105 hover:shadow-lg hover:shadow-accent/20'
          }`}
        >
          {isDownloading ? (
            <>
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span>Generating PDF... {downloadProgress}%</span>
            </>
          ) : downloadComplete ? (
            <>
              <CheckCircle className="w-6 h-6" />
              <span>Download Complete!</span>
            </>
          ) : (
            <>
              <Download className="w-6 h-6" />
              <span>Download Resume PDF</span>
            </>
          )}
        </button>

        {/* Progress Bar */}
        {isDownloading && (
          <div className="w-full bg-border rounded-full h-2">
            <div 
              className="bg-accent rounded-full h-2 transition-all duration-300"
              style={{ width: `${downloadProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleEditResume}
          className="w-full bg-card border border-border hover:border-accent text-primaryText py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-5 h-5" />
          <span>Edit Resume</span>
        </button>
        
        <button
          onClick={handleStartOver}
          className="w-full bg-background border border-border hover:border-red-500 text-primaryText hover:text-red-500 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Start Over</span>
        </button>
      </div>

      {/* Footer Message */}
      <div className="text-center mt-8 p-4 bg-card rounded-lg border border-border">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Heart className="w-4 h-4 text-red-500" />
          <span className="text-primaryText/80 text-sm">Made with love for your success</span>
        </div>
        <p className="text-primaryText/60 text-xs">
          Best of luck with your job applications! 🍀
        </p>
      </div>
    </div>
  );
};

export default FinishForm;