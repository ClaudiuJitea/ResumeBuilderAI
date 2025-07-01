import { ArrowRight, ArrowLeft, FolderOpen } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

const TemplateSelection = () => {
  const { dispatch } = useResume();

  const featuredTemplate = {
    id: 'professional',
    name: 'Professional Clean',
    image: '/src/assets/CVv2.png',
  };

  const otherTemplates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      image: '/src/assets/TemplateCV.png',
      color: 'bg-cyan-500'
    },
    {
      id: 'minimal',
      name: 'Minimal Elegant',
      image: '/src/assets/TemplateCV.png',
      color: 'bg-blue-500'
    },
    {
      id: 'creative',
      name: 'Creative Modern',
      image: '/src/assets/TemplateCV.png',
      color: 'bg-gray-500'
    },
  ];

  const handleTemplateSelect = (templateId: string) => {
    dispatch({ type: 'SET_TEMPLATE', payload: templateId });
    dispatch({ type: 'SET_STEP', payload: 'sections' });
  };

  const handleChooseLater = () => {
    dispatch({ type: 'SET_STEP', payload: 'sections' });
  };

  const handleGoToYourCVs = () => {
    dispatch({ type: 'SET_STEP', payload: 'yourCVs' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* Centered Main Content */}
          <div className="flex justify-center mb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-start max-w-4xl w-full">
              {/* Featured Template */}
              <div className="flex justify-center">
                <div
                  className="group cursor-pointer animate-scale-in w-full max-w-sm"
                  onClick={() => handleTemplateSelect(featuredTemplate.id)}
                >
                  <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden transform group-hover:scale-105 transition-all duration-300 group-hover:shadow-3xl p-6">
                    <div className="w-full h-80 bg-white rounded-lg flex items-center justify-center p-4 mb-4">
                      <img
                        src={featuredTemplate.image}
                        alt={featuredTemplate.name}
                        className="max-w-full max-h-full object-contain"
                        style={{
                          width: 'auto',
                          height: 'auto',
                          maxWidth: '100%',
                          maxHeight: '100%'
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-white text-lg">{featuredTemplate.name}</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Templates Sidebar */}
              <div className="animate-slide-up">
                <h2 className="text-2xl font-bold text-primaryText mb-6">
                  Other <span className="text-accent">Templates</span>
                </h2>
                <div className="space-y-4 mb-6">
                  {otherTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-slate-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-200 hover:shadow-xl p-4"
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded flex items-center justify-center p-1 flex-shrink-0 overflow-hidden">
                          <img
                            src={template.image}
                            alt={template.name}
                            className="w-full h-full object-cover rounded-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-base">{template.name}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* YourCVs Button */}
                <div
                  className="bg-accent rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-200 hover:shadow-xl hover:bg-accent/90 p-4"
                  onClick={handleGoToYourCVs}
                >
                  <div className="flex items-center justify-center space-x-3 text-black">
                    <FolderOpen className="w-6 h-6" />
                    <span className="text-base font-semibold">Go to YourCVs / Profiles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Choose Later Button */}
          <div className="text-center">
            <button
              onClick={handleChooseLater}
              className="bg-accent hover:bg-accent/90 text-background px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-accent/20 flex items-center space-x-2 mx-auto group"
            >
              <span>Skip for Now (Use Default)</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelection;