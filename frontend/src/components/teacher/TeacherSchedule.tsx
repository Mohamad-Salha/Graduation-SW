'use client';

import { useState, useEffect } from 'react';
import { getTeacherSchedules, createSchedule } from '@/services/api/teacher/schedule';
import { getLectures, createLecture, updateLecture, cancelLecture } from '@/services/api/teacher/lectures';

export default function TeacherSchedule() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [lectures, setLectures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [showCreateLecture, setShowCreateLecture] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = current week

  // Form state for creating lecture
  const [newLecture, setNewLecture] = useState({
    scheduleId: '',
    date: '',
    topic: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, [selectedWeek]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get schedules
      const schedulesData: any = await getTeacherSchedules();
      setSchedules(schedulesData.schedules || []);

      // Get lectures for the selected week
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + (selectedWeek * 7));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const lecturesData: any = await getLectures({
        startDate: startOfWeek.toISOString().split('T')[0],
        endDate: endOfWeek.toISOString().split('T')[0],
      });
      setLectures(lecturesData.lectures || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLecture = async () => {
    if (!newLecture.scheduleId || !newLecture.date) {
      alert('Please select a schedule and date');
      return;
    }

    try {
      await createLecture(newLecture);
      alert('Lecture created successfully!');
      setShowCreateLecture(false);
      setNewLecture({ scheduleId: '', date: '', topic: '', description: '' });
      await fetchData();
    } catch (error: any) {
      console.error('Failed to create lecture:', error);
      alert(error.message || 'Failed to create lecture');
    }
  };

  const handleCancelLecture = async (lectureId: string) => {
    const reason = prompt('Please provide a reason for cancellation:');
    if (!reason) return;

    try {
      await cancelLecture(lectureId, reason);
      alert('Lecture cancelled successfully!');
      await fetchData();
    } catch (error) {
      console.error('Failed to cancel lecture:', error);
      alert('Failed to cancel lecture');
    }
  };

  const getDayLectures = (dayIndex: number) => {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - today.getDay() + dayIndex + (selectedWeek * 7));
    const dateString = targetDate.toISOString().split('T')[0];

    return lectures.filter((lecture) => {
      const lectureDate = new Date(lecture.date).toISOString().split('T')[0];
      return lectureDate === dateString;
    });
  };

  const getWeekDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - today.getDay() + i + (selectedWeek * 7));
      dates.push(date);
    }
    return dates;
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekDates = getWeekDates();

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
          <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-gray-600 mt-1">
            Manage your theoretical lectures and weekly schedule
          </p>
        </div>
        <button
          onClick={() => setShowCreateLecture(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Create Lecture
        </button>
      </div>

      {/* View Toggle & Week Navigation */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          {/* Week Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedWeek(selectedWeek - 1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">
                {selectedWeek === 0 ? 'This Week' : selectedWeek === -1 ? 'Last Week' : selectedWeek === 1 ? 'Next Week' : `Week ${selectedWeek > 0 ? '+' : ''}${selectedWeek}`}
              </p>
              <p className="text-sm text-gray-600">
                {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => setSelectedWeek(selectedWeek + 1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {selectedWeek !== 0 && (
              <button
                onClick={() => setSelectedWeek(0)}
                className="ml-4 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                Today
              </button>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'list'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'calendar'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calendar View
            </button>
          </div>
        </div>
      </div>

      {/* My Theoretical Schedules */}
      {schedules.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Weekly Schedules ({schedules.length})
          </h2>
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div key={schedule.scheduleId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{schedule.courseId.name || 'Course'}</h3>
                    <p className="text-sm text-gray-600 mt-1">📍 {schedule.location}</p>
                    <div className="flex gap-2 mt-2">
                      {schedule.weeklySlots.map((slot: any, index: number) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {slot.day} {slot.startTime}-{slot.endTime}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    schedule.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {schedule.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lectures Display */}
      {view === 'list' ? (
        // List View
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          {lectures.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium">No lectures this week</p>
              <p className="text-sm mt-1">Create a new lecture to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Topic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lectures.map((lecture) => (
                    <tr key={lecture.lectureId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(lecture.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {lecture.weeklySlot.startTime} - {lecture.weeklySlot.endTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lecture.courseName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {lecture.topic || 'No topic set'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {lecture.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          lecture.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : lecture.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {lecture.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {lecture.presentCount || 0} / {lecture.totalEnrolled || 0}
                        {lecture.attendanceRate !== undefined && (
                          <span className="text-gray-400 ml-1">
                            ({lecture.attendanceRate}%)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {lecture.status === 'scheduled' && (
                          <button
                            onClick={() => handleCancelLecture(lecture.lectureId)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        // Calendar View
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {/* Day Headers */}
            {dayNames.map((day, index) => (
              <div key={day} className="bg-gray-50 p-3 text-center">
                <div className="text-xs font-semibold text-gray-500 uppercase">{day}</div>
                <div className="text-sm text-gray-900 mt-1">
                  {weekDates[index].getDate()}
                </div>
              </div>
            ))}
            
            {/* Day Cells */}
            {dayNames.map((day, index) => {
              const dayLectures = getDayLectures(index);
              const isToday = weekDates[index].toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={day}
                  className={`bg-white min-h-[120px] p-2 ${
                    isToday ? 'ring-2 ring-blue-500 ring-inset' : ''
                  }`}
                >
                  <div className="space-y-1">
                    {dayLectures.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4">No lectures</p>
                    ) : (
                      dayLectures.map((lecture) => (
                        <div
                          key={lecture.lectureId}
                          className={`text-xs p-2 rounded cursor-pointer ${
                            lecture.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : lecture.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          <div className="font-semibold truncate">{lecture.courseName}</div>
                          <div className="truncate">{lecture.weeklySlot.startTime}</div>
                          {lecture.topic && (
                            <div className="truncate mt-1">{lecture.topic}</div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Lecture Modal */}
      {showCreateLecture && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4 pb-4 border-b">
              <h3 className="text-2xl font-bold text-gray-900">Create New Lecture</h3>
              <button
                onClick={() => setShowCreateLecture(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Schedule
                </label>
                <select
                  value={newLecture.scheduleId}
                  onChange={(e) => setNewLecture({ ...newLecture, scheduleId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select a schedule --</option>
                  {schedules.map((schedule) => (
                    <option key={schedule.scheduleId} value={schedule.scheduleId}>
                      {schedule.courseId.name} - {schedule.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newLecture.date}
                  onChange={(e) => setNewLecture({ ...newLecture, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Traffic Signs and Road Markings"
                  value={newLecture.topic}
                  onChange={(e) => setNewLecture({ ...newLecture, topic: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Add lecture description..."
                  value={newLecture.description}
                  onChange={(e) => setNewLecture({ ...newLecture, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateLecture(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateLecture}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Create Lecture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
