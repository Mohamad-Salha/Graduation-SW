'use client';

import { useState, useEffect } from 'react';
import { getExamResults } from '@/services/api/student/exams';
import { getStudentProfile } from '@/services/api/student/profile';

export default function Exams() {
  const [exams, setExams] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const [examData, profileData] = await Promise.all([
          getExamResults(),
          getStudentProfile(),
        ]);
        setExams(examData);
        setProfile(profileData);
      } catch (error) {
        console.error('Failed to fetch exam data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const theoryExam = exams?.exams?.find((e: any) => e.type === 'theory');
  const practicalExam = exams?.exams?.find((e: any) => e.type === 'practical');
  const minSessions = profile?.license?.minPracticalSessions || 20;
  const completedSessions = profile?.practicalSessionsCompleted || 0;
  const sessionsRemaining = Math.max(0, minSessions - completedSessions);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Exams</h1>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Theory Exam */}
        <div className="bg-gray-800 p-6 rounded border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">Theory Exam</h2>
          {theoryExam || profile?.theoPassed ? (
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-400">Status</div>
                <div className={`text-xl font-bold ${theoryExam?.passed || profile?.theoPassed ? 'text-green-400' : 'text-red-400'}`}>
                  {theoryExam?.passed || profile?.theoPassed ? '✓ Passed' : '✗ Failed'}
                </div>
              </div>
              {theoryExam?.date && (
                <div>
                  <div className="text-sm text-gray-400">Date</div>
                  <div className="text-white">
                    {new Date(theoryExam.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              )}
              {theoryExam?.score && (
                <div>
                  <div className="text-sm text-gray-400">Score</div>
                  <div className="text-white">{theoryExam.score}/100</div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">📝</div>
              <div className="text-yellow-400 font-bold mb-2">Not Taken</div>
              <div className="text-sm text-gray-400">Schedule your theory exam when ready</div>
            </div>
          )}
        </div>
        
        {/* Practical Exam */}
        <div className="bg-gray-800 p-6 rounded border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">Practical Exam</h2>
          {practicalExam ? (
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-400">Status</div>
                <div className={`text-xl font-bold ${practicalExam.passed ? 'text-green-400' : 'text-red-400'}`}>
                  {practicalExam.passed ? '✓ Passed' : '✗ Failed'}
                </div>
              </div>
              {practicalExam.date && (
                <div>
                  <div className="text-sm text-gray-400">Date</div>
                  <div className="text-white">
                    {new Date(practicalExam.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              )}
              {practicalExam.score && (
                <div>
                  <div className="text-sm text-gray-400">Score</div>
                  <div className="text-white">{practicalExam.score}/100</div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-400">Status</div>
                <div className="text-xl font-bold text-yellow-400">Not Scheduled</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-2">Requirements:</div>
                <div className={`text-sm ${profile?.theoPassed ? 'text-green-400' : 'text-yellow-400'}`}>
                  {profile?.theoPassed ? '✓' : '○'} Pass theory exam
                </div>
                <div className={`text-sm ${sessionsRemaining === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {sessionsRemaining === 0 ? '✓' : '○'} Complete {minSessions} practical sessions
                </div>
              </div>
              {sessionsRemaining > 0 && (
                <div className="text-sm text-gray-400 bg-gray-700 p-2 rounded">
                  You need {sessionsRemaining} more session{sessionsRemaining > 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded border border-gray-700 mt-6">
        <h2 className="text-lg font-bold text-white mb-4">Exam History</h2>
        {exams?.exams && exams.exams.length > 0 ? (
          <div className="space-y-2">
            {exams.exams.map((exam: any, index: number) => (
              <div key={index} className="bg-gray-700 p-3 rounded flex justify-between">
                <div>
                  <div className="text-white capitalize">{exam.type} Exam - Attempt {exam.attempt || 1}</div>
                  <div className="text-sm text-gray-400">
                    {new Date(exam.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div className={exam.passed ? 'text-green-400' : 'text-red-400'}>
                  {exam.passed ? 'Passed' : 'Failed'} - {exam.score || 'N/A'}/100
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8">
            <div className="text-4xl mb-2">📋</div>
            <p>No exam history available</p>
          </div>
        )}
      </div>
    </div>
  );
}
