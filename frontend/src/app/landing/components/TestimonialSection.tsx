'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  alt: string;
  rating: number;
  content: string;
  achievement: string;
  verified: boolean;
}

const TestimonialSection = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'student' | 'trainer' | 'teacher'>('student');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const testimonials: Record<'student' | 'trainer' | 'teacher', Testimonial[]> = {
    student: [
      {
        id: 1,
        name: "Sarah Johnson",
        role: "Student, Age 18",
        image: "https://img.rocket.new/generatedImages/rocket_gen_img_1890bcd8c-1765026867569.png",
        alt: "Young woman with long brown hair smiling at camera wearing casual blue top",
        rating: 5,
        content: "I passed my driving test on the first try! The progress tracking helped me focus on areas I needed to improve, and the scheduling was so easy. My instructor was always on time and super patient.",
        achievement: "Passed first attempt",
        verified: true
      },
      {
        id: 2,
        name: "Michael Chen",
        role: "Student, Age 19",
        image: "https://img.rocket.new/generatedImages/rocket_gen_img_1a0486763-1763298848491.png",
        alt: "Young Asian man with short black hair in white shirt smiling confidently",
        rating: 5,
        content: "The app made everything so organized. I could see exactly what skills I had mastered and what I still needed to work on. The test readiness score gave me confidence when it was time to take my exam.",
        achievement: "95% readiness score",
        verified: true
      },
      {
        id: 3,
        name: "Emily Rodriguez",
        role: "Student, Age 17",
        image: "https://img.rocket.new/generatedImages/rocket_gen_img_1387e39bc-1765229993079.png",
        alt: "Young Hispanic woman with wavy dark hair smiling warmly in outdoor setting",
        rating: 5,
        content: "Being able to book lessons around my school schedule was a game-changer. The instructors were professional, and I loved getting instant feedback after each lesson. Highly recommend!",
        achievement: "Completed in 3 months",
        verified: true
      }
    ],

    trainer: [
      {
        id: 4,
        name: "Jennifer Williams",
        role: "Practical Trainer",
        image: "https://img.rocket.new/generatedImages/rocket_gen_img_106a88d29-1763294387589.png",
        alt: "Professional trainer with blonde hair smiling warmly",
        rating: 5,
        content: "This system makes managing practical lessons incredibly easy. I can track each student's progress, schedule sessions efficiently, and the payment system is seamless. My students love the instant feedback feature!",
        achievement: "95% pass rate",
        verified: true
      },
      {
        id: 5,
        name: "David Thompson",
        role: "Senior Driving Trainer",
        image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b99e36f9-1763295192405.png",
        alt: "Experienced trainer in professional attire smiling confidently",
        rating: 5,
        content: "The scheduling system saves me hours every week. I can see my entire week at a glance and students can book sessions that work for both of us. The vehicle assignment feature is brilliant!",
        achievement: "200+ students trained",
        verified: true
      },
      {
        id: 6,
        name: "Lisa Martinez",
        role: "Practical Driving Instructor",
        image: "https://img.rocket.new/generatedImages/rocket_gen_img_10df5a971-1765003957966.png",
        alt: "Professional instructor smiling warmly",
        rating: 5,
        content: "Being able to track student attendance and progress in real-time helps me provide better instruction. The automated reminders reduce no-shows significantly. Best training platform I've used!",
        achievement: "Zero no-shows",
        verified: true
      }
    ],

    teacher: [
      {
        id: 7,
        name: "Robert Anderson",
        role: "Theory Instructor",
        image: "https://img.rocket.new/generatedImages/rocket_gen_img_11e8a20a5-1765003605182.png",
        alt: "Professional teacher with beard smiling confidently",
        rating: 5,
        content: "Managing theoretical lessons has never been easier. I can track which students need extra help, monitor their progress, and the system automatically marks students ready for exams when they meet requirements.",
        achievement: "98% exam pass rate",
        verified: true
      },
      {
        id: 8,
        name: "Patricia Lee",
        role: "Senior Theory Teacher",
        image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e27bc877-1763301137400.png",
        alt: "Professional teacher with glasses smiling warmly",
        rating: 5,
        content: "The student assignment system is fantastic. I can see all my assigned students, their progress, and communication is streamlined. Students are better prepared when they come to lessons!",
        achievement: "150+ students taught",
        verified: true
      },
      {
        id: 9,
        name: "James Wilson",
        role: "Theoretical Instructor",
        image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ca55245c-1763300772526.png",
        alt: "Professional teacher in casual attire smiling confidently",
        rating: 5,
        content: "The dashboard gives me everything I need at a glance. I can quickly identify struggling students and provide targeted support. The automated notifications keep students engaged and prepared.",
        achievement: "First-time pass rate 92%",
        verified: true
      }
    ]
  };

  const currentTestimonials = testimonials[activeCategory];

  return (
    <section id="success-stories" className="py-20 bg-surface">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-headline-bold text-foreground mb-4">
              Success Stories from Our Community
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Real results from students, trainers, and teachers using our platform
            </p>
          </div>

          <div className="flex justify-center space-x-4 mb-12">
            <button
              onClick={() => setActiveCategory('student')}
              className={`px-6 py-3 rounded-lg text-sm font-body font-body-medium transition-smooth ${
                activeCategory === 'student' ? 'bg-primary text-primary-foreground shadow-cta' : 'bg-card text-foreground hover:bg-muted'
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setActiveCategory('trainer')}
              className={`px-6 py-3 rounded-lg text-sm font-body font-body-medium transition-smooth ${
                activeCategory === 'trainer' ? 'bg-primary text-primary-foreground shadow-cta' : 'bg-card text-foreground hover:bg-muted'
              }`}
            >
              Trainers
            </button>
            <button
              onClick={() => setActiveCategory('teacher')}
              className={`px-6 py-3 rounded-lg text-sm font-body font-body-medium transition-smooth ${
                activeCategory === 'teacher' ? 'bg-primary text-primary-foreground shadow-cta' : 'bg-card text-foreground hover:bg-muted'
              }`}
            >
              Teachers
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-card rounded-lg p-6 shadow-card border border-border hover-lift transition-smooth"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <AppImage
                      src={testimonial.image}
                      alt={testimonial.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-base font-headline font-headline-semibold text-foreground">
                        {testimonial.name}
                      </h4>
                      {testimonial.verified && (
                        <Icon name="CheckBadgeIcon" size={20} variant="solid" className="text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    <div className="flex items-center space-x-1 mt-2">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Icon key={i} name="StarIcon" size={16} variant="solid" className="text-warning" />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-foreground leading-relaxed mb-4">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center space-x-2 pt-4 border-t border-border">
                  <Icon name="TrophyIcon" size={16} variant="solid" className="text-success" />
                  <span className="text-xs font-body font-body-medium text-success">
                    {testimonial.achievement}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-success/10 rounded-full border border-success/20">
              <Icon name="UserGroupIcon" size={20} variant="solid" className="text-success" />
              <span className="text-sm font-body font-body-medium text-foreground">
                Join 10,000+ satisfied students and instructors
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
