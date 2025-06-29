import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

const TemplateSelection = () => {
  const { dispatch } = useResume();

  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      image: '/src/assets/CVv1.png',
    },
    {
      id: 'professional',
      name: 'Professional Clean',
      image: '/src/assets/CVv2.png',
    },
  ];

  const otherTemplates = [
    'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=200&h=280&fit=crop',
    'https://images.pexels.com/photos/4348402/pexels-photo-4348402.jpeg?auto=compress&cs=tinysrgb&w=200&h=280&fit=crop',
    'https://images.pexels.com/photos/4348403/pexels-photo-4348403.jpeg?auto=compress&cs=tinysrgb&w=200&h=280&fit=crop',
  ];

  const handleTemplateSelect = (templateId: string) => {
    dispatch({ type: 'SET_TEMPLATE', payload: templateId });
    dispatch({ type: 'SET_STEP', payload: 'sections' });
  };

  const handleChooseLater = () => {
    dispatch({ type: 'SET_STEP', payload: 'sections' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => dispatch({ type: 'SET_STEP', payload: 'landing' })}
            className="flex items-center space-x-2 text-primaryText hover:text-accent mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-primaryText mb-8">
              Choose your <span className="text-heading">template!</span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Main Templates */}
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-8">
                {templates.map((template, index) => (
                  <div
                    key={template.id}
                    className="group cursor-pointer animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform group-hover:scale-105 transition-all duration-300 group-hover:shadow-2xl">
                      <div className="w-full h-80 bg-gray-100 flex items-center justify-center p-4">
                        <img
                          src={template.image}
                          alt={template.name}
                          className="max-w-full max-h-full object-contain"
                          style={{
                            width: 'auto',
                            height: 'auto',
                            maxWidth: '100%',
                            maxHeight: '100%'
                          }}
                        />
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="font-semibold text-gray-800">{template.name}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Templates Sidebar */}
            <div className="animate-slide-up">
              <h2 className="text-2xl font-bold text-primaryText mb-6">
                Other <span className="text-accent">Templates</span>
              </h2>
              <div className="space-y-4 mb-8">
                {otherTemplates.map((image, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-200 hover:shadow-xl"
                    onClick={() => handleTemplateSelect(`other-${index}`)}
                  >
                    <img
                      src={image}
                      alt={`Template ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Choose Later Button */}
          <div className="text-center mt-16">
            <button
              onClick={handleChooseLater}
              className="bg-accent hover:bg-accent/90 text-background px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-accent/20 flex items-center space-x-2 mx-auto group"
            >
              <span>I'll choose later</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Character Illustration */}
          <div className="fixed bottom-8 right-8 lg:right-16">
            <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center shadow-lg">
              <span className="text-background text-sm font-medium">👤</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelection;