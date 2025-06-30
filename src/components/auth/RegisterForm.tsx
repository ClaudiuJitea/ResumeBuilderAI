import React, { useState } from 'react';
import { UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RegisterCredentials } from '../../types/auth';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<RegisterCredentials>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await register(formData);
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-background" />
          </div>
          <h2 className="text-2xl font-bold text-primaryText mb-2">Create Account</h2>
          <p className="text-primaryText/60">Join us to start building your resume</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primaryText mb-2">
                First Name
              </label>
              <input
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-border rounded-lg bg-background text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="First name"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primaryText mb-2">
                Last Name
              </label>
              <input
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-border rounded-lg bg-background text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Last name"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primaryText mb-2">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-3 border border-border rounded-lg bg-background text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primaryText mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-3 border border-border rounded-lg bg-background text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Create a password"
              minLength={6}
              required
              disabled={isLoading}
            />
            <p className="mt-1 text-sm text-primaryText/60">
              Password must be at least 6 characters long
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent hover:bg-accent/90 text-background py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-primaryText/60">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-accent hover:text-accent/80 font-medium transition-colors"
              disabled={isLoading}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 