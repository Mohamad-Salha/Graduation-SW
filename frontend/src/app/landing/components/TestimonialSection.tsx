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
  const [activeCategory, setActiveCategory] = useState<'student' | 'parent' | 'school'>('student');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const testimonials: Record<string, Testimonial[]> = {
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
    }],

    parent: [
    {
      id: 4,
      name: "Jennifer Williams",
      role: "Parent of Teen Driver",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_106a88d29-1763294387589.png",
      alt: "Middle-aged woman with blonde hair in professional attire smiling warmly",
      rating: 5,
      content: "As a parent, I loved being able to track my daughter's progress in real-time. The communication with instructors was excellent, and the transparent pricing eliminated any surprises. Worth every penny!",
      achievement: "Daughter passed first try",
      verified: true
    },
    {
      id: 5,
      name: "David Thompson",
      role: "Parent of Two Teens",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b99e36f9-1763295192405.png",
      alt: "Middle-aged man with short gray hair in business casual attire smiling confidently",
      rating: 5,
      content: "Managing driving lessons for two teenagers was stressful until we found DriveMaster Pro. The parent portal kept me informed, and the automatic payment system made budgeting easy. Both kids passed on their first attempt!",
      achievement: "Both teens licensed",
      verified: true
    },
    {
      id: 6,
      name: "Lisa Martinez",
      role: "Parent of Teen Driver",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_10df5a971-1765003957966.png",
      alt: "Professional woman with dark hair in elegant business attire smiling warmly",
      rating: 5,
      content: "The safety features and instructor verification gave me peace of mind. I could see exactly where lessons were taking place and received detailed reports after each session. Excellent service!",
      achievement: "Son licensed safely",
      verified: true
    }],

    school: [
    {
      id: 7,
      name: "Robert Anderson",
      role: "Owner, Anderson Driving School",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_11e8a20a5-1765003605182.png",
      alt: "Professional man with beard in business suit smiling confidently in office setting",
      rating: 5,
      content: "DriveMaster Pro transformed our operations. We reduced administrative time by 40% and increased student capacity by 30%. The automated scheduling and billing alone paid for the system in the first month.",
      achievement: "40% time savings",
      verified: true
    },
    {
      id: 8,
      name: "Patricia Lee",
      role: "Director, SafeDrive Academy",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e27bc877-1763301137400.png",
      alt: "Professional Asian woman with glasses in business attire smiling warmly",
      rating: 5,
      content: "Our student satisfaction scores increased dramatically after implementing this platform. Parents love the transparency, students appreciate the progress tracking, and our instructors save hours on paperwork.",
      achievement: "95% satisfaction rate",
      verified: true
    },
    {
      id: 9,
      name: "James Wilson",
      role: "Manager, Metro Driving School",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ca55245c-1763300772526.png",
      alt: "Professional man with short dark hair in business casual attire smiling confidently",
      rating: 5,
      content: "The analytics dashboard helps us make data-driven decisions about instructor scheduling and vehicle utilization. We've grown from 50 to 200 students in just six months with the same staff size.",
      achievement: "300% growth",
      verified: true
    }]

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
              Real results from students, parents, and driving schools who transformed their experience
            </p>
          </div>

          <div className="flex justify-center space-x-4 mb-12">
            <button
              onClick={() => setActiveCategory('student')}
              className={`px-6 py-3 rounded-lg text-sm font-body font-body-medium transition-smooth ${
              activeCategory === 'student' ? 'bg-primary text-primary-foreground shadow-cta' : 'bg-card text-foreground hover:bg-muted'}`
              }>

              Students
            </button>
            <button
              onClick={() => setActiveCategory('parent')}
              className={`px-6 py-3 rounded-lg text-sm font-body font-body-medium transition-smooth ${
              activeCategory === 'parent' ? 'bg-primary text-primary-foreground shadow-cta' : 'bg-card text-foreground hover:bg-muted'}`
              }>

              Parents
            </button>
            <button
              onClick={() => setActiveCategory('school')}
              className={`px-6 py-3 rounded-lg text-sm font-body font-body-medium transition-smooth ${
              activeCategory === 'school' ? 'bg-primary text-primary-foreground shadow-cta' : 'bg-card text-foreground hover:bg-muted'}`
              }>

              Schools
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTestimonials.map((testimonial) =>
            <div
              key={testimonial.id}
              className="bg-card rounded-lg p-6 shadow-card border border-border hover-lift transition-smooth">

                <div className="flex items-start space-x-4 mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <AppImage
                    src={testimonial.image}
                    alt={testimonial.alt}
                    className="w-full h-full object-cover" />

                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-base font-headline font-headline-semibold text-foreground">
                        {testimonial.name}
                      </h4>
                      {testimonial.verified &&
                    <Icon name="CheckBadgeIcon" size={20} variant="solid" className="text-primary" />
                    }
                    </div>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    <div className="flex items-center space-x-1 mt-2">
                      {Array.from({ length: testimonial.rating }).map((_, i) =>
                    <Icon key={i} name="StarIcon" size={16} variant="solid" className="text-warning" />
                    )}
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
            )}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-success/10 rounded-full border border-success/20">
              <Icon name="UserGroupIcon" size={20} variant="solid" className="text-success" />
              <span className="text-sm font-body font-body-medium text-foreground">
                Join 10,000+ satisfied students and 200+ partner schools
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default TestimonialSection;