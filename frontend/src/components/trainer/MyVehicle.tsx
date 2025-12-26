'use client';

import { useState, useEffect } from 'react';
import { getVehicleInfo } from '@/services/api/trainer/vehicle';

export default function MyVehicle() {
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const data = await getVehicleInfo();
        setVehicle(data.vehicle || null);
      } catch (error) {
        console.error('Failed to fetch vehicle:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🚗</div>
        <p className="text-muted-foreground">No vehicle assigned yet</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">My Vehicle</h1>
      
      <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-xl p-6 shadow-lg max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center text-4xl">
            🚙
          </div>
          <div>
            <h2 className="text-2xl font-bold">{vehicle.plateNumber}</h2>
            <p className="text-muted-foreground">{vehicle.model} {vehicle.year}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-border">
            <div className="text-sm text-muted-foreground mb-1">Type</div>
            <div className="font-semibold">{vehicle.type || 'N/A'}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-border">
            <div className="text-sm text-muted-foreground mb-1">Transmission</div>
            <div className="font-semibold">{vehicle.transmission || 'N/A'}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-border">
            <div className="text-sm text-muted-foreground mb-1">License Type</div>
            <div className="font-semibold">{vehicle.licenseType?.name || 'N/A'}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-border">
            <div className="text-sm text-muted-foreground mb-1">Status</div>
            <div className={`font-semibold ${vehicle.status === 'active' ? 'text-success' : 'text-error'}`}>
              {vehicle.status === 'active' ? '✓ Active' : '✗ Inactive'}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground mb-2">Vehicle Details</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Color:</span>
              <span className="font-medium">{vehicle.color || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Year:</span>
              <span className="font-medium">{vehicle.year || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Capacity:</span>
              <span className="font-medium">{vehicle.capacity || 'N/A'} Seats</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
