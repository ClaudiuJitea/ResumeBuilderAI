import { Check, ArrowRight, Sparkles, Smartphone, Ruler, Diamond, Download } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

const LandingPage = () => {
  const { dispatch } = useResume();

  const features = [
    'Your Professional Resume, Ready in Minutes',
    'FREE Download, AI and fully customizable Resume',
    'Upgrade Your Resume. Upgrade Your Future.'
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-slide-up">
              <div className="inline-block bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium mb-8">
                Free AI Resume Builder
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-primaryText mb-8 leading-tight">
                Create Modern
                <br />
                <span className="text-heading">Resume</span> in Just
                <br />
                <span className="text-accent">5 Minutes</span>
              </h1>

              <div className="space-y-4 mb-12">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="bg-heading p-1 rounded-full">
                      <Check className="w-4 h-4 text-background" />
                    </div>
                    <span className="text-primaryText text-lg">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => dispatch({ type: 'SET_STEP', payload: 'templates' })}
                className="bg-loginBtn hover:bg-loginBtn/90 text-background px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-loginBtn/20 flex items-center space-x-2 group"
              >
                <span>Build My Resume</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right Content - Character Illustration */}
            <div className="relative animate-fade-in">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-card rounded-2xl shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300 p-8 border border-border">
                    {/* Computer Asset Illustration */}
                    <div className="flex flex-col items-center justify-center h-64">
                      <img 
                        src="/src/assets/computer.png" 
                        alt="Computer illustration" 
                        className="w-32 h-32 object-contain mb-4"
                      />
                      <div className="text-center">
                        <h3 className="text-primaryText font-semibold mb-2">Build Your Resume</h3>
                        <p className="text-primaryText/60 text-sm">Create professional resumes with ease</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card rounded-2xl shadow-xl transform -rotate-1 hover:rotate-0 transition-transform duration-300 p-6 border border-border">
                    {/* Pencil Asset Illustration */}
                    <div className="flex flex-col items-center justify-center h-48">
                      <img 
                        src="/src/assets/pencil.png" 
                        alt="Pencil illustration" 
                        className="w-24 h-24 object-contain mb-4"
                      />
                      <div className="text-center">
                        <h3 className="text-primaryText font-semibold mb-2">Edit & Customize</h3>
                        <p className="text-primaryText/60 text-sm">Personalize every detail</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 mt-8">
                  <div className="bg-card rounded-2xl shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-300 p-6 border border-border">
                    {/* Tie Asset Illustration */}
                    <div className="flex flex-col items-center justify-center h-48">
                      <img 
                        src="/src/assets/tie.png" 
                        alt="Professional tie illustration" 
                        className="w-24 h-24 object-contain mb-4"
                      />
                      <div className="text-center">
                        <h3 className="text-primaryText font-semibold mb-2">Professional Look</h3>
                        <p className="text-primaryText/60 text-sm">Stand out professionally</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card rounded-2xl shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-300 p-8 border border-border">
                    {/* File Asset Illustration */}
                    <div className="flex flex-col items-center justify-center h-64">
                      <img 
                        src="/src/assets/file.png" 
                        alt="File illustration" 
                        className="w-32 h-32 object-contain mb-4"
                      />
                      <div className="text-center">
                        <h3 className="text-primaryText font-semibold mb-2">Download Resume</h3>
                        <p className="text-primaryText/60 text-sm">Get your professional resume ready</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="py-20 bg-card relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent/30 to-heading/30"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl lg:text-6xl font-bold text-primaryText mb-6 leading-tight">
              Why Choose
              <br />
              <span className="text-heading">Our Resume</span> 
              <span className="text-accent">Builder?</span>
            </h2>
            <p className="text-xl text-primaryText/80 max-w-3xl mx-auto">
              Create professional, ATS-friendly resumes with AI-powered features and beautiful templates
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Feature 1 - AI Powered */}
            <div className="order-2 lg:order-1">
              <div className="bg-background rounded-2xl p-8 border border-border shadow-xl hover:shadow-2xl hover:border-accent/30 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
                    <span className="text-background font-bold text-lg">AI</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primaryText">Powered by AI</h3>
                    <p className="text-accent font-medium">Smart Content Generation</p>
                  </div>
                </div>
                <p className="text-primaryText/80 text-lg leading-relaxed mb-6">
                  Our AI will generate professional job descriptions, suggest relevant skills, and 
                  even recommend jobs you're a great fit for — all tailored to your profile and industry.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium">Smart Suggestions</span>
                  <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium">Auto-Complete</span>
                  <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium">Industry Specific</span>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-accent/20 to-heading/20 rounded-2xl flex items-center justify-center border border-accent/30 shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="text-background w-12 h-12" />
                    </div>
                    <h4 className="text-xl font-bold text-primaryText mb-2">AI Assistant</h4>
                    <p className="text-primaryText/60">Intelligent content generation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 - Responsive Layout */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-heading/20 to-accent/20 rounded-2xl flex items-center justify-center border border-heading/30 shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-heading rounded-full flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="text-background w-12 h-12" />
                    </div>
                    <h4 className="text-xl font-bold text-primaryText mb-2">Responsive Design</h4>
                    <p className="text-primaryText/60">Perfect on any device</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-background rounded-2xl p-8 border border-border shadow-xl hover:shadow-2xl hover:border-heading/30 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-heading rounded-full flex items-center justify-center mr-4">
                    <Ruler className="text-background w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primaryText">Responsive Layout Scaling</h3>
                    <p className="text-heading font-medium">Perfect Fit Every Time</p>
                  </div>
                </div>
                <p className="text-primaryText/80 text-lg leading-relaxed mb-6">
                  Only Modern Resume offers responsive layout scaling, allowing your resume to 
                  perfectly fit a single page — no matter how much content you include.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-heading/20 text-heading px-3 py-1 rounded-full text-sm font-medium">Auto-Scaling</span>
                  <span className="bg-heading/20 text-heading px-3 py-1 rounded-full text-sm font-medium">Single Page</span>
                  <span className="bg-heading/20 text-heading px-3 py-1 rounded-full text-sm font-medium">Perfect Fit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 - Free & Professional */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="order-2 lg:order-1">
              <div className="bg-background rounded-2xl p-8 border border-border shadow-xl hover:shadow-2xl hover:border-loginBtn/30 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-loginBtn rounded-full flex items-center justify-center mr-4">
                    <Diamond className="text-background w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primaryText">Professional & Affordable</h3>
                    <p className="text-loginBtn font-medium">Flexible Plans – Full Access at a Fair Price</p>
                  </div>
                </div>
                <p className="text-primaryText/80 text-lg leading-relaxed mb-6">
                  Create unlimited resumes, download in PDF format, and unlock all premium features with a simple, transparent subscription.\nNo hidden fees, no watermarks – just job-winning resumes that work.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-loginBtn/20 text-loginBtn px-3 py-1 rounded-full text-sm font-medium">No Watermarks</span>
                  <span className="bg-loginBtn/20 text-loginBtn px-3 py-1 rounded-full text-sm font-medium">Unlimited Downloads</span>
                  <span className="bg-loginBtn/20 text-loginBtn px-3 py-1 rounded-full text-sm font-medium">Premium Features</span>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-loginBtn/20 to-accent/20 rounded-2xl flex items-center justify-center border border-loginBtn/30 shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-loginBtn rounded-full flex items-center justify-center mx-auto mb-4">
                      <Download className="text-background w-12 h-12" />
                    </div>
                    <h4 className="text-xl font-bold text-primaryText mb-2">Affordable & Transparent</h4>
                    <p className="text-primaryText/60">No Hidden Fees – Cancel Anytime</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-20">
            <div className="bg-gradient-to-r from-accent/10 to-heading/10 rounded-3xl p-12 border border-accent/20 shadow-xl transform hover:scale-[1.02] transition-all duration-300">
              <h3 className="text-3xl font-bold text-primaryText mb-4">
                Ready to Create Your Perfect Resume?
              </h3>
              <p className="text-xl text-primaryText/80 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who have successfully landed their dream jobs with our AI-powered resume builder.
              </p>
              <button
                onClick={() => dispatch({ type: 'SET_STEP', payload: 'templates' })}
                className="bg-gradient-to-r from-accent to-heading hover:from-heading hover:to-accent text-background px-12 py-4 rounded-2xl font-bold text-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-accent/25 flex items-center space-x-3 mx-auto group"
              >
                <span>Start Building Now</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;