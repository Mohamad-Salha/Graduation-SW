'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import RoleSelector from '@/components/common/RoleSelector';

const FinalCTASection = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'parent' | 'school'>('student');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setEmail('');
      setPhone('');
    }, 3000);
  };

  return (
    <section id="get-started" className="py-20 bg-gradient-to-br from-primary via-primary/95 to-secondary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05))] bg-[length:60px_60px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-headline-bold text-primary-foreground mb-4">
              Start Your Driving Journey Today
            </h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands of students mastering driving skills with our proven training program
            </p>
          </div>

          <div className="bg-background/95 backdrop-blur-sm rounded-2xl shadow-card p-8 md:p-12">
            <RoleSelector
              onRoleChange={(role) => setSelectedRole(role as any)}
              defaultRole="student"
              className="mb-8"
            />

            {showSuccess ? (
              <div className="bg-success/10 border border-success/20 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-success rounded-full mx-auto mb-4">
                  <Icon name="CheckIcon" size={32} variant="solid" className="text-success-foreground" />
                </div>
                <h3 className="text-xl font-headline font-headline-semibold text-foreground mb-2">
                  Thank You!
                </h3>
                <p className="text-sm text-muted-foreground">
                  We'll contact you shortly to get you started on your driving journey.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-body font-body-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icon name="EnvelopeIcon" size={20} variant="outline" className="text-muted-foreground" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-body font-body-medium text-foreground mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icon name="PhoneIcon" size={20} variant="outline" className="text-muted-foreground" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1 w-4 h-4 text-primary bg-surface border-border rounded focus:ring-2 focus:ring-primary"
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to receive communications from DriveMaster Pro and accept the{' '}
                    <Link href="#" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 text-base font-body font-cta text-accent-foreground bg-accent rounded-lg shadow-cta hover-lift hover:bg-accent/90 transition-smooth"
                >
                  Get Started Now
                </button>

                <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Icon name="ShieldCheckIcon" size={16} variant="solid" className="text-success" />
                    <span>Secure & Private</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="ClockIcon" size={16} variant="solid" className="text-success" />
                    <span>2-Minute Setup</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="XMarkIcon" size={16} variant="solid" className="text-success" />
                    <span>No Credit Card</span>
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-success rounded-lg mx-auto mb-3">
                <Icon name="UserGroupIcon" size={24} variant="solid" className="text-success-foreground" />
              </div>
              <h3 className="text-lg font-headline font-headline-semibold text-primary-foreground mb-1">
                10,000+ Students
              </h3>
              <p className="text-sm text-primary-foreground/80">
                Successfully trained
              </p>
            </div>

            <div className="bg-background/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-accent rounded-lg mx-auto mb-3">
                <Icon name="AcademicCapIcon" size={24} variant="solid" className="text-accent-foreground" />
              </div>
              <h3 className="text-lg font-headline font-headline-semibold text-primary-foreground mb-1">
                500+ Instructors
              </h3>
              <p className="text-sm text-primary-foreground/80">
                Certified professionals
              </p>
            </div>

            <div className="bg-background/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-secondary rounded-lg mx-auto mb-3">
                <Icon name="TrophyIcon" size={24} variant="solid" className="text-secondary-foreground" />
              </div>
              <h3 className="text-lg font-headline font-headline-semibold text-primary-foreground mb-1">
                95% Pass Rate
              </h3>
              <p className="text-sm text-primary-foreground/80">
                First-time success
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;