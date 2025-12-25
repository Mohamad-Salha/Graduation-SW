'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import api from '@/services/api';
import { setAuthToken, setUserData } from '@/utils/auth';

type UserRole = 'student' | 'trainer' | 'instructor' | 'admin';

interface ValidationState {
  email: boolean | null;
  password: boolean | null;
}

const LoginPage = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validation, setValidation] = useState<ValidationState>({
    email: null,
    password: null,
  });

  const roles = [
    {
      id: 'student' as UserRole,
      label: 'Student',
      icon: 'AcademicCapIcon',
      color: 'bg-primary',
      hoverColor: 'hover:bg-primary/90',
      borderColor: 'border-primary',
    },
    {
      id: 'trainer' as UserRole,
      label: 'Trainer',
      icon: 'UserGroupIcon',
      color: 'bg-secondary',
      hoverColor: 'hover:bg-secondary/90',
      borderColor: 'border-secondary',
    },
    {
      id: 'instructor' as UserRole,
      label: 'Instructor',
      icon: 'BriefcaseIcon',
      color: 'bg-accent',
      hoverColor: 'hover:bg-accent/90',
      borderColor: 'border-accent',
    },
    {
      id: 'admin' as UserRole,
      label: 'Admin',
      icon: 'ShieldCheckIcon',
      color: 'bg-destructive',
      hoverColor: 'hover:bg-destructive/90',
      borderColor: 'border-destructive',
    },
  ];

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value.length > 0) {
      setValidation(prev => ({ ...prev, email: validateEmail(value) }));
    } else {
      setValidation(prev => ({ ...prev, email: null }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value.length > 0) {
      setValidation(prev => ({ ...prev, password: value.length >= 6 }));
    } else {
      setValidation(prev => ({ ...prev, password: null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call backend API directly
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const result = await response.json();
      
      // Store token and user data
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      setAuthToken(result.token);
      setUserData({
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      });

      // Redirect based on role
      switch (result.user.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'student':
          router.push('/student/dashboard');
          break;
        case 'teacher':
          router.push('/teacher/dashboard');
          break;
        case 'trainer':
          router.push('/trainer/dashboard');
          break;
        default:
          router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    // Handle social login logic here
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-secondary">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05))] bg-[length:60px_60px]" />
      </div>

      {/* Decorative Road Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 opacity-5">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-primary-foreground">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div className="absolute bottom-20 right-10 w-40 h-40 opacity-5">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-primary-foreground">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-md mx-auto">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center space-x-2 mb-6 hover:opacity-80 transition-opacity">
              <div className="flex items-center justify-center w-12 h-12 bg-background rounded-lg shadow-lg">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-7 h-7"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L4 6V12C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 12V6L12 2Z"
                    fill="currentColor"
                    className="text-primary"
                  />
                  <path
                    d="M10 12L8.5 13.5L11 16L16 11L14.5 9.5L11 13L10 12Z"
                    fill="currentColor"
                    className="text-success"
                  />
                </svg>
              </div>
              <span className="text-2xl font-headline font-headline-bold text-primary-foreground">
                DriveMaster Pro
              </span>
            </Link>
            <p className="text-sm text-primary-foreground/80 font-body">
              Drive Your Success Forward
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-background rounded-2xl shadow-2xl overflow-hidden">
            {/* Role Selection */}
            <div className="p-6 bg-muted/50 border-b border-border">
              <h2 className="text-xl font-headline font-headline-bold text-foreground mb-4 text-center">
                Sign In As
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                      selectedRole === role.id
                        ? `${role.color} ${role.borderColor} text-primary-foreground shadow-lg scale-105`
                        : 'bg-background border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/30'
                    }`}
                  >
                    <Icon
                      name={role.icon}
                      size={24}
                      variant="solid"
                      className="mb-2"
                    />
                    <span className="text-sm font-body font-body-medium">
                      {role.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-5">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-body font-body-medium text-foreground mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className={`w-full px-4 py-3 pr-12 text-base font-body rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        validation.email === true
                          ? 'border-success bg-success/5'
                          : validation.email === false
                          ? 'border-destructive bg-destructive/5' :'border-border bg-background'
                      }`}
                      placeholder="student@example.com"
                      required
                    />
                    {validation.email !== null && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Icon
                          name={validation.email ? 'CheckCircleIcon' : 'XCircleIcon'}
                          size={20}
                          variant="solid"
                          className={validation.email ? 'text-success' : 'text-destructive'}
                        />
                      </div>
                    )}
                  </div>
                  {validation.email === false && (
                    <p className="mt-1 text-xs text-destructive font-body">
                      Please enter a valid email address
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-body font-body-medium text-foreground mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className={`w-full px-4 py-3 pr-12 text-base font-body rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        validation.password === true
                          ? 'border-success bg-success/5'
                          : validation.password === false
                          ? 'border-destructive bg-destructive/5' :'border-border bg-background'
                      }`}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon
                        name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'}
                        size={20}
                        variant="outline"
                      />
                    </button>
                  </div>
                  {validation.password === false && (
                    <p className="mt-1 text-xs text-destructive font-body">
                      Password must be at least 6 characters
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start space-x-3">
                    <Icon name="ExclamationCircleIcon" size={20} variant="solid" className="text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive font-body">{error}</p>
                  </div>
                )}

                {/* Forgot Password */}
                <div className="flex items-center justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-body font-body-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading || validation.email !== true || validation.password !== true}
                  className="w-full px-6 py-4 text-base font-body font-cta text-accent-foreground bg-accent rounded-lg shadow-cta hover-lift hover:bg-accent/90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-accent-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-background text-muted-foreground font-body">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className="flex items-center justify-center px-4 py-3 border-2 border-border rounded-lg hover:bg-muted/50 transition-all hover-lift"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-sm font-body font-body-medium text-foreground">
                      Google
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin('facebook')}
                    className="flex items-center justify-center px-4 py-3 border-2 border-border rounded-lg hover:bg-muted/50 transition-all hover-lift"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#1877F2"
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                      />
                    </svg>
                    <span className="text-sm font-body font-body-medium text-foreground">
                      Facebook
                    </span>
                  </button>
                </div>
              </div>
            </form>

            {/* Footer Links */}
            <div className="px-8 pb-8 pt-4 border-t border-border bg-muted/30">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-body">
                <Link
                  href="/signup"
                  className="text-primary hover:text-primary/80 font-body-medium transition-colors"
                >
                  Create Account
                </Link>
                <div className="flex items-center gap-4">
                  <Link
                    href="/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <span className="text-border">•</span>
                  <Link
                    href="/support"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 flex items-center justify-center gap-6 text-primary-foreground/70 text-xs font-body">
            <div className="flex items-center gap-2">
              <Icon name="ShieldCheckIcon" size={16} variant="solid" className="text-success" />
              <span>Secure Login</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="LockClosedIcon" size={16} variant="solid" className="text-success" />
              <span>256-bit Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;