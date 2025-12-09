'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ComparisonFeature {
  id: number;
  feature: string;
  traditional: string;
  digitalPlatform: string;
  icon: string;
}

const ComparisonSection = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const comparisonFeatures: ComparisonFeature[] = [
    {
      id: 1,
      feature: "Lesson Scheduling",
      traditional: "Phone calls, voicemail tag, manual calendar management",
      digitalPlatform: "Instant online booking with real-time availability",
      icon: "CalendarIcon",
    },
    {
      id: 2,
      feature: "Progress Tracking",
      traditional: "Paper notes, inconsistent feedback, unclear readiness",
      digitalPlatform: "Visual skill dashboard with AI-powered test readiness",
      icon: "ChartBarIcon",
    },
    {
      id: 3,
      feature: "Payment Processing",
      traditional: "Cash/check payments, manual receipts, lost records",
      digitalPlatform: "Secure digital payments with automatic receipts",
      icon: "CreditCardIcon",
    },
    {
      id: 4,
      feature: "Communication",
      traditional: "Phone calls, missed messages, no parent visibility",
      digitalPlatform: "In-app messaging with instant parent notifications",
      icon: "ChatBubbleLeftRightIcon",
    },
    {
      id: 5,
      feature: "Record Keeping",
      traditional: "Paper files, manual data entry, prone to loss",
      digitalPlatform: "Cloud-based records with instant access anywhere",
      icon: "DocumentTextIcon",
    },
    {
      id: 6,
      feature: "Instructor Management",
      traditional: "Manual scheduling, unclear availability, conflicts",
      digitalPlatform: "Automated scheduling with conflict resolution",
      icon: "UserGroupIcon",
    },
    {
      id: 7,
      feature: "Business Analytics",
      traditional: "Spreadsheets, manual calculations, delayed insights",
      digitalPlatform: "Real-time dashboards with actionable metrics",
      icon: "PresentationChartLineIcon",
    },
    {
      id: 8,
      feature: "Student Experience",
      traditional: "Confusing, stressful, unclear expectations",
      digitalPlatform: "Organized, transparent, confidence-building",
      icon: "FaceSmileIcon",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-headline-bold text-foreground mb-4">
              Traditional vs. Digital: The Clear Choice
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              See how modern technology transforms every aspect of driving education
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface border-b border-border">
                    <th className="px-6 py-4 text-left text-sm font-headline font-headline-semibold text-foreground">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-headline font-headline-semibold text-foreground">
                      <div className="flex items-center space-x-2">
                        <Icon name="XMarkIcon" size={20} variant="solid" className="text-error" />
                        <span>Traditional Method</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-headline font-headline-semibold text-foreground">
                      <div className="flex items-center space-x-2">
                        <Icon name="CheckIcon" size={20} variant="solid" className="text-success" />
                        <span>DriveMaster Pro</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b border-border hover:bg-surface transition-smooth ${
                        index % 2 === 0 ? 'bg-background' : 'bg-surface/50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg flex-shrink-0">
                            <Icon name={item.icon as any} size={20} variant="outline" className="text-primary" />
                          </div>
                          <span className="text-sm font-body font-body-semibold text-foreground">
                            {item.feature}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-2">
                          <Icon name="XCircleIcon" size={16} variant="solid" className="text-error flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{item.traditional}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-2">
                          <Icon name="CheckCircleIcon" size={16} variant="solid" className="text-success flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground font-body font-body-medium">
                            {item.digitalPlatform}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-success/10 rounded-lg p-6 border-l-4 border-success">
              <div className="flex items-center space-x-3 mb-3">
                <Icon name="ClockIcon" size={24} variant="solid" className="text-success" />
                <h3 className="text-lg font-headline font-headline-semibold text-foreground">
                  Save Time
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Reduce administrative work by 40% with automated scheduling and billing
              </p>
            </div>

            <div className="bg-primary/10 rounded-lg p-6 border-l-4 border-primary">
              <div className="flex items-center space-x-3 mb-3">
                <Icon name="ChartBarIcon" size={24} variant="solid" className="text-primary" />
                <h3 className="text-lg font-headline font-headline-semibold text-foreground">
                  Better Results
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                95% first-time pass rate with structured progress tracking
              </p>
            </div>

            <div className="bg-accent/10 rounded-lg p-6 border-l-4 border-accent">
              <div className="flex items-center space-x-3 mb-3">
                <Icon name="FaceSmileIcon" size={24} variant="solid" className="text-accent" />
                <h3 className="text-lg font-headline font-headline-semibold text-foreground">
                  Happier Users
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                4.9/5 average rating from students, parents, and schools
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;