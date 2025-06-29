import React from 'react';
import { ArrowRight, ArrowLeft, Eye, Download, Star } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import TemplatePreview from './templates/TemplatePreview';

const TemplatesGallery = () => {
  const { dispatch } = useResume();

  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean and modern design with cyan accents, perfect for tech and creative professionals',
      category: 'Professional',
      rating: 4.9,
      downloads: '12.5k',
      features: ['ATS Friendly', 'Modern Design', 'Color Customizable', 'Skills Progress Bars'],
      colors: ['#00FFCC', '#3DDC91', '#00E6B8'],
      useImagePreview: true,
      image: '/src/assets/CVv1.png'
    },
    {
      id: 'professional',
      name: 'Professional Clean',
      description: 'Classic professional layout with teal accents, ideal for corporate and business roles',
      category: 'Corporate',
      rating: 4.8,
      downloads: '8.2k',
      features: ['Timeline Design', 'Professional Layout', 'Contact Icons', 'Skills Categories'],
      colors: ['#14B8A6', '#0F766E', '#134E4A'],
      useImagePreview: true,
      image: '/src/assets/CVv2.png'
    },
    {
      id: 'creative',
      name: 'Creative Designer',
      description: 'Bold and creative design for designers, artists, and creative professionals',
      category: 'Creative',
      rating: 4.7,
      downloads: '6.8k',
      features: ['Creative Layout', 'Portfolio Section', 'Visual Elements', 'Color Gradients'],
      colors: ['#8B5CF6', '#A855F7', '#9333EA'],
      comingSoon: true
    },
    {
      id: 'minimal',
      name: 'Minimal Elegance',
      description: 'Simple and elegant design focusing on content and readability',
      category: 'Minimal',
      rating: 4.6,
      downloads: '5.1k',
      features: ['Clean Typography', 'Minimal Design', 'Easy to Read', 'Space Efficient'],
      colors: ['#6B7280', '#374151', '#1F2937'],
      comingSoon: true
    },
    {
      id: 'executive',
      name: 'Executive Premium',
      description: 'Premium design for senior executives and management positions',
      category: 'Executive',
      rating: 4.9,
      downloads: '4.3k',
      features: ['Executive Style', 'Premium Look', 'Leadership Focus', 'Achievement Highlights'],
      colors: ['#DC2626', '#B91C1C', '#991B1B'],
      comingSoon: true
    },
    {
      id: 'academic',
      name: 'Academic Scholar',
      description: 'Perfect for researchers, professors, and academic professionals',
      category: 'Academic',
      rating: 4.5,
      downloads: '3.7k',
      features: ['Publication Focus', 'Research Highlights', 'Academic Format', 'Citation Ready'],
      colors: ['#059669', '#047857', '#065F46'],
      comingSoon: true
    }
  ];

  const categories = ['All', 'Professional', 'Corporate', 'Creative', 'Minimal', 'Executive', 'Academic'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [hoveredTemplate, setHoveredTemplate] = React.useState<string | null>(null);

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template?.comingSoon) return;
    
    dispatch({ type: 'SET_TEMPLATE', payload: templateId });
    dispatch({ type: 'SET_STEP', payload: 'sections' });
  };

  const handleBackToHome = () => {
    dispatch({ type: 'SET_STEP', payload: 'landing' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <div className="pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={handleBackToHome}
            className="flex items-center space-x-2 text-primaryText hover:text-accent mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-primaryText mb-6">
              Choose Your Perfect
              <br />
              <span className="text-heading">Resume Template</span>
            </h1>
            <p className="text-xl text-primaryText/80 max-w-3xl mx-auto mb-8">
              Professional, ATS-friendly resume templates with AI-powered content generation. 
              Customize colors, add your information, and download your perfect resume in minutes.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-2xl font-bold text-accent">2</div>
                <div className="text-sm text-primaryText/60">Templates Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">AI</div>
                <div className="text-sm text-primaryText/60">Content Generation</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">Free</div>
                <div className="text-sm text-primaryText/60">No Watermarks</div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-accent text-background shadow-lg shadow-accent/20'
                    : 'bg-card border border-border text-primaryText hover:border-accent/50 hover:text-accent'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template, index) => (
              <div
                key={template.id}
                className="group relative animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
              >
                <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-accent/50">
                  {/* Template Preview */}
                  <div className="relative overflow-hidden bg-gray-100">
                    <div className="w-full h-64 flex items-center justify-center p-4">
                      <div className="w-full h-full max-w-[180px] shadow-lg">
                        {template.useImagePreview ? (
                          <img 
                            src={template.image}
                            alt={template.name}
                            className="w-full h-full object-cover object-center rounded border border-gray-200"
                            style={{
                              objectFit: 'cover',
                              objectPosition: 'center top'
                            }}
                          />
                        ) : (
                          <TemplatePreview 
                            templateId={template.id} 
                            className="w-full h-full rounded border border-gray-200"
                          />
                        )}
                      </div>
                    </div>
                    
                    {/* Coming Soon Overlay */}
                    {template.comingSoon && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="bg-accent text-background px-4 py-2 rounded-full font-bold">
                          Coming Soon
                        </div>
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
                      hoveredTemplate === template.id && !template.comingSoon ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <div className="flex space-x-4">
                        <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleTemplateSelect(template.id)}
                          className="bg-accent text-background p-3 rounded-full hover:bg-accent/90 transition-colors"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-accent/90 text-background px-3 py-1 rounded-full text-sm font-medium">
                        {template.category}
                      </span>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{template.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-primaryText group-hover:text-accent transition-colors">
                        {template.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-primaryText/60">
                        <Download className="w-4 h-4" />
                        <span className="text-sm">{template.downloads}</span>
                      </div>
                    </div>
                    
                    <p className="text-primaryText/70 text-sm mb-4 leading-relaxed">
                      {template.description}
                    </p>

                    {/* Color Palette */}
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-xs text-primaryText/60">Colors:</span>
                      <div className="flex space-x-1">
                        {template.colors.map((color, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="w-4 h-4 rounded-full border border-border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {template.features.slice(0, 3).map((feature, featureIndex) => (
                        <span
                          key={featureIndex}
                          className="bg-background text-primaryText px-2 py-1 rounded text-xs border border-border"
                        >
                          {feature}
                        </span>
                      ))}
                      {template.features.length > 3 && (
                        <span className="text-accent text-xs font-medium">
                          +{template.features.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleTemplateSelect(template.id)}
                      disabled={template.comingSoon}
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                        template.comingSoon
                          ? 'bg-border text-primaryText/50 cursor-not-allowed'
                          : 'bg-accent hover:bg-accent/90 text-background hover:scale-105 hover:shadow-lg hover:shadow-accent/20'
                      }`}
                    >
                      <span>{template.comingSoon ? 'Coming Soon' : 'Use This Template'}</span>
                      {!template.comingSoon && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-primaryText mb-4">
                Ready to build your resume? <span className="text-accent">Start with our Modern template!</span>
              </h2>
              <p className="text-primaryText/70 mb-6">
                Create a professional resume with AI-powered content generation, custom colors, and instant download.
              </p>
              <button
                onClick={() => handleTemplateSelect('modern')}
                className="bg-loginBtn hover:bg-loginBtn/90 text-background px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-loginBtn/20 flex items-center space-x-2 mx-auto group"
              >
                <span>Start Building Your Resume</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesGallery;