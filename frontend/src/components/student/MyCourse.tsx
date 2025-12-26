'use client';

import { useState, useEffect } from 'react';
import { getStudentProfile } from '@/services/api/student/profile';

export default function MyCourse() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const data = await getStudentProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile?.license) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">My Course</h1>
        <div className="bg-gray-800 p-12 rounded border border-gray-700 text-center">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-xl font-bold text-white mb-2">No Active Course</h3>
          <p className="text-gray-400 mb-4">You haven't enrolled in any course yet.</p>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Browse Courses
          </button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">My Course</h1>
      
      <div className="grid grid-cols-2 gap-6">
        {/* License Details */}
        <div className="bg-gray-800 p-6 rounded border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">License Details</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-400">License Type</div>
              <div className="text-white">{profile.license.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Description</div>
              <div className="text-white">{profile.license.description}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Min. Practical Sessions</div>
              <div className="text-white">{profile.license.minPracticalSessions} sessions</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Total Cost</div>
              <div className="text-white">${profile.license.price}</div>
            </div>
          </div>
        </div>
        
        {/* Teacher Info */}
        <div className="bg-gray-800 p-6 rounded border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">My Teacher</h2>
          {profile.teacher ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-2xl text-white">
                👨‍🏫
              </div>
              <div>
                <div className="text-white font-semibold">{profile.teacher.name}</div>
                <div className="text-sm text-gray-400">Theoretical Instructor</div>
                <div className="text-sm text-gray-400">📧 {profile.teacher.email}</div>
                <div className="text-sm text-gray-400">📞 {profile.teacher.phone}</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-center py-4">No teacher assigned yet</div>
          )}
        </div>
        
        {/* Trainer Info */}
        <div className="bg-gray-800 p-6 rounded border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">My Trainer</h2>
          {profile.trainer ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-2xl text-white">
                🚗
              </div>
              <div>
                <div className="text-white font-semibold">{profile.trainer.name}</div>
                <div className="text-sm text-gray-400">Practical Instructor</div>
                <div className="text-sm text-gray-400">📧 {profile.trainer.email}</div>
                <div className="text-sm text-gray-400">📞 {profile.trainer.phone}</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-center py-4">No trainer assigned yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
