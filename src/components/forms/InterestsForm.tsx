import React, { useState } from 'react';
import { 
  ArrowRight, 
  Undo2, 
  Plus, 
  X, 
  Heart,
  Music,
  Camera,
  Gamepad2,
  Book,
  Plane,
  Dumbbell,
  Palette
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

const InterestsForm = () => {
  const { state, dispatch } = useResume();
  const { interests } = state.resumeData;
  const [newInterest, setNewInterest] = useState('');

  const popularInterests = [
    { name: 'Photography', icon: Camera },
    { name: 'Music', icon: Music },
    { name: 'Gaming', icon: Gamepad2 },
    { name: 'Reading', icon: Book },
    { name: 'Travel', icon: Plane },
    { name: 'Fitness', icon: Dumbbell },
    { name: 'Art & Design', icon: Palette },
    { name: 'Cooking', icon: Heart }
  ];

  const addInterestFromSuggestion = (interestName: string) => {
    if (!interests.includes(interestName)) {
      const updatedInterests = [...interests, interestName];
      dispatch({
        type: 'UPDATE_RESUME_DATA',
        payload: { interests: updatedInterests }
      });
    }
  };

  const addCustomInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      const updatedInterests = [...interests, newInterest.trim()];
      dispatch({
        type: 'UPDATE_RESUME_DATA',
        payload: { interests: updatedInterests }
      });
      setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove: string) => {
    const updatedInterests = interests.filter(interest => interest !== interestToRemove);
    dispatch({
      type: 'UPDATE_RESUME_DATA',
      payload: { interests: updatedInterests }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addCustomInterest();
    }
  };

  const handleNext = () => {
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

  return (
    <div className="max-w-md mx-auto">
      {/* Info Box */}
      <div className="bg-accent text-background p-4 rounded-lg mb-8 relative">
        <h3 className="font-bold text-sm mb-2">INTERESTS & HOBBIES</h3>
        <p className="text-sm">
          Add your personal interests and hobbies to show your personality and cultural fit with potential employers.
        </p>
        
        {/* Character Illustration */}
        <div className="absolute -right-2 -top-2">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center">
            <Heart className="text-accent w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Popular Suggestions */}
      <div className="mb-6">
        <h4 className="text-primaryText font-medium mb-4">Popular Interests</h4>
        <div className="grid grid-cols-2 gap-3">
          {popularInterests.map((interest) => {
            const IconComponent = interest.icon;
            return (
              <button
                key={interest.name}
                onClick={() => addInterestFromSuggestion(interest.name)}
                disabled={interests.includes(interest.name)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  interests.includes(interest.name)
                    ? 'bg-border text-primaryText/50 cursor-not-allowed'
                    : 'bg-card border border-border text-primaryText hover:border-accent hover:text-accent hover:scale-105'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{interest.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Interests */}
      {interests.length > 0 && (
        <div className="mb-6">
          <h4 className="text-primaryText font-medium mb-4">Your Interests</h4>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <div
                key={index}
                className="bg-accent/10 border border-accent/30 text-accent px-3 py-2 rounded-lg flex items-center space-x-2 group"
              >
                <span className="text-sm font-medium">{interest}</span>
                <button
                  onClick={() => removeInterest(interest)}
                  className="text-accent/60 hover:text-accent transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Interest */}
      <div className="mb-8">
        <h4 className="text-primaryText font-medium mb-4">Add Custom Interest</h4>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your interest"
            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
          <button
            onClick={addCustomInterest}
            disabled={!newInterest.trim() || interests.includes(newInterest.trim())}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              newInterest.trim() && !interests.includes(newInterest.trim())
                ? 'bg-accent hover:bg-accent/90 text-background hover:scale-105'
                : 'bg-border text-primaryText/50 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

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

export default InterestsForm;