'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Problem {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const ProblemSection = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const traditionalProblems: Problem[] = [
    {
      id: 1,
      title: "Scheduling Chaos",
      description: "Phone tag with instructors, double bookings, and last-minute cancellations waste your time and delay progress.",
      icon: "CalendarDaysIcon",
    },
    {
      id: 2,
      title: "Unclear Progress",
      description: "No visibility into skill development or readiness for the test. Are you actually improving or just driving in circles?",
      icon: "QuestionMarkCircleIcon",
    },
    {
      id: 3,
      title: "Payment Confusion",
      description: "Cash payments, lost receipts, and unclear pricing create disputes and financial stress for families.",
      icon: "CurrencyDollarIcon",
    },
    {
      id: 4,
      title: "Poor Communication",
      description: "Parents left in the dark, instructors unavailable, and no record of lessons or feedback.",
      icon: "ChatBubbleLeftRightIcon",
    },
  ];

  const digitalSolutions: Problem[] = [
    {
      id: 1,
      title: "Smart Scheduling",
      description: "Book lessons instantly, automatic conflict resolution, and real-time availability from all instructors.",
      icon: "CalendarIcon",
    },
    {
      id: 2,
      title: "Real-Time Tracking",
      description: "Visual progress dashboard showing skill mastery, areas for improvement, and test readiness score.",
      icon: "ChartBarIcon",
    },
    {
      id: 3,
      title: "Secure Payments",
      description: "Transparent pricing, automatic billing, digital receipts, and payment history at your fingertips.",
      icon: "ShieldCheckIcon",
    },
    {
      id: 4,
      title: "Instant Communication",
      description: "In-app messaging, lesson summaries, parent notifications, and instructor feedback after every session.",
      icon: "ChatBubbleBottomCenterTextIcon",
    },
  ];

  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-headline-bold text-foreground mb-4">
              Traditional Driving Schools Are Broken
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Manual processes, unclear communication, and chaotic scheduling create frustration for everyone. There's a better way.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-error/10 rounded-lg">
                  <Icon name="XMarkIcon" size={24} variant="solid" className="text-error" />
                </div>
                <h3 className="text-2xl font-headline font-headline-semibold text-foreground">
                  The Old Way
                </h3>
              </div>

              {traditionalProblems.map((problem) => (
                <div
                  key={problem.id}
                  className="bg-card rounded-lg p-6 border-l-4 border-error shadow-sm hover-lift transition-smooth"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-error/10 rounded-lg">
                      <Icon name={problem.icon as any} size={24} variant="outline" className="text-error" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-headline font-headline-semibold text-foreground mb-2">
                        {problem.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {problem.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-success/10 rounded-lg">
                  <Icon name="CheckIcon" size={24} variant="solid" className="text-success" />
                </div>
                <h3 className="text-2xl font-headline font-headline-semibold text-foreground">
                  The DriveMaster Way
                </h3>
              </div>

              {digitalSolutions.map((solution) => (
                <div
                  key={solution.id}
                  className="bg-card rounded-lg p-6 border-l-4 border-success shadow-sm hover-lift transition-smooth"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg">
                      <Icon name={solution.icon as any} size={24} variant="outline" className="text-success" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-headline font-headline-semibold text-foreground mb-2">
                        {solution.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {solution.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-accent/10 rounded-full border border-accent/20">
              <Icon name="LightBulbIcon" size={20} variant="solid" className="text-accent" />
              <span className="text-sm font-body font-body-medium text-foreground">
                Join the digital transformation in driving education
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;