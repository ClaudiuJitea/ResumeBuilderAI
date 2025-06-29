import { useResume } from '../context/ResumeContext';

const Navigation = () => {
  const { state, dispatch } = useResume();

  if (state.currentStep !== 'landing') return null;

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] z-50 bg-background/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl shadow-black/20">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="text-heading font-bold text-xl bg-gradient-to-r from-accent to-heading bg-clip-text text-transparent">
              ResumeBuilder
            </div>
            <div className="hidden md:flex space-x-6">
              <button 
                onClick={() => dispatch({ type: 'SET_STEP', payload: 'gallery' })}
                className="text-primaryText hover:text-accent transition-all duration-200 font-medium relative group"
              >
                Resume Templates
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full rounded-full"></span>
              </button>
            </div>
          </div>
          <button 
            onClick={() => dispatch({ type: 'SET_STEP', payload: 'templates' })}
            className="bg-gradient-to-r from-loginBtn to-accent hover:from-accent hover:to-loginBtn text-background px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-accent/25 border border-accent/20"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;