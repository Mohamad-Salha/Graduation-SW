'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ValidationState {
  email: boolean | null;
  password: boolean | null;
  confirmPassword: boolean | null;
  name: boolean | null;
  phone: boolean | null;
}

interface FormData {
  email: string;
  name: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

const SignupPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const [validation, setValidation] = useState<ValidationState>({
    email: null,
    password: null,
    confirmPassword: null,
    name: null,
    phone: null,
  });

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validatePassword = (value: string): boolean => {
    return value.length >= 6;
  };

  const validatePhone = (value: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(value);
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Real-time validation
    if (field === 'email' && typeof value === 'string') {
      setValidation(prev => ({ 
        ...prev, 
        email: value.length > 0 ? validateEmail(value) : null 
      }));
    } else if (field === 'password' && typeof value === 'string') {
      setValidation(prev => ({ 
        ...prev, 
        password: value.length > 0 ? validatePassword(value) : null 
      }));
      if (formData.confirmPassword.length > 0) {
        setValidation(prev => ({ 
          ...prev, 
          confirmPassword: formData.confirmPassword === value 
        }));
      }
    } else if (field === 'confirmPassword' && typeof value === 'string') {
      setValidation(prev => ({ 
        ...prev, 
        confirmPassword: value.length > 0 ? value === formData.password : null 
      }));
    } else if (field === 'phone' && typeof value === 'string') {
      setValidation(prev => ({ 
        ...prev, 
        phone: value.length > 0 ? validatePhone(value) : null 
      }));
    } else if (field === 'name' && typeof value === 'string') {
      setValidation(prev => ({ 
        ...prev, 
        name: value.length >= 2 
      }));
    }
  };

  const canSubmit = 
    validation.email === true &&
    validation.name === true &&
    validation.phone === true &&
    validation.password === true &&
    validation.confirmPassword === true &&
    formData.acceptTerms &&
    formData.acceptPrivacy;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Signup failed');
      }

      const result = await response.json();
      setSuccess(result.message || 'Signup successful! Waiting for admin approval.');
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05))] bg-[length:60px_60px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-lg mx-auto">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center space-x-2 mb-6 hover:opacity-80 transition-opacity">
              <span className="text-3xl font-bold text-white">
                🚗 DriveMaster Pro
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">
              Create Your Account
            </h1>
            <p className="text-white/80">
              Join thousands of students learning to drive with confidence
            </p>
          </div>

          {/* Signup Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-sm">
                  {success}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 text-base rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    validation.name === true
                      ? 'border-green-500 bg-green-50/30'
                      : validation.name === false
                      ? 'border-red-500 bg-red-50/30'
                      : 'border-gray-300 bg-white'
                  }`}
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 text-base rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    validation.email === true
                      ? 'border-green-500 bg-green-50/30'
                      : validation.email === false
                      ? 'border-red-500 bg-red-50/30'
                      : 'border-gray-300 bg-white'
                  }`}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-4 py-3 text-base rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    validation.phone === true
                      ? 'border-green-500 bg-green-50/30'
                      : validation.phone === false
                      ? 'border-red-500 bg-red-50/30'
                      : 'border-gray-300 bg-white'
                  }`}
                  placeholder="+961-123-4567"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 text-base rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                      validation.password === true
                        ? 'border-green-500 bg-green-50/30'
                        : validation.password === false
                        ? 'border-red-500 bg-red-50/30'
                        : 'border-gray-300 bg-white'
                    }`}
                    placeholder="Min. 6 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 text-base rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                      validation.confirmPassword === true
                        ? 'border-green-500 bg-green-50/30'
                        : validation.confirmPassword === false
                        ? 'border-red-500 bg-red-50/30'
                        : 'border-gray-300 bg-white'
                    }`}
                    placeholder="Repeat password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {validation.confirmPassword === false && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Terms & Conditions (Inline) */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{' '}
                    <Link href="/terms" className="text-blue-600 hover:underline font-semibold">
                      Terms of Service
                    </Link>
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.acceptPrivacy}
                    onChange={(e) => handleInputChange('acceptPrivacy', e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    I accept the{' '}
                    <Link href="/privacy" className="text-blue-600 hover:underline font-semibold">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!canSubmit || isLoading}
                className={`w-full py-4 text-base font-semibold text-white rounded-lg transition-all duration-300 ${
                  canSubmit && !isLoading
                    ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Already have an account? Sign In
              </Link>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 flex items-center justify-center gap-6 text-white/70 text-xs">
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>Secure Signup</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🛡️</span>
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Verified Platform</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
