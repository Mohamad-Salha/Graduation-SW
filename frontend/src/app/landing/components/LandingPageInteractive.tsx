'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import HeroSection from './HeroSection';
import ProblemSection from './ProblemSection';
import InteractiveDemo from '@/components/common/InteractiveDemo';
import RoleExperienceSection from './RoleExperienceSection';
import TestimonialSection from './TestimonialSection';
import ComparisonSection from './ComparisonSection';
import PricingSection from './PricingSection';
import FAQSection from './FAQSection';
import FinalCTASection from './FinalCTASection';
import Footer from './Footer';

const LandingPageInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <>
      <Header />
      <main className="pt-20">
        <HeroSection />
        <ProblemSection />
        
        <section id="how-it-works" className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-headline-bold text-foreground mb-4">
                  Your Journey to Success
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Follow a proven path from enrollment to license achievement
                </p>
              </div>
              <InteractiveDemo type="timeline" />
            </div>
          </div>
        </section>

        <section id="for-students" className="py-20 bg-surface">
          <RoleExperienceSection />
        </section>

        <TestimonialSection />
        <ComparisonSection />
        <PricingSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
};

export default LandingPageInteractive;