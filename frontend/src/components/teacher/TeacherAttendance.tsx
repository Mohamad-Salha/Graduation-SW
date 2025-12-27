'use client';

import { useState, useEffect } from 'react';
import { getTodayLectures, getLectureDetails, markLectureAttendance } from '@/services/api/teacher/lectures';

export default function TeacherAttendance() {
  const [lectures, setLectures] = useState<any[]>([]);
  const [selectedLecture, setSelectedLecture] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);

  useEffect(() => {
    fetchTodayLectures();
  }, [selectedDate]);

  const fetchTodayLectures = async () => {
    try {
      setLoading(true);
      const data: any = await getTodayLectures();
      setLectures(data.lectures || []);
      
      // If there's only one lecture, select it automatically
      if (data.lectures && data.lectures.length === 1) {
        selectLecture(data.lectures[0].lectureId);
      }
    } catch (error) {
      console.error('Failed to fetch lectures:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectLecture = async (lectureId: string) => {
    try {
      const details: any = await getLectureDetails(lectureId);
      setSelectedLecture(details);
      
      // Initialize attendance data
      const initialAttendance = details.attendees.map((attendee: any) => ({
        studentId: attendee.studentId,
        studentName: attendee.studentName,
        status: attendee.status || 'absent',
        checkInTime: attendee.checkInTime || '',
        notes: attendee.notes || '',
      }));
      setAttendanceData(initialAttendance);
    } catch (error) {
      console.error('Failed to fetch lecture details:', error);
      alert('Failed to load lecture details');
    }
  };

  const updateAttendanceStatus = (studentId: string, field: string, value: string) => {
    setAttendanceData((prev) =>
      prev.map((att) =>
        att.studentId === studentId ? { ...att, [field]: value } : att
      )
    );
  };

  const markAllPresent = () => {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setAttendanceData((prev) =>
      prev.map((att) => ({
        ...att,
        status: 'present',
        checkInTime: timeString,
      }))
    );
  };

  const markAllAbsent = () => {
    setAttendanceData((prev) =>
      prev.map((att) => ({
        ...att,
        status: 'absent',
        checkInTime: '',
      }))
    );
  };

  const handleSaveAttendance = async () => {
    if (!selectedLecture) return;

    try {
      setSavingAttendance(true);
      
      await markLectureAttendance(selectedLecture.lectureId, attendanceData);
      
      alert('Attendance saved successfully!');
      
      // Refresh lecture details
      await selectLecture(selectedLecture.lectureId);
      
      // Refresh lectures list
      await fetchTodayLectures();
    } catch (error) {
      console.error('Failed to save attendance:', error);
      alert('Failed to save attendance. Please try again.');
    } finally {
      setSavingAttendance(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'excused':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
          <p className="text-gray-600 mt-1">
            Record student attendance for your lectures
          </p>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Lectures Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Today's Lectures ({lectures.length})
        </h2>
        
        {lectures.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500">No lectures scheduled for this date</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lectures.map((lecture) => (
              <button
                key={lecture.lectureId}
                onClick={() => selectLecture(lecture.lectureId)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selectedLecture?.lectureId === lecture.lectureId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-semibold text-gray-900">{lecture.courseName}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {lecture.weeklySlot.startTime} - {lecture.weeklySlot.endTime}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  📍 {lecture.location}
                </div>
                {lecture.topic && (
                  <div className="text-sm text-gray-700 mt-2 font-medium">
                    {lecture.topic}
                  </div>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    lecture.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {lecture.status}
                  </span>
                  {lecture.attendanceRate !== undefined && (
                    <span className="text-xs text-gray-600">
                      {lecture.presentCount || 0}/{lecture.totalEnrolled || 0} ({lecture.attendanceRate}%)
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Attendance Form */}
      {selectedLecture && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          {/* Lecture Info */}
          <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedLecture.courseName}
                </h3>
                <p className="text-gray-600 mt-1">
                  {selectedLecture.topic || 'No topic specified'}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>
                    🕐 {selectedLecture.weeklySlot.startTime} - {selectedLecture.weeklySlot.endTime}
                  </span>
                  <span>📍 {selectedLecture.location}</span>
                  <span>👥 {attendanceData.length} Students</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={markAllPresent}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  Mark All Present
                </button>
                <button
                  onClick={markAllAbsent}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  Mark All Absent
                </button>
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-in Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceData.map((student, index) => (
                  <tr key={student.studentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {student.studentName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={student.status}
                        onChange={(e) =>
                          updateAttendanceStatus(student.studentId, 'status', e.target.value)
                        }
                        className={`px-3 py-2 border-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                          student.status
                        )}`}
                      >
                        <option value="present">✓ Present</option>
                        <option value="absent">✗ Absent</option>
                        <option value="late">⏰ Late</option>
                        <option value="excused">📝 Excused</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="time"
                        value={student.checkInTime}
                        onChange={(e) =>
                          updateAttendanceStatus(student.studentId, 'checkInTime', e.target.value)
                        }
                        disabled={student.status === 'absent'}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        placeholder="Add notes..."
                        value={student.notes}
                        onChange={(e) =>
                          updateAttendanceStatus(student.studentId, 'notes', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">
                Present: {attendanceData.filter((a) => a.status === 'present').length}
              </span>
              {' / '}
              <span className="font-semibold">
                Absent: {attendanceData.filter((a) => a.status === 'absent').length}
              </span>
              {' / '}
              <span className="font-semibold">
                Late: {attendanceData.filter((a) => a.status === 'late').length}
              </span>
            </div>
            <button
              onClick={handleSaveAttendance}
              disabled={savingAttendance}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {savingAttendance ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </span>
              ) : (
                'Save Attendance'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
