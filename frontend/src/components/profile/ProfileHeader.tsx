'use client';

import ProfilePictureUpload from './ProfilePictureUpload';

interface ProfileHeaderProps {
  onEdit: () => void;
}

export default function ProfileHeader({ onEdit }: ProfileHeaderProps) {
  // TODO: Get from API
  const user = {
    name: 'John Doe',
    role: 'Student',
    email: 'john@example.com',
    status: 'Active',
    profileCompletion: 85,
    memberSince: 'Dec 2025',
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-3xl"></div>
      
      <div className="relative space-y-6">
        {/* Main Info Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <ProfilePictureUpload />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-800"></div>
            </div>
            
            {/* User Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{user.name}</h1>
                <span className="text-xl" title="Verified Account">✓</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm rounded-full shadow-lg shadow-blue-600/30 font-medium">
                  {user.role}
                </span>
                <span className="px-4 py-1.5 bg-gradient-to-r from-green-600 to-green-500 text-white text-sm rounded-full shadow-lg shadow-green-600/30 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  {user.status}
                </span>
                <span className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">
                  📅 {user.memberSince}
                </span>
              </div>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={onEdit}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300 font-medium shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105"
          >
            ✏️ Edit Profile
          </button>
        </div>

        {/* Profile Completion Bar */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300 font-medium">Profile Completion</span>
            <span className="text-sm font-bold text-blue-400">{user.profileCompletion}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${user.profileCompletion}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
