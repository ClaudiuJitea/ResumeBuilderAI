import React from 'react';
import { ResumeProvider, useResume } from './context/ResumeContext';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import TemplateSelection from './components/TemplateSelection';
import TemplatesGallery from './components/TemplatesGallery';
import SectionSelection from './components/SectionSelection';
import ResumeBuilder from './components/ResumeBuilder';

const AppContent = () => {
  const { state } = useResume();

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 'landing':
        return <LandingPage />;
      case 'gallery':
        return <TemplatesGallery />;
      case 'templates':
        return <TemplateSelection />;
      case 'sections':
        return <SectionSelection />;
      case 'builder':
        return <ResumeBuilder />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {renderCurrentStep()}
    </div>
  );
};

function App() {
  return (
    <ResumeProvider>
      <AppContent />
    </ResumeProvider>
  );
}

export default App;