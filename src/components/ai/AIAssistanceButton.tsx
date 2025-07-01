import React, { useState } from 'react';
import { Sparkles, RefreshCw, Lightbulb, Wand2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AIAssistanceButtonProps {
  type: 'suggest' | 'rephrase' | 'improve';
  section?: string;
  currentText?: string;
  context?: string;
  style?: 'professional' | 'concise' | 'detailed' | 'actionOriented';
  onResult: (result: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const AIAssistanceButton: React.FC<AIAssistanceButtonProps> = ({
  type,
  section,
  currentText,
  context,
  style = 'professional',
  onResult,
  className = '',
  size = 'md'
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getButtonConfig = () => {
    switch (type) {
      case 'suggest':
        return {
          icon: Lightbulb,
          text: 'Get Suggestions',
          bgColor: 'bg-blue-100 hover:bg-blue-200',
          textColor: 'text-blue-800',
          endpoint: '/api/ai/suggest-content'
        };
      case 'rephrase':
        return {
          icon: RefreshCw,
          text: 'Rephrase',
          bgColor: 'bg-green-100 hover:bg-green-200',
          textColor: 'text-green-800',
          endpoint: '/api/ai/rephrase'
        };
      case 'improve':
        return {
          icon: Wand2,
          text: 'Improve',
          bgColor: 'bg-purple-100 hover:bg-purple-200',
          textColor: 'text-purple-800',
          endpoint: '/api/ai/improve-section'
        };
      default:
        return {
          icon: Sparkles,
          text: 'AI Assist',
          bgColor: 'bg-accent/10 hover:bg-accent/20',
          textColor: 'text-accent',
          endpoint: '/api/ai/suggest-content'
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'lg':
        return 'px-4 py-3 text-sm';
      default:
        return 'px-3 py-2 text-sm';
    }
  };

  const handleAIAssist = async () => {
    const config = getButtonConfig();
    
    // Validation
    if (type === 'rephrase' && (!currentText || currentText.trim().length === 0)) {
      setError('Please enter some text to rephrase');
      return;
    }

    if (type === 'suggest' && !section) {
      setError('Section is required for suggestions');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let body: any = {};

      switch (type) {
        case 'suggest':
          body = { section, context: context || '' };
          break;
        case 'rephrase':
          body = { text: currentText, style };
          break;
        case 'improve':
          body = { sectionType: section, sectionData: currentText };
          break;
      }

      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'AI assistance failed');
      }

      // Extract result based on response structure
      let result = '';
      if (data.data?.suggestions) {
        result = data.data.suggestions;
      } else if (data.data?.rephrasedText) {
        result = data.data.rephrasedText;
      } else if (data.data?.improvements) {
        result = data.data.improvements;
      } else {
        result = 'AI assistance completed';
      }

      onResult(result);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'AI assistance failed');
    } finally {
      setLoading(false);
    }
  };

  const config = getButtonConfig();
  const Icon = config.icon;

  return (
    <div className="relative">
      <button
        onClick={handleAIAssist}
        disabled={loading}
        className={`
          flex items-center space-x-1.5 rounded-lg transition-all duration-200 
          font-medium disabled:opacity-50 disabled:cursor-not-allowed
          ${config.bgColor} ${config.textColor} ${getSizeClasses()} ${className}
        `}
      >
        <Icon className={`${loading ? 'animate-spin' : ''} ${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'}`} />
        <span>{loading ? 'Processing...' : config.text}</span>
      </button>

      {error && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-red-100 border border-red-300 rounded-lg text-xs text-red-700 whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  );
};

export default AIAssistanceButton; 