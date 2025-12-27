'use client';

import { useState, useEffect } from 'react';
import { getAllTeachers, getAllTrainers, createTeacher, createTrainer } from '@/services/api/admin/staff';

export default function AdminStaffManagement() {
  const [activeTab, setActiveTab] = useState<'teachers' | 'trainers'>('teachers');
  const [teachers, setTeachers] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'teachers') {
        const data: any = await getAllTeachers();
        setTeachers(data?.teachers || data || []);
      } else {
        const data: any = await getAllTrainers();
        setTrainers(data?.trainers || data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (staff: any) => {
    setSelectedStaff(staff);
    setShowDetailsModal(true);
  };

  const handleDelete = async (staffId: string) => {
    if (!confirm(`Are you sure you want to delete this ${activeTab === 'teachers' ? 'teacher' : 'trainer'}?`)) return;
    
    try {
      // TODO: Add delete API call
      alert('Delete functionality will be implemented');
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        phone: formData.get('phone') as string
      };

      if (activeTab === 'teachers') {
        await createTeacher(data);
      } else {
        await createTrainer(data);
      }

      alert(`${activeTab === 'teachers' ? 'Teacher' : 'Trainer'} created successfully!`);
      setShowModal(false);
      fetchData();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const staffList = activeTab === 'teachers' ? teachers : trainers;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage teachers and trainers</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add {activeTab === 'teachers' ? 'Teacher' : 'Trainer'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'teachers'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          👨‍🏫 Teachers ({teachers.length})
        </button>
        <button
          onClick={() => setActiveTab('trainers')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'trainers'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          🚗 Trainers ({trainers.length})
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((staff) => (
          <div key={staff._id || staff.teacherId || staff.trainerId} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl text-blue-600 font-semibold">
                  {(staff.userId?.name || staff.name || '?').charAt(0)}
                </span>
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {staff.userId?.name || staff.name || 'N/A'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {staff.userId?.email || staff.email || 'N/A'}
            </p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{staff.userId?.phone || staff.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Students:</span>
                <span className="font-medium">{staff.assignedStudentsCount || 0}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
              <button 
                onClick={() => handleViewDetails(staff)}
                className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
              >
                View Details
              </button>
              <button 
                onClick={() => handleDelete(staff._id || staff.teacherId || staff.trainerId)}
                className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {staffList.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No {activeTab} found. Add your first {activeTab === 'teachers' ? 'teacher' : 'trainer'}!
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Add {activeTab === 'teachers' ? 'Teacher' : 'Trainer'}
              </h2>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeTab === 'teachers' ? 'Teacher' : 'Trainer'} Details
              </h2>
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
                    <p className="font-medium">{selectedStaff.userId?.name || selectedStaff.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedStaff.userId?.email || selectedStaff.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedStaff.userId?.phone || selectedStaff.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="font-medium capitalize">{activeTab === 'teachers' ? 'Teacher' : 'Trainer'}</p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Assigned Students</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedStaff.assignedStudentsCount || 0}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Completed Sessions</p>
                    <p className="text-2xl font-bold text-green-600">{selectedStaff.completedSessionsCount || 0}</p>
                  </div>
                </div>
              </div>

              {/* Assigned Students */}
              {selectedStaff.assignedStudents && selectedStaff.assignedStudents.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Assigned Students</h3>
                  <div className="space-y-2">
                    {selectedStaff.assignedStudents.map((student: any) => (
                      <div key={student._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{student.userId?.name || student.name || 'N/A'}</p>
                          <p className="text-sm text-gray-600">{student.userId?.email || student.email || 'N/A'}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          student.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {student.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Account Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Joined Date</p>
                    <p className="font-medium">
                      {selectedStaff.createdAt 
                        ? new Date(selectedStaff.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
