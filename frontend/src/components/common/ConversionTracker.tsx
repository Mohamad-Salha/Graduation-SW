'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

export type ConversionStep = 'role-selection' | 'contact-info' | 'preferences' | 'confirmation';

interface ConversionTrackerProps {
  currentStep?: ConversionStep;
  onStepChange?: (step: ConversionStep) => void;
  className?: string;
}

interface StepConfig {
  id: ConversionStep;
  label: string;
  icon: string;
  order: number;
}

const ConversionTracker = ({
  currentStep = 'role-selection',
  onStepChange,
  className = '',
}: ConversionTrackerProps) => {
  const [activeStep, setActiveStep] = useState<ConversionStep>(currentStep);

  const steps: StepConfig[] = [
    {
      id: 'role-selection',
      label: 'Select Role',
      icon: 'UserIcon',
      order: 1,
    },
    {
      id: 'contact-info',
      label: 'Contact Info',
      icon: 'EnvelopeIcon',
      order: 2,
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: 'Cog6ToothIcon',
      order: 3,
    },
    {
      id: 'confirmation',
      label: 'Confirmation',
      icon: 'CheckCircleIcon',
      order: 4,
    },
  ];

  const getStepStatus = (stepOrder: number): 'completed' | 'active' | 'upcoming' => {
    const currentOrder = steps.find((s) => s.id === activeStep)?.order || 1;
    if (stepOrder < currentOrder) return 'completed';
    if (stepOrder === currentOrder) return 'active';
    return 'upcoming';
  };

  const handleStepClick = (step: ConversionStep) => {
    const clickedOrder = steps.find((s) => s.id === step)?.order || 1;
    const currentOrder = steps.find((s) => s.id === activeStep)?.order || 1;

    if (clickedOrder <= currentOrder) {
      setActiveStep(step);
      if (onStepChange) {
        onStepChange(step);
      }
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const status = getStepStatus(step.order);
          const isClickable = status === 'completed' || status === 'active';

          return (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => handleStepClick(step.id)}
                disabled={!isClickable}
                className={`flex flex-col items-center space-y-2 transition-smooth ${
                  isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-smooth ${
                    status === 'completed'
                      ? 'bg-success border-success text-success-foreground'
                      : status === 'active' ?'bg-primary border-primary text-primary-foreground' :'bg-muted border-border text-muted-foreground'
                  } ${isClickable ? 'hover-lift' : ''}`}
                >
                  {status === 'completed' ? (
                    <Icon name="CheckIcon" size={24} variant="solid" />
                  ) : (
                    <Icon name={step.icon as any} size={24} variant="outline" />
                  )}
                </div>
                <span
                  className={`text-xs font-body font-body-medium text-center hidden sm:block ${
                    status === 'active' ?'text-primary'
                      : status === 'completed' ?'text-success' :'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </button>

              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 sm:mx-4">
                  <div
                    className={`h-full transition-smooth ${
                      getStepStatus(steps[index + 1].order) === 'completed'
                        ? 'bg-success' :'bg-border'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversionTracker;