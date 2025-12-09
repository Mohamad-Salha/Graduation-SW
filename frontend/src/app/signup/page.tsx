'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

type SignupStep = 'details' | 'terms';

interface ValidationState {
  email: boolean | null;
  password: boolean | null;
  confirmPassword: boolean | null;
  firstName: boolean | null;
  lastName: boolean | null;
  phone: boolean | null;
  age: boolean | null;
}

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  confirmPassword: string;
  age: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

const SignupPage = () => {
  const [currentStep, setCurrentStep] = useState<SignupStep>('details');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    age: '',
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const [validation, setValidation] = useState<ValidationState>({
    email: null,
    password: null,
    confirmPassword: null,
    firstName: null,
    lastName: null,
    phone: null,
    age: null,
  });

  const steps: SignupStep[] = ['details', 'terms'];
  const stepTitles = {
    details: 'Personal Information',
    terms: 'Terms & Conditions',
  };

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validatePassword = (value: string): boolean => {
    return value.length >= 8 && /[A-Z]/.test(value) && /[0-9]/.test(value);
  };

  const validatePhone = (value: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(value);
  };

  const getPasswordStrength = (password: string): { strength: string; color: string; percentage: number } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 'Weak', color: 'bg-destructive', percentage: 33 };
    if (strength <= 3) return { strength: 'Medium', color: 'bg-warning', percentage: 66 };
    return { strength: 'Strong', color: 'bg-success', percentage: 100 };
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
    } else if (field === 'firstName' && typeof value === 'string') {
      setValidation(prev => ({ 
        ...prev, 
        firstName: value.length >= 2 
      }));
    } else if (field === 'lastName' && typeof value === 'string') {
      setValidation(prev => ({ 
        ...prev, 
        lastName: value.length >= 2 
      }));
    } else if (field === 'age' && typeof value === 'string') {
      const age = parseInt(value);
      setValidation(prev => ({ 
        ...prev, 
        age: age >= 16 && age <= 100 
      }));
    }
  };

  const handleNextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const canProceedFromDetails = 
    validation.email === true &&
    validation.firstName === true &&
    validation.lastName === true &&
    validation.phone === true &&
    validation.age === true &&
    validation.password === true &&
    validation.confirmPassword === true;

  const canProceedFromTerms = 
    formData.acceptTerms && 
    formData.acceptPrivacy;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate signup
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsLoading(false);
    // Redirect to login or dashboard
    console.log('Student signup:', formData);
  };

  const progressPercentage = ((steps.indexOf(currentStep) + 1) / steps.length) * 100;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-secondary py-12">
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

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
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
            <h1 className="text-xl font-headline font-headline-bold text-primary-foreground mb-2">
              Start Your Driving Journey
            </h1>
            <p className="text-sm text-primary-foreground/80 font-body">
              Join thousands of students learning to drive with confidence
            </p>
          </div>

          {/* Signup Card */}
          <div className="bg-background rounded-2xl shadow-2xl overflow-hidden">
            {/* Progress Bar */}
            <div className="h-2 bg-muted relative overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Progress Steps */}
            <div className="p-6 bg-muted/30 border-b border-border">
              <div className="flex items-center justify-between max-w-md mx-auto">
                {steps.map((step, index) => {
                  const isActive = currentStep === step;
                  const isCompleted = steps.indexOf(currentStep) > index;
                  
                  return (
                    <div key={step} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-body font-body-bold text-sm transition-all ${
                            isCompleted
                              ? 'bg-success text-success-foreground'
                              : isActive
                              ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {isCompleted ? (
                            <Icon name="CheckIcon" size={20} variant="solid" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span
                          className={`mt-2 text-xs font-body text-center ${
                            isActive || isCompleted
                              ? 'text-foreground font-body-medium'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {stepTitles[step]}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`h-0.5 flex-1 mx-2 transition-all ${
                            isCompleted ? 'bg-success' : 'bg-border'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              {/* Step 1: Personal Details + Password */}
              {currentStep === 'details' && (
                <div className="space-y-5">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-headline font-headline-bold text-foreground mb-2">
                      Create Your Account
                    </h2>
                    <p className="text-sm text-muted-foreground font-body">
                      Tell us about yourself to get started
                    </p>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-body font-body-medium text-foreground mb-2"
                      >
                        First Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className={`w-full px-4 py-3 pr-12 text-base font-body rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                            validation.firstName === true
                              ? 'border-success bg-success/5'
                              : validation.firstName === false
                              ? 'border-destructive bg-destructive/5' :'border-border bg-background'
                          }`}
                          placeholder="John"
                          required
                        />
                        {validation.firstName !== null && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Icon
                              name={validation.firstName ? 'CheckCircleIcon' : 'XCircleIcon'}
                              size={20}
                              variant="solid"
                              className={validation.firstName ? 'text-success' : 'text-destructive'}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Last Name */}
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-body font-body-medium text-foreground mb-2"
                      >
                        Last Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className={`w-full px-4 py-3 pr-12 text-base font-body rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                            validation.lastName === true
                              ? 'border-success bg-success/5'
                              : validation.lastName === false
                              ? 'border-destructive bg-destructive/5' :'border-border bg-background'
                          }`}
                          placeholder="Doe"
                          required
                        />
                        {validation.lastName !== null && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Icon
                              name={validation.lastName ? 'CheckCircleIcon' : 'XCircleIcon'}
                              size={20}
                              variant="solid"
                              className={validation.lastName ? 'text-success' : 'text-destructive'}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Email */}
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
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-3 pr-12 text-base font-body rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          validation.email === true
                            ? 'border-success bg-success/5'
                            : validation.email === false
                            ? 'border-destructive bg-destructive/5' :'border-border bg-background'
                        }`}
                        placeholder="john.doe@example.com"
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

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-body font-body-medium text-foreground mb-2"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full px-4 py-3 pr-12 text-base font-body rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          validation.phone === true
                            ? 'border-success bg-success/5'
                            : validation.phone === false
                            ? 'border-destructive bg-destructive/5' :'border-border bg-background'
                        }`}
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                      {validation.phone !== null && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Icon
                            name={validation.phone ? 'CheckCircleIcon' : 'XCircleIcon'}
                            size={20}
                            variant="solid"
                            className={validation.phone ? 'text-success' : 'text-destructive'}
                          />
                        </div>
                      )}
                    </div>
                    {validation.phone === false && (
                      <p className="mt-1 text-xs text-destructive font-body">
                        Please enter a valid phone number
                      </p>
                    )}
                  </div>

                  {/* Student Details */}
                  <div className="pt-4 border-t border-border">
                    <div>
                      <label
                        htmlFor="age"
                        className="block text-sm font-body font-body-medium text-foreground mb-2"
                      >
                        Age
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          id="age"
                          value={formData.age}
                          onChange={(e) => handleInputChange('age', e.target.value)}
                          className={`w-full px-4 py-3 pr-12 text-base font-body rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                            validation.age === true
                              ? 'border-success bg-success/5'
                              : validation.age === false
                              ? 'border-destructive bg-destructive/5' :'border-border bg-background'
                          }`}
                          placeholder="18"
                          min="16"
                          max="100"
                          required
                        />
                        {validation.age !== null && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Icon
                              name={validation.age ? 'CheckCircleIcon' : 'XCircleIcon'}
                              size={20}
                              variant="solid"
                              className={validation.age ? 'text-success' : 'text-destructive'}
                            />
                          </div>
                        )}
                      </div>
                      {validation.age === false && (
                        <p className="mt-1 text-xs text-destructive font-body">
                          Age must be between 16 and 100
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className="pt-4 border-t border-border">
                    <h3 className="text-lg font-headline font-headline-bold text-foreground mb-4">
                      Account Security
                    </h3>

                    {/* Password */}
                    <div className="mb-4">
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
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className={`w-full px-4 py-3 pr-12 text-base font-body rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                            validation.password === true
                              ? 'border-success bg-success/5'
                              : validation.password === false
                              ? 'border-destructive bg-destructive/5' :'border-border bg-background'
                          }`}
                          placeholder="Create a strong password"
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
                      
                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-body text-muted-foreground">
                              Password Strength
                            </span>
                            <span className={`text-xs font-body font-body-medium ${
                              getPasswordStrength(formData.password).strength === 'Strong' ?'text-success'
                                : getPasswordStrength(formData.password).strength === 'Medium' ?'text-warning' :'text-destructive'
                            }`}>
                              {getPasswordStrength(formData.password).strength}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${getPasswordStrength(formData.password).color}`}
                              style={{ width: `${getPasswordStrength(formData.password).percentage}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Password Requirements */}
                      <div className="mt-3 space-y-1">
                        <div className={`flex items-center gap-2 text-xs font-body ${
                          formData.password.length >= 8 ? 'text-success' : 'text-muted-foreground'
                        }`}>
                          <Icon
                            name={formData.password.length >= 8 ? 'CheckCircleIcon' : 'XCircleIcon'}
                            size={14}
                            variant="solid"
                          />
                          <span>At least 8 characters</span>
                        </div>
                        <div className={`flex items-center gap-2 text-xs font-body ${
                          /[A-Z]/.test(formData.password) ? 'text-success' : 'text-muted-foreground'
                        }`}>
                          <Icon
                            name={/[A-Z]/.test(formData.password) ? 'CheckCircleIcon' : 'XCircleIcon'}
                            size={14}
                            variant="solid"
                          />
                          <span>One uppercase letter</span>
                        </div>
                        <div className={`flex items-center gap-2 text-xs font-body ${
                          /[0-9]/.test(formData.password) ? 'text-success' : 'text-muted-foreground'
                        }`}>
                          <Icon
                            name={/[0-9]/.test(formData.password) ? 'CheckCircleIcon' : 'XCircleIcon'}
                            size={14}
                            variant="solid"
                          />
                          <span>One number</span>
                        </div>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-body font-body-medium text-foreground mb-2"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className={`w-full px-4 py-3 pr-12 text-base font-body rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                            validation.confirmPassword === true
                              ? 'border-success bg-success/5'
                              : validation.confirmPassword === false
                              ? 'border-destructive bg-destructive/5' :'border-border bg-background'
                          }`}
                          placeholder="Re-enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Icon
                            name={showConfirmPassword ? 'EyeSlashIcon' : 'EyeIcon'}
                            size={20}
                            variant="outline"
                          />
                        </button>
                      </div>
                      {validation.confirmPassword === false && (
                        <p className="mt-1 text-xs text-destructive font-body">
                          Passwords do not match
                        </p>
                      )}
                      {validation.confirmPassword === true && (
                        <p className="mt-1 text-xs text-success font-body flex items-center gap-1">
                          <Icon name="CheckCircleIcon" size={14} variant="solid" />
                          Passwords match
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Terms & Conditions */}
              {currentStep === 'terms' && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-headline font-headline-bold text-foreground mb-2">
                      Terms & Conditions
                    </h2>
                    <p className="text-sm text-muted-foreground font-body">
                      Please review and accept our terms to continue
                    </p>
                  </div>

                  {/* Terms Box */}
                  <div className="bg-muted/50 rounded-lg p-6 max-h-64 overflow-y-auto border border-border">
                    <h3 className="text-base font-headline font-headline-bold text-foreground mb-3">
                      Terms of Service
                    </h3>
                    <div className="space-y-3 text-sm font-body text-muted-foreground">
                      <p>
                        By creating an account with DriveMaster Pro, you agree to the following terms and conditions:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-2">
                        <li>You must be at least 16 years old to register as a student</li>
                        <li>All information provided must be accurate and truthful</li>
                        <li>You are responsible for maintaining the confidentiality of your account</li>
                        <li>You agree to comply with all applicable laws and regulations</li>
                        <li>DriveMaster Pro reserves the right to suspend or terminate accounts that violate these terms</li>
                        <li>Your personal data will be processed according to our Privacy Policy</li>
                        <li>Session bookings are subject to availability and instructor schedules</li>
                      </ul>
                    </div>

                    <h3 className="text-base font-headline font-headline-bold text-foreground mb-3 mt-6">
                      Privacy Policy
                    </h3>
                    <div className="space-y-3 text-sm font-body text-muted-foreground">
                      <p>
                        We are committed to protecting your privacy and personal information:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-2">
                        <li>Your data is encrypted and stored securely</li>
                        <li>We never share your personal information with third parties without consent</li>
                        <li>You have the right to access, modify, or delete your data at any time</li>
                        <li>We use cookies to improve your experience on our platform</li>
                        <li>Contact information is used only for service-related communications</li>
                      </ul>
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.acceptTerms}
                        onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        required
                      />
                      <span className="text-sm font-body text-foreground group-hover:text-primary transition-colors">
                        I agree to the{' '}
                        <Link href="/terms" className="text-primary hover:underline font-body-medium">
                          Terms of Service
                        </Link>
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.acceptPrivacy}
                        onChange={(e) => handleInputChange('acceptPrivacy', e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        required
                      />
                      <span className="text-sm font-body text-foreground group-hover:text-primary transition-colors">
                        I accept the{' '}
                        <Link href="/privacy" className="text-primary hover:underline font-body-medium">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                  </div>

                  {/* Marketing Preferences (Optional) */}
                  <div className="pt-4 border-t border-border">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="mt-1 w-5 h-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                      />
                      <span className="text-sm font-body text-muted-foreground group-hover:text-foreground transition-colors">
                        I want to receive updates about new features, promotions, and driving tips (optional)
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-border">
                {currentStep !== 'details' && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-3 text-base font-body font-body-medium text-foreground bg-background border-2 border-border rounded-lg hover:bg-muted/50 transition-all hover:scale-105 active:scale-95 duration-300"
                  >
                    Back
                  </button>
                )}
                
                {currentStep !== 'terms' ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!canProceedFromDetails}
                    className="flex-1 px-6 py-4 text-base font-body font-cta text-accent-foreground bg-accent rounded-lg shadow-cta hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none ml-auto"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading || !canProceedFromTerms}
                    className="flex-1 px-6 py-4 text-base font-body font-cta text-accent-foreground bg-accent rounded-lg shadow-cta hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center ml-auto"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-accent-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                )}
              </div>
            </form>

            {/* Footer */}
            <div className="px-8 pb-8 pt-4 border-t border-border bg-muted/30">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-body">
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 font-body-medium transition-colors"
                >
                  Already have an account? Sign In
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
              <span>Secure Signup</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="LockClosedIcon" size={16} variant="solid" className="text-success" />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="CheckBadgeIcon" size={16} variant="solid" className="text-success" />
              <span>Verified Platform</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
