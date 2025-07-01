import React, { useState } from 'react';
import { 
  ArrowRight, 
  Undo2, 
  Edit3, 
  Sparkles, 
  RotateCcw, 
  Copy, 
  Check, 
  User, 
  Lightbulb,
  Target,
  Briefcase
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import AIAssistanceButton from '../ai/AIAssistanceButton';

const AboutMeForm = () => {
  const { state, dispatch } = useResume();
  const { aboutMe, personalInfo, workExperience } = state.resumeData;
  const [currentText, setCurrentText] = useState(aboutMe || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedTone, setSelectedTone] = useState<'professional' | 'creative' | 'friendly'>('professional');
  const [aiSuggestions, setAiSuggestions] = useState<string>('');

  const tones = [
    { 
      id: 'professional', 
      name: 'Professional', 
      icon: Briefcase,
      description: 'Formal and business-focused tone'
    },
    { 
      id: 'creative', 
      name: 'Creative', 
      icon: Lightbulb,
      description: 'Innovative and expressive tone'
    },
    { 
      id: 'friendly', 
      name: 'Friendly', 
      icon: User,
      description: 'Approachable and personable tone'
    }
  ];

  const generateAIDescription = () => {
    setIsGenerating(true);
    
    // Simulate AI generation with realistic delay
    setTimeout(() => {
      const name = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || 'Professional';
      const position = personalInfo.position || 'experienced professional';
      const hasExperience = workExperience.length > 0;
      const latestJob = hasExperience ? workExperience[0] : null;

      let generatedText = '';

      switch (selectedTone) {
        case 'professional':
          if (hasExperience && latestJob) {
            generatedText = `${name} is a dedicated ${position} with proven expertise in ${latestJob.company ? `working at ${latestJob.company}` : 'the industry'}. With a strong background in ${latestJob.position || 'professional development'}, I bring valuable skills and experience to drive organizational success. My commitment to excellence and continuous learning enables me to deliver high-quality results while contributing to team objectives and company growth.`;
          } else {
            generatedText = `${name} is a motivated ${position} with a passion for excellence and continuous professional development. I am committed to leveraging my skills and knowledge to contribute meaningfully to organizational success. My dedication to quality work and collaborative approach make me a valuable addition to any team environment.`;
          }
          break;

        case 'creative':
          if (hasExperience && latestJob) {
            generatedText = `${name} is an innovative ${position} who thrives on creative challenges and transformative solutions. My journey at ${latestJob.company || 'various organizations'} has shaped my unique perspective on ${latestJob.position || 'professional excellence'}. I believe in pushing boundaries, thinking outside the box, and bringing fresh ideas that make a real impact. Every project is an opportunity to create something meaningful and inspiring.`;
          } else {
            generatedText = `${name} is a creative and forward-thinking ${position} with a passion for innovation and meaningful work. I approach every challenge with curiosity and enthusiasm, always seeking unique solutions that make a difference. My creative mindset and fresh perspective enable me to contribute original ideas and drive positive change in any environment.`;
          }
          break;

        case 'friendly':
          if (hasExperience && latestJob) {
            generatedText = `Hi! I'm ${personalInfo.firstName || 'a passionate professional'}, a ${position} who loves what I do. My experience at ${latestJob.company || 'various companies'} has taught me the value of teamwork, communication, and building great relationships. I'm someone who enjoys collaborating with others, sharing knowledge, and creating a positive work environment where everyone can thrive and succeed together.`;
          } else {
            generatedText = `Hi! I'm ${personalInfo.firstName || 'a motivated individual'}, a ${position} who's excited about new opportunities and challenges. I believe in the power of collaboration, positive communication, and building meaningful professional relationships. I'm always eager to learn, grow, and contribute to a team where we can achieve great things together.`;
          }
          break;
      }

      setCurrentText(generatedText);
      setIsGenerating(false);
    }, 2000);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentText(e.target.value);
  };

  const saveAboutMe = () => {
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { aboutMe: currentText }
    });
  };

  const resetText = () => {
    setCurrentText(aboutMe || '');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAISuggestion = (suggestions: string) => {
    setAiSuggestions(suggestions);
  };

  const handleAIRephrase = (rephrasedText: string) => {
    setCurrentText(rephrasedText);
  };

  const handleNext = () => {
    saveAboutMe();
    const currentIndex = state.availableBuildSteps.findIndex(step => step === state.builderStep);
    const nextStep = state.availableBuildSteps[currentIndex + 1];
    if (nextStep) {
      dispatch({ type: 'SET_BUILDER_STEP', payload: nextStep });
    }
  };

  const handleUndo = () => {
    const currentIndex = state.availableBuildSteps.findIndex(step => step === state.builderStep);
    const prevStep = state.availableBuildSteps[currentIndex - 1];
    if (prevStep) {
      dispatch({ type: 'SET_BUILDER_STEP', payload: prevStep });
    }
  };

  // Auto-save when text changes
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentText !== aboutMe) {
        saveAboutMe();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [currentText]);

  return (
    <div className="max-w-md mx-auto">
      {/* Info Box */}
      <div className="bg-accent text-background p-4 rounded-lg mb-8 relative">
        <h3 className="font-bold text-sm mb-2">WRITE A FEW WORDS ABOUT YOURSELF</h3>
        <p className="text-sm">
          Introduce yourself, describe who you are. If you're out of ideas, use ✨ AI to generate a description based on your Resume.
        </p>
        
        {/* Character Illustration */}
        <div className="absolute -right-2 -top-2">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center">
            <Edit3 className="text-accent w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tone Selection */}
      <div className="mb-6">
        <h4 className="text-primaryText font-medium mb-4 flex items-center">
          <Target className="w-4 h-4 mr-2 text-accent" />
          Choose Your Tone
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {tones.map((tone) => {
            const IconComponent = tone.icon;
            return (
              <button
                key={tone.id}
                onClick={() => setSelectedTone(tone.id as 'professional' | 'creative' | 'friendly')}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                  selectedTone === tone.id
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border text-primaryText hover:border-accent/50'
                }`}
              >
                <IconComponent className="w-5 h-5 mx-auto mb-2" />
                <div className="text-xs font-medium">{tone.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Assistance Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-blue-900 mb-3">AI Writing Assistant</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          <AIAssistanceButton
            type="suggest"
            section="aboutMe"
            context={`Name: ${personalInfo.firstName} ${personalInfo.lastName}, Position: ${personalInfo.position || 'professional'}, Tone: ${selectedTone}`}
            onResult={handleAISuggestion}
            size="sm"
          />
          {currentText && (
            <>
              <AIAssistanceButton
                type="rephrase"
                currentText={currentText}
                style="professional"
                onResult={handleAIRephrase}
                size="sm"
              />
              <AIAssistanceButton
                type="improve"
                section="aboutMe"
                currentText={currentText}
                onResult={handleAIRephrase}
                size="sm"
              />
            </>
          )}
        </div>
        
        {/* AI Suggestions Display */}
        {aiSuggestions && (
          <div className="p-3 bg-white border border-blue-200 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">AI Suggestions:</h5>
            <div className="text-sm text-blue-800 whitespace-pre-wrap">{aiSuggestions}</div>
            <button
              onClick={() => setCurrentText(aiSuggestions)}
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Use This Text
            </button>
          </div>
        )}
      </div>

      {/* Main Text Area */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-primaryText font-medium">Write a few words about yourself</h4>
          <div className="flex items-center space-x-2">
            {currentText && (
              <>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-1 px-3 py-1 bg-card border border-border text-primaryText rounded text-sm hover:border-accent transition-colors"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  onClick={resetText}
                  className="flex items-center space-x-1 px-3 py-1 bg-card border border-border text-primaryText rounded text-sm hover:border-accent transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </>
            )}
            <button
              onClick={generateAIDescription}
              disabled={isGenerating || !personalInfo.firstName}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                personalInfo.firstName && !isGenerating
                  ? 'bg-accent text-background hover:bg-accent/90'
                  : 'bg-border text-primaryText/50 cursor-not-allowed'
              }`}
            >
              <Sparkles className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Generating...' : 'AI'}</span>
            </button>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={currentText}
            onChange={handleTextChange}
            placeholder="Introduce yourself here... Describe your professional background, key skills, and what makes you unique. Keep it concise and engaging."
            rows={8}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
          />
          
          {/* Character Count */}
          <div className="absolute bottom-3 right-3 text-xs text-primaryText/50">
            {currentText.length}/500
          </div>
        </div>

        {/* Writing Tips */}
        <div className="mt-4 bg-card border border-border rounded-lg p-4">
          <h5 className="text-primaryText font-medium mb-3 flex items-center">
            <Lightbulb className="w-4 h-4 mr-2 text-accent" />
            Writing Tips
          </h5>
          <ul className="text-primaryText/70 text-sm space-y-2">
            <li className="flex items-start">
              <Check className="w-4 h-4 text-heading mr-2 mt-0.5 flex-shrink-0" />
              <span>Keep it concise - aim for 2-4 sentences</span>
            </li>
            <li className="flex items-start">
              <Check className="w-4 h-4 text-heading mr-2 mt-0.5 flex-shrink-0" />
              <span>Highlight your key strengths and experience</span>
            </li>
            <li className="flex items-start">
              <Check className="w-4 h-4 text-heading mr-2 mt-0.5 flex-shrink-0" />
              <span>Match the tone to your industry and role</span>
            </li>
            <li className="flex items-start">
              <Check className="w-4 h-4 text-heading mr-2 mt-0.5 flex-shrink-0" />
              <span>Focus on what value you bring to employers</span>
            </li>
          </ul>
        </div>
      </div>

      {/* AI Generation Status */}
      {isGenerating && (
        <div className="mb-6 bg-accent/10 border border-accent/30 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-accent animate-spin" />
            <div>
              <div className="text-accent font-medium">AI is generating your description...</div>
              <div className="text-accent/70 text-sm">This may take a few seconds</div>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {currentText && !isGenerating && (
        <div className="mb-6 bg-card border border-border rounded-lg p-4">
          <h5 className="text-primaryText font-medium mb-3">Preview</h5>
          <p className="text-primaryText/80 text-sm leading-relaxed">
            {currentText}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleNext}
          className="w-full bg-accent hover:bg-accent/90 text-background py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
        >
          <span>NEXT</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        
        <button
          onClick={handleUndo}
          className="w-full bg-card border border-border hover:border-accent text-primaryText py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
        >
          <Undo2 className="w-5 h-5" />
          <span>UNDO</span>
        </button>
      </div>
    </div>
  );
};

export default AboutMeForm;