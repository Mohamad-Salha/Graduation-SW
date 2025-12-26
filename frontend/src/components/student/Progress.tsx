'use client';

import { useState, useEffect } from 'react';
import { getStudentProgress } from '@/services/api/student/progress';
import { getStudentProfile } from '@/services/api/student/profile';

export default function Progress() {
  const [progress, setProgress] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const [progressData, profileData] = await Promise.all([
          getStudentProgress(),
          getStudentProfile(),
        ]);
        setProgress(progressData);
        setProfile(profileData);
      } catch (error) {
        console.error('Failed to fetch progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const theoryProgress = progress?.theoryProgress || 0;
  const practicalProgress = progress?.practicalProgress || 0;
  const sessionsCompleted = profile?.practicalSessionsCompleted || 0;
  const minSessions = profile?.license?.minPracticalSessions || 20;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Progress Tracking</h1>
      
      <div className="bg-gray-800 p-6 rounded border border-gray-700 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Progress Breakdown</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-300">Theory Progress</span>
              <span className="text-white">{theoryProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-500" 
                style={{width: `${theoryProgress}%`}}
              ></div>
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {profile?.theoPassed ? '✓ Theory Exam Passed' : 'Theory exam not yet taken'}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-300">Practical Sessions</span>
              <span className="text-white">{sessionsCompleted}/{minSessions} ({practicalProgress}%)</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
                style={{width: `${practicalProgress}%`}}
              ></div>
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {minSessions - sessionsCompleted > 0 
                ? `${minSessions - sessionsCompleted} sessions remaining` 
                : 'All required sessions completed!'}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-300">Overall Course Progress</span>
              <span className="text-white">{Math.round((theoryProgress + practicalProgress) / 2)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500" 
                style={{width: `${Math.round((theoryProgress + practicalProgress) / 2)}%`}}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4">Status Overview</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-700 p-4 rounded text-center">
            <div className="text-2xl mb-2">{profile?.theoPassed ? '✅' : '⏳'}</div>
            <div className="text-gray-400 text-sm">Theory Status</div>
            <div className="text-white font-medium">{profile?.theoPassed ? 'Passed' : 'Pending'}</div>
          </div>
          <div className="bg-gray-700 p-4 rounded text-center">
            <div className="text-2xl mb-2">🚗</div>
            <div className="text-gray-400 text-sm">Practical Sessions</div>
            <div className="text-white font-medium">{sessionsCompleted} Completed</div>
          </div>
          <div className="bg-gray-700 p-4 rounded text-center">
            <div className="text-2xl mb-2">
              {profile?.status === 'active' ? '🟢' : profile?.status === 'pending' ? '🟡' : '⚪'}
            </div>
            <div className="text-gray-400 text-sm">Account Status</div>
            <div className="text-white font-medium capitalize">{profile?.status || 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
