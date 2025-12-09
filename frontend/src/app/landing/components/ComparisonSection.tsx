'use client';

import { useEffect, useState } from 'react';
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
      feature: 'Lesson Scheduling',
      traditional: 'Phone calls, voicemail, manual calendars',
      digitalPlatform: 'Instant online booking with live availability',
      icon: 'CalendarIcon',
    },
    {
      id: 2,
      feature: 'Progress Tracking',
      traditional: 'Paper notes and unclear readiness',
      digitalPlatform: 'Visual dashboard with test readiness insights',
      icon: 'ChartBarIcon',
    },
    {
      id: 3,
      feature: 'Payment Processing',
      traditional: 'Cash, checks, lost receipts',
      digitalPlatform: 'Secure digital payments with auto-receipts',
      icon: 'CreditCardIcon',
    },
    {
      id: 4,
      feature: 'Communication',
      traditional: 'Missed calls and no parent visibility',
      digitalPlatform: 'In-app messaging with instant notifications',
      icon: 'ChatBubbleLeftRightIcon',
    },
    {
      id: 5,
      feature: 'Record Keeping',
      traditional: 'Paper files and manual data entry',
      digitalPlatform: 'Cloud-based records available anywhere',
      icon: 'DocumentTextIcon',
    },
    {
      id: 6,
      feature: 'Instructor Management',
      traditional: 'Manual schedules and frequent conflicts',
      digitalPlatform: 'Automated scheduling with conflict resolution',
      icon: 'UserGroupIcon',
    },
    {
      id: 7,
      feature: 'Business Analytics',
      traditional: 'Spreadsheets and delayed insights',
      digitalPlatform: 'Real-time dashboards and metrics',
      icon: 'PresentationChartLineIcon',
    },
    {
      id: 8,
      feature: 'Student Experience',
      traditional: 'Stressful and unorganized',
      digitalPlatform: 'Clear, transparent, confidence-building',
      icon: 'FaceSmileIcon',
    },
  ];

  if (!isHydrated) return null;

  return (
    <section className="relative py-24 bg-gradient-to-br from-primary via-primary/95 to-secondary overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05))] bg-[length:60px_60px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold text-primary-foreground mb-4">
              Traditional vs Digital Driving Schools
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
              A clear comparison showing why modern platforms outperform traditional methods.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="bg-background/10 backdrop-blur-sm rounded-2xl border border-primary-foreground/20 shadow-lg overflow-hidden mb-20">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-background/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm md:text-base font-semibold text-primary-foreground">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-left text-sm md:text-base font-semibold text-primary-foreground">
                      <div className="flex items-center gap-2">
                        <Icon name="XMarkIcon" size={18} variant="solid" className="text-error" />
                        Traditional
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm md:text-base font-semibold text-primary-foreground">
                      <div className="flex items-center gap-2">
                        <Icon name="CheckIcon" size={18} variant="solid" className="text-success" />
                        DriveMaster Pro
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {comparisonFeatures.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-primary-foreground/10 hover:bg-background/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 flex items-center justify-center bg-background/20 backdrop-blur-sm rounded-lg">
                            <Icon
                              name={item.icon as any}
                              size={20}
                              variant="outline"
                              className="text-primary-foreground"
                            />
                          </div>
                          <span className="text-sm md:text-base font-semibold text-primary-foreground">
                            {item.feature}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2 items-center">
                          <Icon
                            name="XCircleIcon"
                            size={16}
                            variant="solid"
                            className="text-error mt-0.5"
                          />
                          <span className="text-sm md:text-base text-primary-foreground/70">
                            {item.traditional}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2 items-center">
                          <Icon
                            name="CheckCircleIcon"
                            size={16}
                            variant="solid"
                            className="text-success mt-0.5"
                          />
                          <span className="text-sm md:text-base text-primary-foreground font-medium">
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

          {/* Bottom Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: 'ClockIcon',
                title: 'Save Time',
                description: 'Reduce admin work by up to 40% using automation',
                color: 'text-success',
              },
              {
                icon: 'ChartBarIcon',
                title: 'Better Results',
                description: 'Higher pass rates through structured tracking',
                color: 'text-accent',
              },
              {
                icon: 'FaceSmileIcon',
                title: 'Happier Users',
                description: 'Loved by students, parents, and instructors',
                color: 'text-secondary',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-background/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon name={item.icon} size={24} variant="solid" className={item.color} />
                  <h3 className="text-lg md:text-xl font-semibold text-primary-foreground">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm md:text-base text-primary-foreground/80 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
