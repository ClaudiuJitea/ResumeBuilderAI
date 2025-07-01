import React, { useState, useEffect } from 'react';
import { Key, TestTube, Trash2, Save, Eye, EyeOff, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ApiKey {
  id: number;
  service: string;
  apiKey: string;
  selectedModel: string;
  isActive: number; // SQLite stores booleans as integers (0 or 1)
  createdAt: string;
  updatedAt: string;
}

const ApiKeyManagement: React.FC = () => {
  const { token } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('anthropic/claude-3.5-sonnet');
  const [testing, setTesting] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [availableModels, setAvailableModels] = useState([
    // Fallback models in case API fails
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'anthropic' },
    { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', provider: 'anthropic' },
    { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'openai' },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai' },
    { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai' },
    { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', provider: 'meta-llama' },
    { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B', provider: 'meta-llama' },
    { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5', provider: 'google' },
    { id: 'mistralai/mistral-large', name: 'Mistral Large', provider: 'mistralai' },
    { id: 'perplexity/llama-3.1-sonar-large-128k-online', name: 'Sonar Large Online', provider: 'perplexity' }
  ]);

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  };

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall('/admin/api-keys');
      setApiKeys(response.data.apiKeys);
      
      // Set current model if OpenRouter key exists
      const openrouterKey = response.data.apiKeys.find((key: ApiKey) => key.service === 'openrouter');
      if (openrouterKey && openrouterKey.selectedModel) {
        setSelectedModel(openrouterKey.selectedModel);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch API keys');
    } finally {
      setLoading(false);
    }
  };

  const fetchModels = async () => {
    try {
      setLoadingModels(true);
      const response = await apiCall('/admin/api-keys/openrouter/models');
      
      if (response.success && response.data.models) {
        setAvailableModels(response.data.models);
      }
    } catch (error) {
      console.warn('Failed to fetch models, using fallback list:', error);
      // Keep fallback models
    } finally {
      setLoadingModels(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const handleSaveApiKey = async () => {
    if (!newApiKey.trim()) {
      setError('API key is required');
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      
      await apiCall('/admin/api-keys', {
        method: 'POST',
        body: JSON.stringify({
          service: 'openrouter',
          apiKey: newApiKey.trim(),
          selectedModel: selectedModel
        }),
      });
      
      setSuccess('API key saved successfully');
      setNewApiKey('');
      fetchApiKeys();
      
      // Automatically fetch available models after saving API key
      setTimeout(() => {
        fetchModels();
      }, 1000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save API key');
    }
  };

  const handleTestApiKey = async () => {
    try {
      setTesting(true);
      setError(null);
      setSuccess(null);
      
      await apiCall('/admin/api-keys/openrouter/test', {
        method: 'POST',
      });
      
      setSuccess('API key test successful! AI service is working.');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'API key test failed');
    } finally {
      setTesting(false);
    }
  };

  const handleDeleteApiKey = async (service: string) => {
    if (!confirm(`Are you sure you want to delete the ${service} API key?`)) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      
      await apiCall(`/admin/api-keys/${service}`, {
        method: 'DELETE',
      });
      
      setSuccess('API key deleted successfully');
      fetchApiKeys();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete API key');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primaryText flex items-center space-x-3">
          <Key className="w-8 h-8 text-accent" />
          <span>API Key Management</span>
        </h1>
        <p className="text-primaryText/60 mt-2">
          Manage API keys for AI services used in the resume builder
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800">{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {/* Add/Update API Key Section */}
      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-primaryText mb-4">OpenRouter API Key</h2>
        <p className="text-primaryText/60 mb-4">
          Enter your OpenRouter API key to enable AI-powered features like CV parsing, content suggestions, and text rephrasing.
        </p>
        
        <div className="space-y-4">
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
              placeholder="sk-or-v1-..."
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent pr-12"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primaryText/60 hover:text-primaryText"
            >
              {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-primaryText">
                AI Model
              </label>
              <button
                onClick={fetchModels}
                disabled={loadingModels}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${loadingModels ? 'animate-spin' : ''}`} />
                <span>{loadingModels ? 'Loading...' : 'Refresh'}</span>
              </button>
            </div>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              disabled={loadingModels}
            >
              {availableModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.provider})
                </option>
              ))}
            </select>
            <p className="text-xs text-primaryText/60 mt-1">
              {availableModels.length > 10 
                ? `${availableModels.length} models available from OpenRouter`
                : 'Select the AI model to use for resume assistance'
              }
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleSaveApiKey}
              disabled={!newApiKey.trim()}
              className="flex items-center space-x-2 px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>Save API Key</span>
            </button>
          </div>
        </div>
      </div>

      {/* Current API Keys */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-primaryText mb-4">Current API Keys</h2>
        
        {apiKeys.length === 0 ? (
          <p className="text-primaryText/60">No API keys configured</p>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Key className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium text-primaryText capitalize">{apiKey.service}</h3>
                      <p className="text-sm text-primaryText/60">
                        Key: {apiKey.apiKey} • 
                        Model: {availableModels.find(m => m.id === apiKey.selectedModel)?.name || apiKey.selectedModel}
                      </p>
                      <p className="text-xs text-primaryText/40">
                        Last updated: {new Date(apiKey.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    apiKey.isActive === 1 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {apiKey.isActive === 1 ? 'Active' : 'Inactive'}
                  </span>
                  
                  <button
                    onClick={handleTestApiKey}
                    disabled={testing}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                  >
                    <TestTube className="w-4 h-4" />
                    <span>{testing ? 'Testing...' : 'Test'}</span>
                  </button>
                  
                  <button
                    onClick={() => handleDeleteApiKey(apiKey.service)}
                    className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">How to get an OpenRouter API Key:</h3>
        <ol className="list-decimal list-inside text-blue-800 space-y-1 text-sm">
          <li>Visit <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="underline">openrouter.ai</a> and create an account</li>
          <li>Go to the API Keys section in your dashboard</li>
          <li>Create a new API key</li>
          <li>Copy the key (it starts with "sk-or-v1-") and paste it above</li>
          <li>Click "Refresh" to load all available models from OpenRouter</li>
          <li>Select your preferred AI model from the complete list</li>
          <li>Test the key to ensure it's working correctly</li>
        </ol>
        <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-700">
          <strong>💡 Tip:</strong> The model list is fetched live from OpenRouter and includes all available models with current pricing and capabilities.
        </div>
      </div>
    </div>
  );
};

export default ApiKeyManagement; 