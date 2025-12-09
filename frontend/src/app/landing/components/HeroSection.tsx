'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';


interface HeroSectionProps {
  onRoleSelect?: (role: 'student' | 'school') => void;
}

const HeroSection = ({ onRoleSelect }: HeroSectionProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-secondary">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05))] bg-[length:60px_60px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-headline-bold text-primary-foreground mb-6 leading-tight">
              Complete Your Driving Journey with Confidence
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Master the road with expert instructors, smart scheduling, and real-time progress tracking. Join 10,000+ students who achieved their license on the first try.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={() => {
                  const getStartedSection = document.getElementById('get-started');
                  if (getStartedSection) {
                    getStartedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="w-full sm:w-auto px-8 py-4 text-base font-body font-cta text-accent-foreground bg-accent rounded-lg shadow-cta hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out transform"
              >
                Start Learning Today
              </button>
              <button
                onClick={() => {
                  const videoSection = document.getElementById('how-it-works');
                  if (videoSection) {
                    videoSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto px-8 py-4 text-base font-body font-body-medium text-primary-foreground bg-background/20 backdrop-blur-sm border-2 border-primary-foreground/30 rounded-lg hover:bg-background/30 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out transform"
              >
                See How It Works
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-primary-foreground/80">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircleIcon" size={20} variant="solid" className="text-success" />
                <span className="text-sm font-body font-body-medium">No Hidden Fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="ShieldCheckIcon" size={20} variant="solid" className="text-success" />
                <span className="text-sm font-body font-body-medium">Certified Instructors</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="ClockIcon" size={20} variant="solid" className="text-success" />
                <span className="text-sm font-body font-body-medium">Flexible Scheduling</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-background/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20 hover-lift transition-smooth">
              <div className="flex items-center justify-center w-12 h-12 bg-success rounded-lg mb-4">
                <Icon name="TrophyIcon" size={24} variant="solid" className="text-success-foreground" />
              </div>
              <h3 className="text-2xl font-headline font-headline-bold text-primary-foreground mb-2">95%</h3>
              <p className="text-sm text-primary-foreground/80">First-time pass rate</p>
            </div>

            <div className="bg-background/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20 hover-lift transition-smooth">
              <div className="flex items-center justify-center w-12 h-12 bg-secondary rounded-lg mb-4">
                <Icon name="UserGroupIcon" size={24} variant="solid" className="text-secondary-foreground" />
              </div>
              <h3 className="text-2xl font-headline font-headline-bold text-primary-foreground mb-2">10,000+</h3>
              <p className="text-sm text-primary-foreground/80">Students trained</p>
            </div>

            <div className="bg-background/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20 hover-lift transition-smooth">
              <div className="flex items-center justify-center w-12 h-12 bg-accent rounded-lg mb-4">
                <Icon name="StarIcon" size={24} variant="solid" className="text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-headline font-headline-bold text-primary-foreground mb-2">4.9/5</h3>
              <p className="text-sm text-primary-foreground/80">Average rating</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Icon name="ChevronDownIcon" size={32} variant="outline" className="text-primary-foreground/60" />
      </div>
    </section>
  );
};

export default HeroSection;