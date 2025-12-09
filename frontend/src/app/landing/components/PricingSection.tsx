'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface LicenseType {
  id: string;
  name: string;
  description: string;
  sessionPrice: string;
  duration: string;
  features: string[];
  highlighted: boolean;
  cta: string;
  icon: string;
}

const PricingSection = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const licenseTypes: LicenseType[] = [
    {
      id: 'manual-car',
      name: 'Manual Car License',
      description: 'Standard manual transmission vehicle',
      sessionPrice: '$45',
      duration: '45 min/session',
      features: [
        'Comprehensive gear shifting training',
        'Traffic navigation practice',
        'Highway driving experience',
        'Parking and maneuvering skills',
        'Test preparation and mock tests',
        'Progress tracking dashboard',
      ],
      highlighted: false,
      cta: 'Book Session',
      icon: 'TruckIcon',
    },
    {
      id: 'motorcycle',
      name: 'Motorcycle License',
      description: 'Two-wheel motorcycle training',
      sessionPrice: '$55',
      duration: '45 min/session',
      features: [
        'Balance and control techniques',
        'Safe riding practices',
        'Defensive driving strategies',
        'City and highway riding',
        'Emergency maneuvers',
        'Safety gear training',
        'Test preparation included',
      ],
      highlighted: true,
      cta: 'Book Session',
      icon: 'TruckIcon',
    },
    {
      id: 'heavy-truck',
      name: 'Heavy Truck License',
      description: 'Commercial heavy vehicle training',
      sessionPrice: '$85',
      duration: '60 min/session',
      features: [
        'Large vehicle handling',
        'Advanced maneuvering skills',
        'Load management training',
        'Commercial route navigation',
        'Safety compliance protocols',
        'Extended practice time',
        'CDL test preparation',
        'Job placement assistance',
      ],
      highlighted: false,
      cta: 'Book Session',
      icon: 'TruckIcon',
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-surface">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-headline-bold text-foreground mb-4">
              License Types & Session Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Choose your license type and book individual sessions. Flexible scheduling with transparent per-session pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {licenseTypes.map((license) => (
              <div
                key={license.id}
                className={`relative bg-card rounded-2xl shadow-card border-2 transition-smooth hover-lift ${
                  license.highlighted
                    ? 'border-primary shadow-lg scale-105'
                    : 'border-border'
                }`}
              >
                {license.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-xs font-body font-body-semibold shadow-cta">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg flex-shrink-0">
                      <Icon name={license.icon} size={24} variant="solid" className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-headline font-headline-bold text-foreground">
                        {license.name}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-6">
                    {license.description}
                  </p>

                  <div className="mb-6 bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-3xl font-headline font-headline-bold text-foreground">
                          {license.sessionPrice}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          per session
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Session Duration</div>
                        <div className="text-sm font-body font-body-semibold text-foreground">
                          {license.duration}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    className={`w-full px-6 py-3 rounded-lg text-sm font-body font-cta transition-smooth hover-lift mb-6 ${
                      license.highlighted
                        ? 'bg-accent text-accent-foreground shadow-cta hover:bg-accent/90'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {license.cta}
                  </button>

                  <div className="space-y-3">
                    <div className="text-xs font-body font-body-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      What's Included
                    </div>
                    {license.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Icon
                          name="CheckCircleIcon"
                          size={20}
                          variant="solid"
                          className="text-success flex-shrink-0 mt-0.5"
                        />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg flex-shrink-0">
                  <Icon name="CreditCardIcon" size={24} variant="solid" className="text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-headline font-headline-semibold text-foreground mb-1">
                    Flexible Payment Options
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Pay per session or purchase session bundles for discounted rates. No long-term commitments required.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg flex-shrink-0">
                  <Icon name="CalendarIcon" size={24} variant="solid" className="text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-headline font-headline-semibold text-foreground mb-1">
                    Easy Scheduling
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Book sessions at your convenience. Choose your preferred instructor and time slot through our online portal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-success/5 rounded-lg p-6 border border-success/20">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg flex-shrink-0">
                  <Icon name="ShieldCheckIcon" size={24} variant="solid" className="text-success" />
                </div>
                <div>
                  <h4 className="text-lg font-headline font-headline-semibold text-foreground mb-1">
                    Satisfaction Guaranteed
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Not happy with your first session? Get a full refund, no questions asked.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="LockClosedIcon" size={16} variant="solid" className="text-success" />
                <span>Secure payment processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;