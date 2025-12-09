'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';


export type DemoType = 'timeline' | 'dashboard' | 'calculator';

interface InteractiveDemoProps {
  type: DemoType;
  className?: string;
}

interface TimelineStep {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface DashboardTab {
  id: string;
  label: string;
  icon: string;
}

const InteractiveDemo = ({ type, className = '' }: InteractiveDemoProps) => {
  const [activeTimelineStep, setActiveTimelineStep] = useState(0);
  const [activeDashboardTab, setActiveDashboardTab] = useState('overview');
  const [calculatorValues, setCalculatorValues] = useState({
    students: 50,
    lessonsPerWeek: 20,
    pricePerLesson: 50,
  });

  const timelineSteps: TimelineStep[] = [
    {
      id: 1,
      title: 'Sign Up & Assessment',
      description: 'Create your account and complete initial driving readiness assessment',
      icon: 'UserPlusIcon',
    },
    {
      id: 2,
      title: 'Schedule Lessons',
      description: 'Book lessons with certified instructors at your convenience',
      icon: 'CalendarIcon',
    },
    {
      id: 3,
      title: 'Track Progress',
      description: 'Monitor your learning journey with real-time progress tracking',
      icon: 'ChartBarIcon',
    },
    {
      id: 4,
      title: 'Pass Your Test',
      description: 'Achieve driving success with our 95% first-time pass rate',
      icon: 'TrophyIcon',
    },
  ];

  const dashboardTabs: DashboardTab[] = [
    { id: 'overview', label: 'Overview', icon: 'HomeIcon' },
    { id: 'schedule', label: 'Schedule', icon: 'CalendarIcon' },
    { id: 'students', label: 'Students', icon: 'UserGroupIcon' },
    { id: 'analytics', label: 'Analytics', icon: 'ChartBarIcon' },
  ];

  const calculateROI = () => {
    const monthlyRevenue = calculatorValues.students * calculatorValues.lessonsPerWeek * calculatorValues.pricePerLesson * 4;
    const annualRevenue = monthlyRevenue * 12;
    const timeSaved = calculatorValues.students * 2;
    return { monthlyRevenue, annualRevenue, timeSaved };
  };

  const renderTimeline = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-headline font-headline-bold text-foreground text-center mb-8">
        Your Journey to Driving Success
      </h3>
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
        <div className="space-y-8">
          {timelineSteps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setActiveTimelineStep(index)}
              className={`relative flex items-start space-x-4 w-full text-left p-4 rounded-lg transition-smooth hover-lift ${
                activeTimelineStep === index
                  ? 'bg-primary/5 border-2 border-primary' :'bg-card border-2 border-transparent hover:border-primary/30'
              }`}
            >
              <div
                className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full transition-smooth ${
                  activeTimelineStep === index
                    ? 'bg-primary text-primary-foreground'
                    : index < activeTimelineStep
                    ? 'bg-success text-success-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index < activeTimelineStep ? (
                  <Icon name="CheckIcon" size={24} variant="solid" />
                ) : (
                  <Icon name={step.icon as any} size={24} variant="outline" />
                )}
              </div>
              <div className="flex-1 pt-1">
                <h4
                  className={`text-lg font-headline font-headline-semibold mb-1 ${
                    activeTimelineStep === index ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {step.title}
                </h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-headline font-headline-bold text-foreground">
          School Management Dashboard
        </h3>
      </div>
      <div className="flex space-x-2 border-b border-border overflow-x-auto">
        {dashboardTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveDashboardTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-body font-body-medium whitespace-nowrap transition-smooth ${
              activeDashboardTab === tab.id
                ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab.icon as any} size={20} variant="outline" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="bg-surface rounded-lg p-6 min-h-[300px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active Students</span>
              <Icon name="UserGroupIcon" size={20} variant="outline" className="text-primary" />
            </div>
            <p className="text-2xl font-headline font-headline-bold text-foreground">248</p>
            <p className="text-xs text-success mt-1">↑ 12% from last month</p>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Lessons This Week</span>
              <Icon name="CalendarIcon" size={20} variant="outline" className="text-secondary" />
            </div>
            <p className="text-2xl font-headline font-headline-bold text-foreground">156</p>
            <p className="text-xs text-success mt-1">↑ 8% from last week</p>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Pass Rate</span>
              <Icon name="TrophyIcon" size={20} variant="outline" className="text-success" />
            </div>
            <p className="text-2xl font-headline font-headline-bold text-foreground">95%</p>
            <p className="text-xs text-success mt-1">↑ 3% from last quarter</p>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground text-center">
            Interactive dashboard preview - Full features available in the platform
          </p>
        </div>
      </div>
    </div>
  );

  const renderCalculator = () => {
    const roi = calculateROI();
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-headline font-headline-bold text-foreground text-center mb-8">
          Calculate Your ROI
        </h3>
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-body font-body-medium text-foreground mb-2">
                Number of Students
              </label>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={calculatorValues.students}
                onChange={(e) =>
                  setCalculatorValues({ ...calculatorValues, students: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-muted-foreground">10</span>
                <span className="text-lg font-headline font-headline-semibold text-primary">
                  {calculatorValues.students}
                </span>
                <span className="text-sm text-muted-foreground">500</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-body font-body-medium text-foreground mb-2">
                Lessons Per Week
              </label>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={calculatorValues.lessonsPerWeek}
                onChange={(e) =>
                  setCalculatorValues({
                    ...calculatorValues,
                    lessonsPerWeek: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-muted-foreground">5</span>
                <span className="text-lg font-headline font-headline-semibold text-primary">
                  {calculatorValues.lessonsPerWeek}
                </span>
                <span className="text-sm text-muted-foreground">100</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-body font-body-medium text-foreground mb-2">
                Price Per Lesson ($)
              </label>
              <input
                type="range"
                min="30"
                max="150"
                step="5"
                value={calculatorValues.pricePerLesson}
                onChange={(e) =>
                  setCalculatorValues({
                    ...calculatorValues,
                    pricePerLesson: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-muted-foreground">$30</span>
                <span className="text-lg font-headline font-headline-semibold text-primary">
                  ${calculatorValues.pricePerLesson}
                </span>
                <span className="text-sm text-muted-foreground">$150</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-success/10 p-4 rounded-lg border-l-4 border-success">
                <p className="text-sm text-muted-foreground mb-1">Monthly Revenue</p>
                <p className="text-2xl font-headline font-headline-bold text-success">
                  ${roi.monthlyRevenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                <p className="text-sm text-muted-foreground mb-1">Annual Revenue</p>
                <p className="text-2xl font-headline font-headline-bold text-primary">
                  ${roi.annualRevenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-secondary/10 p-4 rounded-lg border-l-4 border-secondary">
                <p className="text-sm text-muted-foreground mb-1">Hours Saved/Month</p>
                <p className="text-2xl font-headline font-headline-bold text-secondary">
                  {roi.timeSaved}h
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      {type === 'timeline' && renderTimeline()}
      {type === 'dashboard' && renderDashboard()}
      {type === 'calculator' && renderCalculator()}
    </div>
  );
};

export default InteractiveDemo;