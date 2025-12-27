'use client';

import { useState, useEffect } from 'react';
import {
  getAllStudents,
  getPendingStudents,
  getStudentDetails,
  approveStudent,
  rejectStudent,
  assignTeacherToStudent,
  assignTrainerToStudent,
  updateStudent,
  deleteStudent
} from '@/services/api/admin/students';
import { getAllTeachers } from '@/services/api/admin/staff';
import { getAllTrainers } from '@/services/api/admin/staff';

export default function AdminStudentsManagement() {
  const [students, setStudents] = useState<any[]>([]);
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('pending'); // 'pending' or 'all'
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignType, setAssignType] = useState(''); // 'teacher' or 'trainer'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, [view]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (view === 'pending') {
        const data: any = await getPendingStudents();
        setPendingStudents(data?.students || data || []);
      } else {
        const [studentsData, teachersData, trainersData]: any[] = await Promise.all([
          getAllStudents(),
          getAllTeachers(),
          getAllTrainers()
        ]);
        setStudents(studentsData?.students || studentsData || []);
        setTeachers(teachersData?.teachers || teachersData || []);
        setTrainers(trainersData?.trainers || trainersData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (studentId: string) => {
    if (!confirm('Are you sure you want to approve this student?')) return;

    try {
      await approveStudent(studentId);
      alert('Student approved successfully!');
      fetchData();
    } catch (error: any) {
      alert('Error approving student: ' + error.message);
    }
  };

  const handleReject = async (studentId: string) => {
    if (!confirm('Are you sure you want to reject this student?')) return;

    try {
      await rejectStudent(studentId);
      alert('Student rejected successfully!');
      fetchData();
    } catch (error: any) {
      alert('Error rejecting student: ' + error.message);
    }
  };

  const handleViewDetails = async (student: any) => {
    try {
      const data: any = await getStudentDetails(student._id || student.studentId);
      setSelectedStudent(data?.student || data || student);
      setShowDetailsModal(true);
    } catch (error: any) {
      alert('Error fetching student details: ' + error.message);
    }
  };

  const handleAssign = async (studentId: string, assignedId: string) => {
    try {
      if (assignType === 'teacher') {
        await assignTeacherToStudent(studentId, assignedId);
        alert('Teacher assigned successfully!');
      } else {
        await assignTrainerToStudent(studentId, assignedId);
        alert('Trainer assigned successfully!');
      }
      setShowAssignModal(false);
      fetchData();
    } catch (error: any) {
      alert('Error assigning: ' + error.message);
    }
  };

  const openAssignModal = (student: any, type: string) => {
    setSelectedStudent(student);
    setAssignType(type);
    setShowAssignModal(true);
  };

  const handleDelete = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) return;

    try {
      await deleteStudent(studentId);
      alert('Student deleted successfully!');
      fetchData();
    } catch (error: any) {
      alert('Error deleting student: ' + error.message);
    }
  };

  const filteredStudents = students.filter(student => {
    const studentName = student.userId?.name || student.name || '';
    const studentEmail = student.userId?.email || student.email || '';
    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600 mt-1">Manage student registrations and assignments</p>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setView('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending ({pendingStudents.length})
          </button>
          <button
            onClick={() => setView('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Students ({students.length})
          </button>
        </div>
      </div>

      {/* Pending Students View */}
      {view === 'pending' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Pending Approvals</h2>
          </div>

          {pendingStudents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No pending student approvals
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {pendingStudents.map((student) => (
                <div key={student.studentId} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xl text-blue-600 font-semibold">
                          {student.name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Registered: {new Date(student.signupDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(student.studentId)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleReject(student.studentId)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* All Students View */}
      {view === 'all' && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trainer
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student._id || student.studentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {(student.userId?.name || student.name || '?').charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.userId?.name || student.name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.userId?.email || student.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.status === 'approved' 
                            ? 'bg-green-100 text-green-800'
                            : student.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {student.theoTeacherId?.userId?.name ? (
                          <div className="flex items-center">
                            <span className="text-gray-900 font-medium">
                              {student.theoTeacherId.userId.name}
                            </span>
                            <button
                              onClick={() => openAssignModal(student, 'teacher')}
                              className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                              title="Change teacher"
                            >
                              ✏️
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => openAssignModal(student, 'teacher')}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            + Assign Teacher
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {student.trainerId?.userId?.name ? (
                          <div className="flex items-center">
                            <span className="text-gray-900 font-medium">
                              {student.trainerId.userId.name}
                            </span>
                            <button
                              onClick={() => openAssignModal(student, 'trainer')}
                              className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                              title="Change trainer"
                            >
                              ✏️
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => openAssignModal(student, 'trainer')}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            + Assign Trainer
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(student)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDelete(student._id || student.studentId)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Student Details Modal */}
      {showDetailsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">Student Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedStudent?.userId?.name || selectedStudent?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedStudent?.userId?.email || selectedStudent?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedStudent?.userId?.phone || selectedStudent?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedStudent?.status === 'approved' 
                        ? 'bg-green-100 text-green-800'
                        : selectedStudent?.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedStudent?.status || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Progress</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Theoretical Passed</p>
                    <p className="font-medium">{selectedStudent.progress?.theoPassed ? '✓ Yes' : '✗ No'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ready for Theo Exam</p>
                    <p className="font-medium">{selectedStudent.progress?.readyForTheoExam ? '✓ Yes' : '✗ No'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lectures Attended</p>
                    <p className="font-medium">{selectedStudent.progress?.theoLecturesAttended || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Attendance Rate</p>
                    <p className="font-medium">{selectedStudent.progress?.theoAttendanceRate?.toFixed(1) || 0}%</p>
                  </div>
                </div>
              </div>

              {/* Payments */}
              {selectedStudent.payments && selectedStudent.payments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Payments</h3>
                  <div className="space-y-2">
                    {selectedStudent?.payments?.map((payment: any) => (
                      <div key={payment.paymentId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">${payment.amount}</p>
                          <p className="text-xs text-gray-500">{payment.paymentType}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            payment.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(payment.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Assign {assignType === 'teacher' ? 'Teacher' : 'Trainer'}
              </h2>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Select a {assignType} to assign to {selectedStudent.name}
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {(assignType === 'teacher' ? teachers : trainers).map((person) => (
                  <button
                    key={assignType === 'teacher' ? person.teacherId : person.trainerId}
                    onClick={() => handleAssign(
                      selectedStudent.studentId,
                      assignType === 'teacher' ? person.teacherId : person.trainerId
                    )}
                    className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <p className="font-medium">{person.name}</p>
                    <p className="text-sm text-gray-500">{person.email}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAssignModal(false)}
                className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
