'use client';

import { useState } from 'react';
import { uploadProfilePicture } from '@/services/api/upload/profile';

interface ProfilePictureUploadProps {
  currentImage?: string;
  onUpdate?: (imageUrl: string) => void;
}

export default function ProfilePictureUpload({ currentImage = '', onUpdate }: ProfilePictureUploadProps) {
  const [profilePicture, setProfilePicture] = useState<string>(currentImage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Upload to Cloudinary via API
      const result = await uploadProfilePicture(file);
      
      // Update local state
      setProfilePicture(result.imageUrl);
      
      // Notify parent component
      if (onUpdate) {
        onUpdate(result.imageUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group">
      {error && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap z-10">
          {error}
        </div>
      )}
      
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-1 shadow-2xl shadow-blue-600/50 group-hover:shadow-blue-600/70 transition-all duration-300 group-hover:scale-105">
        <div className="w-full h-full rounded-full overflow-hidden bg-gray-700 relative">
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl bg-gradient-to-br from-gray-700 to-gray-800">
              👤
            </div>
          )}
          
          {loading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      </div>
      
      <label className={`absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-full p-3 ${loading ? 'cursor-wait opacity-50' : 'cursor-pointer'} transition-all duration-300 shadow-lg shadow-blue-600/50 hover:shadow-blue-600/70 hover:scale-110 group-hover:rotate-12`}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={loading}
        />
        <span className="text-lg">📷</span>
      </label>
    </div>
  );
}
