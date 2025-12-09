'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface RoleFeature {
  icon: string;
  title: string;
  description: string;
}

interface RoleBenefit {
  stat: string;
  label: string;
  description: string;
}

const RoleExperienceSection = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const studentFeatures: RoleFeature[] = [
    {
      icon: 'CalendarIcon',
      title: 'Smart Scheduling',
      description: 'Book lessons that fit your schedule with instant instructor availability. Get reminders and never miss a session.',
    },
    {
      icon: 'ChartBarIcon',
      title: 'Track Your Progress',
      description: 'See exactly where you are and what skills you need to master. Get personalized recommendations for improvement.',
    },
    {
      icon: 'DevicePhoneMobileIcon',
      title: 'Mobile Learning Hub',
      description: 'Access study materials, practice tests, and video tutorials anytime, anywhere from your phone.',
    },
    {
      icon: 'UserCircleIcon',
      title: 'Expert Instructors',
      description: 'Learn from certified professionals who adapt teaching methods to your learning style and pace.',
    },
    {
      icon: 'CheckBadgeIcon',
      title: 'Test Preparation',
      description: 'Practice with mock tests that simulate real driving exam conditions. Know exactly when you\'re ready.',
    },
    {
      icon: 'BellAlertIcon',
      title: 'Stay Connected',
      description: 'Get instant notifications for lesson confirmations, progress updates, and important reminders.',
    },
  ];

  const studentBenefits: RoleBenefit[] = [
    {
      stat: '95%',
      label: 'First-Time Pass Rate',
      description: 'Our students have a 95% success rate on their first driving test attempt.',
    },
    {
      stat: '4.9/5',
      label: 'Student Satisfaction',
      description: 'Rated by over 10,000 students for instructor quality and platform experience.',
    },
    {
      stat: '30%',
      label: 'Faster Learning',
      description: 'Students complete their driving education 30% faster with our structured approach.',
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-headline-bold text-foreground mb-4">
              Your Journey to Driving Mastery
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Learn at your own pace with personalized instruction and real-time feedback
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {studentFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border shadow-card hover-lift transition-smooth"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <Icon name={feature.icon as any} size={24} variant="outline" className="text-primary" />
                </div>
                <h3 className="text-xl font-headline font-headline-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-primary via-primary/95 to-secondary rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {studentBenefits.map((benefit, index) => (
                <div key={index} className="text-center md:text-left">
                  <div className="text-4xl md:text-5xl font-headline font-headline-bold text-primary-foreground mb-2">
                    {benefit.stat}
                  </div>
                  <div className="text-lg font-headline font-headline-semibold text-primary-foreground/90 mb-2">
                    {benefit.label}
                  </div>
                  <p className="text-sm text-primary-foreground/70">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoleExperienceSection;