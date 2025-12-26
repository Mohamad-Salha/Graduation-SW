'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ProfileHeader from './ProfileHeader';
import ContactInformation from './ContactInformation';
import BasicInformation from './BasicInformation';
import RoleSpecificInfo from './RoleSpecificInfo';
import ProfileActions from './ProfileActions';
import EditProfileModal from './EditProfileModal';
import { getUserData } from '@/utils/auth';
import { getStudentProfile } from '@/services/api/student/profile';
import { getTeacherProfile } from '@/services/api/teacher/profile';
import { getTrainerProfile } from '@/services/api/trainer/profile';

export default function ProfileLayout() {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const userData = getUserData();
  const userRole = userData?.role || 'student';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        let data;
        
        // Fetch profile based on role
        if (userRole === 'student') {
          data = await getStudentProfile();
        } else if (userRole === 'teacher') {
          data = await getTeacherProfile();
        } else if (userRole === 'trainer') {
          data = await getTrainerProfile();
        }
        
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userRole]);

  const handleBackToDashboard = () => {
    router.push(`/${userRole}/dashboard`);
  };

  const handleProfileUpdate = (updatedUser: any) => {
    setProfile(updatedUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push(`/${userRole}/dashboard`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

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
        <ProfileHeader 
          user={profile} 
          onEdit={() => setIsEditModalOpen(true)} 
          onProfileUpdate={handleProfileUpdate}
        />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <ContactInformation user={profile} />
          <BasicInformation user={profile} />
        </div>

        {/* Role-Specific Information */}
        <div className="mt-6">
          <RoleSpecificInfo role={userRole} data={profile} />
        </div>

        {/* Action Buttons */}
        <div className="mt-6">
          <ProfileActions onEdit={() => setIsEditModalOpen(true)} />
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditProfileModal 
          user={profile} 
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={(updatedData) => setProfile({ ...profile, ...updatedData })}
        />
      )}
    </div>
  );
}
