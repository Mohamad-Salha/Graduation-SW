'use client';

import { useState, useEffect } from 'react';
import {
  getAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  assignVehicleToTrainer,
  addMaintenanceRecord
} from '@/services/api/admin/vehicles';
import { getAllLicenses, createLicense, updateLicense, deleteLicense } from '@/services/api/admin/licenses';
import { getAllTrainers } from '@/services/api/admin/staff';

export default function AdminVehiclesLicenses() {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'licenses'>('vehicles');
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'maintenance'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'vehicles') {
        const [vehiclesData, trainersData] = await Promise.all([
          getAllVehicles(),
          getAllTrainers()
        ]);
        setVehicles(vehiclesData.vehicles || []);
        setTrainers(trainersData.trainers || []);
      } else {
        const data = await getAllLicenses();
        setLicenses(data.licenses || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await createVehicle({
        model: formData.get('model') as string,
        licensePlate: formData.get('licensePlate') as string,
        type: formData.get('type') as string,
        year: parseInt(formData.get('year') as string),
        color: formData.get('color') as string,
        fuelType: formData.get('fuelType') as string
      });
      alert('Vehicle created successfully!');
      setShowModal(false);
      fetchData();
    } catch (error: any) {
      alert('Error creating vehicle: ' + error.message);
    }
  };

  const handleCreateLicense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await createLicense({
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        minPracticalSessions: parseInt(formData.get('minPracticalSessions') as string)
      });
      alert('License created successfully!');
      setShowModal(false);
      fetchData();
    } catch (error: any) {
      alert('Error creating license: ' + error.message);
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Vehicles & Licenses</h1>
          <p className="text-gray-600 mt-1">Manage vehicles and license types</p>
        </div>

        <button
          onClick={() => {
            setModalType('create');
            setSelectedItem(null);
            setShowModal(true);
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add {activeTab === 'vehicles' ? 'Vehicle' : 'License'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('vehicles')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'vehicles'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          🚗 Vehicles ({vehicles.length})
        </button>
        <button
          onClick={() => setActiveTab('licenses')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'licenses'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          📄 Licenses ({licenses.length})
        </button>
      </div>

      {/* Vehicles Tab */}
      {activeTab === 'vehicles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.vehicleId} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">🚗</div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  vehicle.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {vehicle.isAvailable ? 'Available' : 'In Use'}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{vehicle.model}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plate:</span>
                  <span className="font-medium">{vehicle.licensePlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{vehicle.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trainer:</span>
                  <span className="font-medium">{vehicle.assignedTrainer || 'Unassigned'}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                <button className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                  Edit
                </button>
                <button className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                  Delete
                </button>
              </div>
            </div>
          ))}

          {vehicles.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No vehicles found. Add your first vehicle!
            </div>
          )}
        </div>
      )}

      {/* Licenses Tab */}
      {activeTab === 'licenses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {licenses.map((license) => (
            <div key={license._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">📄</div>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  ${license.price}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{license.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{license.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Sessions:</span>
                  <span className="font-medium">{license.minPracticalSessions || 0}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                <button className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                  Edit
                </button>
                <button className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                  Delete
                </button>
              </div>
            </div>
          ))}

          {licenses.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No licenses found. Add your first license type!
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {modalType === 'create' ? 'Add' : 'Edit'} {activeTab === 'vehicles' ? 'Vehicle' : 'License'}
              </h2>
            </div>

            <form onSubmit={activeTab === 'vehicles' ? handleCreateVehicle : handleCreateLicense} className="p-6 space-y-4">
              {activeTab === 'vehicles' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                    <input
                      type="text"
                      name="model"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Toyota Corolla 2023"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">License Plate *</label>
                    <input
                      type="text"
                      name="licensePlate"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="ABC-1234"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      name="type"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="truck">Truck</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                      <input
                        type="number"
                        name="year"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="2023"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                      <input
                        type="text"
                        name="color"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="White"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                    <select
                      name="fuelType"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="gasoline">Gasoline</option>
                      <option value="diesel">Diesel</option>
                      <option value="electric">Electric</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Class B License"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Description of the license..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                      <input
                        type="number"
                        name="price"
                        required
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Min Sessions</label>
                      <input
                        type="number"
                        name="minPracticalSessions"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="10"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {modalType === 'create' ? 'Create' : 'Update'}
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
    </div>
  );
}
