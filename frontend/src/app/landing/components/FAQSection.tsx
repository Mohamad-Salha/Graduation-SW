'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: 'student' | 'parent' | 'general';
}

const FAQSection = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<'student' | 'parent' | 'general'>('student');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "How does the progress tracking work?",
      answer: "Our AI-powered system tracks your performance across 25+ driving skills during each lesson. Your instructor provides real-time feedback, and the system generates a visual dashboard showing your mastery level in each area. You'll receive a test readiness score that predicts your likelihood of passing based on your current skill levels.",
      category: 'student',
    },
    {
      id: 2,
      question: "Can I choose my own instructor?",
      answer: "Yes! You can view instructor profiles, ratings, and availability, then book lessons with your preferred instructor. If your preferred instructor isn't available, our smart scheduling system will suggest highly-rated alternatives with similar teaching styles.",
      category: 'student',
    },
    {
      id: 3,
      question: "What happens if I need to cancel a lesson?",
      answer: "You can cancel or reschedule lessons up to 24 hours in advance without penalty through the app. Cancellations within 24 hours may incur a fee, but we understand emergencies happen and handle them on a case-by-case basis.",
      category: 'student',
    },
    {
      id: 4,
      question: "How can I monitor my teen's progress?",
      answer: "The parent portal provides real-time access to lesson summaries, skill assessments, and instructor feedback. You'll receive notifications after each lesson with detailed progress reports, and you can message instructors directly through the app.",
      category: 'parent',
    },
    {
      id: 5,
      question: "Is the payment information secure?",
      answer: "Absolutely. We use bank-level encryption and are PCI DSS compliant. All payment information is processed through secure, industry-standard payment gateways. We never store your full credit card details on our servers.",
      category: 'parent',
    },
    {
      id: 6,
      question: "Can I track lesson locations in real-time?",
      answer: "Yes, for safety and transparency, you can see the real-time location of driving lessons through the parent portal. You'll also receive notifications when lessons start and end, along with the route taken during the lesson.",
      category: 'parent',
    },
    {
      id: 7,
      question: "What makes your driving program different?",
      answer: "We combine traditional driving instruction with modern technology and AI-powered progress tracking. Our comprehensive approach includes personalized learning paths, real-time feedback, and detailed analytics that help students master driving skills faster and more effectively.",
      category: 'general',
    },
    {
      id: 8,
      question: "How do I get started with lessons?",
      answer: "Getting started is easy! Simply create an account, choose your preferred instructor, and book your first lesson. We offer flexible scheduling to fit your availability, and you can manage everything through our intuitive mobile app or web platform.",
      category: 'general',
    },
    {
      id: 9,
      question: "What types of vehicles and licenses do you offer?",
      answer: "We provide training for manual cars, automatic cars, motorcycles, and heavy trucks. Each license type has specialized instructors and customized curriculum designed to help you master the specific skills needed for that vehicle category.",
      category: 'general',
    },
  ];

  const filteredFAQs = faqs.filter((faq) => faq.category === activeCategory);

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-headline-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Get answers to common questions about our platform
            </p>
          </div>

          <div className="flex justify-center space-x-4 mb-12">
            <button
              onClick={() => setActiveCategory('student')}
              className={`px-6 py-3 rounded-lg text-sm font-body font-body-medium transition-smooth ${
                activeCategory === 'student' ?'bg-primary text-primary-foreground shadow-cta' :'bg-card text-foreground hover:bg-muted'
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setActiveCategory('parent')}
              className={`px-6 py-3 rounded-lg text-sm font-body font-body-medium transition-smooth ${
                activeCategory === 'parent' ?'bg-primary text-primary-foreground shadow-cta' :'bg-card text-foreground hover:bg-muted'
              }`}
            >
              Parents
            </button>
            <button
              onClick={() => setActiveCategory('general')}
              className={`px-6 py-3 rounded-lg text-sm font-body font-body-medium transition-smooth ${
                activeCategory === 'general' ?'bg-primary text-primary-foreground shadow-cta' :'bg-card text-foreground hover:bg-muted'
              }`}
            >
              General
            </button>
          </div>

          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="bg-card rounded-lg border border-border shadow-sm overflow-hidden transition-smooth hover:shadow-md"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-surface transition-smooth"
                >
                  <span className="text-base font-headline font-headline-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                  <Icon
                    name={openFAQ === faq.id ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                    size={24}
                    variant="outline"
                    className="text-muted-foreground flex-shrink-0"
                  />
                </button>
                {openFAQ === faq.id && (
                  <div className="px-6 pb-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-primary/5 rounded-lg p-8 border border-primary/20 text-center">
            <h3 className="text-xl font-headline font-headline-semibold text-foreground mb-2">
              Still have questions?
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Our support team is here to help you get started
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:support@drivemasterpro.com"
                className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg shadow-cta hover-lift hover:bg-primary/90 transition-smooth"
              >
                <Icon name="EnvelopeIcon" size={20} variant="outline" />
                <span className="text-sm font-body font-cta">Email Support</span>
              </a>
              <a
                href="tel:+1-800-DRIVE-PRO"
                className="flex items-center space-x-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg shadow-cta hover-lift hover:bg-secondary/90 transition-smooth"
              >
                <Icon name="PhoneIcon" size={20} variant="outline" />
                <span className="text-sm font-body font-cta">Call Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;