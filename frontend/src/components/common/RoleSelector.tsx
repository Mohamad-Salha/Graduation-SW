'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

export type UserRole = 'student' | 'instructor' | 'trainer';

interface RoleSelectorProps {
  onRoleChange?: (role: UserRole) => void;
  defaultRole?: UserRole;
  className?: string;
}

interface RoleOption {
  id: UserRole;
  label: string;
  icon: string;
  description: string;
}

const RoleSelector = ({
  onRoleChange,
  defaultRole = 'student',
  className = '',
}: RoleSelectorProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);

  const roles: RoleOption[] = [
    {
      id: 'student',
      label: 'Student',
      icon: 'AcademicCapIcon',
      description: 'Learn driving skills step by step',
    },
    {
      id: 'instructor',
      label: 'Instructor',
      icon: 'UserIcon',
      description: 'Teach and guide students',
    },
    {
      id: 'trainer',
      label: 'Trainer',
      icon: 'BriefcaseIcon',
      description: 'Manage training sessions and evaluations',
    },
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    onRoleChange?.(role);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col items-center space-y-4 mb-8">
        <h3 className="text-lg font-headline font-headline-semibold text-foreground text-center">
          I am a...
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className={`relative flex flex-col items-center p-6 rounded-lg border-2 transition-smooth hover-lift ${
                selectedRole === role.id
                  ? 'border-primary bg-primary/5 shadow-card'
                  : 'border-border bg-card hover:border-primary/30 hover:bg-muted'
              }`}
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full mb-3 transition-smooth ${
                  selectedRole === role.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <Icon name={role.icon as any} size={24} variant="outline" />
              </div>

              <span
                className={`text-base font-body font-body-medium mb-1 ${
                  selectedRole === role.id ? 'text-primary' : 'text-foreground'
                }`}
              >
                {role.label}
              </span>

              <span className="text-sm text-muted-foreground text-center">
                {role.description}
              </span>

              {selectedRole === role.id && (
                <div className="absolute top-3 right-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-success rounded-full">
                    <Icon
                      name="CheckIcon"
                      size={16}
                      variant="solid"
                      className="text-success-foreground"
                    />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
