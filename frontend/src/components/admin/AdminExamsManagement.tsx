'use client';

import { useState, useEffect } from 'react';
import { 
  getAllExams, 
  createExam, 
  updateExam, 
  deleteExam,
  getExamAttempts,
  getAllExamAttempts,
  gradeExamAttempt 
} from '@/services/api/admin/exams';
import { getAllStudents } from '@/services/api/admin/students';

export default function AdminExamsManagement() {
  const [activeTab, setActiveTab] = useState<'exams' | 'attempts'>('exams');
  const [exams, setExams] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'grade'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'exams') {
        const data: any = await getAllExams();
        setExams(data?.exams || data || []);
      } else {
        const [attemptsData, studentsData]: any[] = await Promise.all([
          getAllExamAttempts(),
          getAllStudents()
        ]);
        setAttempts(attemptsData?.attempts || attemptsData || []);
        setStudents(studentsData?.students || studentsData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const data = {
        name: formData.get('name') as string,
        type: formData.get('type') as string,
        duration: parseInt(formData.get('duration') as string),
        passingScore: parseInt(formData.get('passingScore') as string),
        totalScore: parseInt(formData.get('totalScore') as string),
        description: formData.get('description') as string,
        scheduledDate: formData.get('scheduledDate') as string,
      };

      if (modalMode === 'create') {
        await createExam(data);
        alert('Exam created successfully!');
      } else {
        await updateExam(selectedItem._id, data);
        alert('Exam updated successfully!');
      }

      setShowModal(false);
      setSelectedItem(null);
      fetchData();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const handleGradeAttempt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const data = {
        score: parseInt(formData.get('score') as string),
        feedback: formData.get('feedback') as string,
        status: formData.get('status') as string,
      };

      await gradeExamAttempt(selectedItem._id, data);
      alert('Exam attempt graded successfully!');
      setShowModal(false);
      setSelectedItem(null);
      fetchData();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    
    try {
      await deleteExam(examId);
      alert('Exam deleted successfully!');
      fetchData();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedItem(null);
    setShowModal(true);
  };

  const openEditModal = (exam: any) => {
    setModalMode('edit');
    setSelectedItem(exam);
    setShowModal(true);
  };

  const openGradeModal = (attempt: any) => {
    setModalMode('grade');
    setSelectedItem(attempt);
    setShowModal(true);
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Exam Management</h1>
          <p className="text-gray-600 mt-1">Manage exams and grade student attempts</p>
        </div>

        {activeTab === 'exams' && (
          <button
            onClick={openCreateModal}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Schedule New Exam
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('exams')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'exams'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          📝 Scheduled Exams ({exams.length})
        </button>
        <button
          onClick={() => setActiveTab('attempts')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'attempts'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          📊 Exam Attempts ({attempts.length})
        </button>
      </div>

      {/* Exams Tab */}
      {activeTab === 'exams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No exams scheduled yet. Click "Schedule New Exam" to create one.
            </div>
          ) : (
            exams.map((exam) => (
              <div key={exam._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      {exam.type}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(exam)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteExam(exam._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{exam.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{exam.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{exam.duration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Score:</span>
                    <span className="font-semibold">{exam.totalScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passing Score:</span>
                    <span className="font-semibold text-green-600">{exam.passingScore}</span>
                  </div>
                  {exam.scheduledDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-semibold">
                        {new Date(exam.scheduledDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Attempts Tab */}
      {activeTab === 'attempts' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attempts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No exam attempts yet
                    </td>
                  </tr>
                ) : (
                  attempts.map((attempt) => (
                    <tr key={attempt._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {attempt.studentId?.userId?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {attempt.studentId?.userId?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{attempt.examId?.name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {attempt.examId?.type || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {attempt.score !== null ? `${attempt.score}/${attempt.examId?.totalScore}` : 'Not graded'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          attempt.status === 'passed'
                            ? 'bg-green-100 text-green-800'
                            : attempt.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {attempt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(attempt.attemptDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {attempt.status === 'pending' && (
                          <button
                            onClick={() => openGradeModal(attempt)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Grade
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Exam Modal */}
      {showModal && modalMode !== 'grade' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalMode === 'create' ? 'Schedule New Exam' : 'Edit Exam'}
              </h2>
            </div>

            <form onSubmit={handleCreateExam} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={selectedItem?.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  name="type"
                  required
                  defaultValue={selectedItem?.type}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  <option value="theoretical">Theoretical</option>
                  <option value="practical">Practical</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    required
                    min="1"
                    defaultValue={selectedItem?.duration}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Score *
                  </label>
                  <input
                    type="number"
                    name="totalScore"
                    required
                    min="1"
                    defaultValue={selectedItem?.totalScore}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passing Score *
                </label>
                <input
                  type="number"
                  name="passingScore"
                  required
                  min="1"
                  defaultValue={selectedItem?.passingScore}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  name="scheduledDate"
                  defaultValue={selectedItem?.scheduledDate ? new Date(selectedItem.scheduledDate).toISOString().split('T')[0] : ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={selectedItem?.description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {modalMode === 'create' ? 'Create Exam' : 'Update Exam'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedItem(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Attempt Modal */}
      {showModal && modalMode === 'grade' && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Grade Exam Attempt</h2>
              <p className="text-sm text-gray-600 mt-1">
                Student: {selectedItem.studentId?.userId?.name || 'Unknown'}
              </p>
              <p className="text-sm text-gray-600">
                Exam: {selectedItem.examId?.name || 'N/A'} ({selectedItem.examId?.type})
              </p>
            </div>

            <form onSubmit={handleGradeAttempt} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Score * (Max: {selectedItem.examId?.totalScore})
                </label>
                <input
                  type="number"
                  name="score"
                  required
                  min="0"
                  max={selectedItem.examId?.totalScore}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  name="status"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="passed">Passed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feedback
                </label>
                <textarea
                  name="feedback"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add feedback for the student..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Grade
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedItem(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
