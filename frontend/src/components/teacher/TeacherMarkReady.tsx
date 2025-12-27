'use client';

import { useState, useEffect } from 'react';
import { getAssignedStudents, getStudentDetails, markStudentReady } from '@/services/api/teacher/students';

export default function TeacherMarkReady() {
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data: any = await getAssignedStudents();
      // Filter only students who haven't passed theory exam yet and are not already marked ready
      const eligibleStudents = (data.students || []).filter(
        (s: any) => !s.theoPassed
      );
      setStudents(eligibleStudents);
      setFilteredStudents(eligibleStudents);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    if (!searchTerm) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const checkEligibility = async (studentId: string) => {
    try {
      const details: any = await getStudentDetails(studentId);
      setSelectedStudent(details);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to fetch student details:', error);
      alert('Failed to load student details');
    }
  };

  const handleMarkReady = async () => {
    if (!selectedStudent) return;

    // Check eligibility
    const stats = selectedStudent.attendanceStats;
    const minAttendanceRate = 80;
    const minLectures = 10;

    if (stats.attendanceRate < minAttendanceRate) {
      alert(`Student attendance rate is ${stats.attendanceRate}%. Minimum required: ${minAttendanceRate}%`);
      return;
    }

    if (stats.attended < minLectures) {
      alert(`Student has attended ${stats.attended} lectures. Minimum required: ${minLectures}`);
      return;
    }

    if (!confirm(`Are you sure you want to mark ${selectedStudent.name} as ready for the theoretical exam?`)) {
      return;
    }

    try {
      setMarking(true);
      await markStudentReady(selectedStudent.studentId);
      alert('Student marked as ready for theoretical exam successfully!');
      setShowModal(false);
      // Refresh students list
      await fetchStudents();
    } catch (error: any) {
      console.error('Failed to mark student ready:', error);
      alert(error.message || 'Failed to mark student ready');
    } finally {
      setMarking(false);
    }
  };

  const getEligibilityStatus = (student: any) => {
    if (student.readyForTheoExam) {
      return { status: 'ready', text: 'Already Marked Ready', color: 'bg-blue-100 text-blue-800' };
    }
    // We don't have attendance stats in the list, so we show as "Check Eligibility"
    return { status: 'check', text: 'Check Eligibility', color: 'bg-gray-100 text-gray-800' };
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mark Students Ready for Exam</h1>
        <p className="text-gray-600 mt-1">
          Review student attendance and mark them ready for theoretical examination
        </p>
      </div>

      {/* Requirements Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">📋 Eligibility Requirements</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Minimum 80% attendance rate</li>
          <li>✓ At least 10 lectures attended</li>
          <li>✓ Student must not have already passed the theoretical exam</li>
        </ul>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <input
          type="text"
          placeholder="Search students by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-lg font-medium">No students found</p>
            <p className="text-sm mt-1">All students have either passed or are not yet eligible</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    License
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => {
                  const eligibility = getEligibilityStatus(student);
                  return (
                    <tr key={student.studentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {student.license?.name || 'Not enrolled'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${eligibility.color}`}>
                          {eligibility.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {student.readyForTheoExam ? (
                          <span className="text-green-600">✓ Marked Ready</span>
                        ) : (
                          <button
                            onClick={() => checkEligibility(student.studentId)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Check & Mark Ready
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Eligibility Check Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-lg bg-white">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 pb-4 border-b">
              <h3 className="text-2xl font-bold text-gray-900">
                Eligibility Check: {selectedStudent.name}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-6">
              {/* Student Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Student Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{selectedStudent.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 font-medium">{selectedStudent.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">License:</span>
                    <span className="ml-2 font-medium">{selectedStudent.license?.name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedStudent.readyForTheoExam
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedStudent.readyForTheoExam ? 'Already Ready' : 'Not Ready Yet'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Attendance Statistics */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Attendance Requirements</h4>
                
                {selectedStudent.attendanceStats ? (
                  <div className="space-y-4">
                    {/* Attendance Rate */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Attendance Rate</span>
                        <span className={`text-lg font-bold ${
                          selectedStudent.attendanceStats.attendanceRate >= 80
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {selectedStudent.attendanceStats.attendanceRate}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            selectedStudent.attendanceStats.attendanceRate >= 80
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(selectedStudent.attendanceStats.attendanceRate, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedStudent.attendanceStats.attendanceRate >= 80 ? '✓' : '✗'} Minimum required: 80%
                      </p>
                    </div>

                    {/* Lectures Attended */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Lectures Attended</span>
                        <span className={`text-lg font-bold ${
                          selectedStudent.attendanceStats.attended >= 10
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {selectedStudent.attendanceStats.attended} / {selectedStudent.attendanceStats.totalLectures}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            selectedStudent.attendanceStats.attended >= 10
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min((selectedStudent.attendanceStats.attended / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedStudent.attendanceStats.attended >= 10 ? '✓' : '✗'} Minimum required: 10 lectures
                      </p>
                    </div>

                    {/* Detailed Stats */}
                    <div className="grid grid-cols-4 gap-2 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {selectedStudent.attendanceStats.attended}
                        </p>
                        <p className="text-xs text-gray-600">Attended</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">
                          {selectedStudent.attendanceStats.absent}
                        </p>
                        <p className="text-xs text-gray-600">Absent</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">
                          {selectedStudent.attendanceStats.late}
                        </p>
                        <p className="text-xs text-gray-600">Late</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {selectedStudent.attendanceStats.excused}
                        </p>
                        <p className="text-xs text-gray-600">Excused</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No attendance data available
                  </p>
                )}
              </div>

              {/* Eligibility Result */}
              {selectedStudent.attendanceStats && (
                <div className={`border-2 rounded-lg p-4 ${
                  selectedStudent.attendanceStats.attendanceRate >= 80 &&
                  selectedStudent.attendanceStats.attended >= 10
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                }`}>
                  {selectedStudent.attendanceStats.attendanceRate >= 80 &&
                  selectedStudent.attendanceStats.attended >= 10 ? (
                    <div className="flex items-start">
                      <svg className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-green-900">Student is Eligible!</p>
                        <p className="text-sm text-green-700 mt-1">
                          This student meets all requirements and can be marked ready for the theoretical exam.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start">
                      <svg className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-red-900">Student Not Eligible</p>
                        <p className="text-sm text-red-700 mt-1">
                          This student does not meet the minimum requirements yet.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              {selectedStudent.attendanceStats &&
                selectedStudent.attendanceStats.attendanceRate >= 80 &&
                selectedStudent.attendanceStats.attended >= 10 &&
                !selectedStudent.readyForTheoExam && (
                  <button
                    onClick={handleMarkReady}
                    disabled={marking}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {marking ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Marking...
                      </span>
                    ) : (
                      '✓ Mark as Ready for Exam'
                    )}
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
