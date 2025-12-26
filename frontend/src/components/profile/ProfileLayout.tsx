'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ProfileHeader from './ProfileHeader';
import ContactInformation from './ContactInformation';
import BasicInformation from './BasicInformation';
import RoleSpecificInfo from './RoleSpecificInfo';
import ProfileActions from './ProfileActions';
import EditProfileModal from './EditProfileModal';

export default function ProfileLayout() {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // TODO: Get from auth context/localStorage
  const userRole = 'student' as 'student' | 'teacher' | 'trainer' | 'admin';

  const handleBackToDashboard = () => {
    router.push(`/${userRole}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 border-b border-purple-800/50 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-white hover:text-blue-200 transition-all duration-300 group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-medium">Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <span className="text-2xl">👤</span>
              <span className="text-white text-sm font-medium">My Profile</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Profile Header */}
        <ProfileHeader onEdit={() => setIsEditModalOpen(true)} />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <ContactInformation />
          <BasicInformation />
        </div>

        {/* Role-Specific Information */}
        <div className="mt-6">
          <RoleSpecificInfo role={userRole} />
        </div>

        {/* Action Buttons */}
        <div className="mt-6">
          <ProfileActions onEdit={() => setIsEditModalOpen(true)} />
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditProfileModal onClose={() => setIsEditModalOpen(false)} />
      )}
    </div>
  );
}
