'use client';

import { useState } from 'react';

export default function ProfilePictureUpload() {
  const [profilePicture, setProfilePicture] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Upload to Cloudinary
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative group">
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-1 shadow-2xl shadow-blue-600/50 group-hover:shadow-blue-600/70 transition-all duration-300 group-hover:scale-105">
        <div className="w-full h-full rounded-full overflow-hidden bg-gray-700">
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl bg-gradient-to-br from-gray-700 to-gray-800">
              👤
            </div>
          )}
        </div>
      </div>
      
      <label className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-full p-3 cursor-pointer transition-all duration-300 shadow-lg shadow-blue-600/50 hover:shadow-blue-600/70 hover:scale-110 group-hover:rotate-12">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <span className="text-lg">📷</span>
      </label>
    </div>
  );
}
