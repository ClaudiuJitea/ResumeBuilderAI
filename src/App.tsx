import React, { useEffect } from 'react';
import { ResumeProvider, useResume } from './context/ResumeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import TemplateSelection from './components/TemplateSelection';
import TemplatesGallery from './components/TemplatesGallery';
import SectionSelection from './components/SectionSelection';
import ResumeBuilder from './components/ResumeBuilder';
import AuthPage from './components/auth/AuthPage';
import AdminDashboard from './components/admin/AdminDashboard';
import YourCVs from './components/YourCVs';
import { loadGoogleFont, PROFESSIONAL_FONTS } from './utils/fonts';

const AppContent = () => {
  const { state } = useResume();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
          <p className="text-primaryText/60">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Show admin dashboard for admin users
  if (user?.role === 'admin' && state.currentStep === 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <AdminDashboard />
      </div>
    );
  }

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
      case 'yourCVs':
        return <YourCVs />;
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
  // Load essential fonts on app startup
  useEffect(() => {
    // Load the most commonly used professional fonts
    const essentialFonts = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins'];
    essentialFonts.forEach(fontFamily => {
      const font = PROFESSIONAL_FONTS.find(f => f.family === fontFamily);
      if (font) {
        loadGoogleFont(font.family, font.variants);
      }
    });
  }, []);

  return (
    <AuthProvider>
      <ResumeProvider>
        <AppContent />
      </ResumeProvider>
    </AuthProvider>
  );
}

export default App;