'use client';

import { useState, useEffect } from 'react';
import { getTrainerSchedule, createWeeklySchedule, getTrainerVehicles } from '@/services/api/trainer/schedule';
import TimeSlotGrid from './TimeSlotGrid';

interface TimeSlot {
  day: string;
  hour: number;
  selected: boolean;
  isBooked?: boolean;
  bookedBy?: string;
  sessionDate?: string;
}

interface WeekSchedule {
  weekNumber: number;
  weekStartDate: Date;
  weekEndDate: Date;
  slots: TimeSlot[];
  hasStarted?: boolean;
  hasBookings?: boolean;
}

interface Vehicle {
  id: string;
  model: string;
  licensePlate: string;
  type: string;
  isAvailable: boolean;
}

export default function MySchedule() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehicleId, setVehicleId] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [saving, setSaving] = useState(false);
  
  // Month navigation
  const [currentMonthStart, setCurrentMonthStart] = useState(() => {
    // Start from today, not a random date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [selectedWeek, setSelectedWeek] = useState(0); // 0-3 for 4 weeks
  
  // Store slots for all 4 weeks
  const [weekSchedules, setWeekSchedules] = useState<WeekSchedule[]>([]);

  useEffect(() => {
    // Initialize 4 weeks based on current month
    initializeWeeks(currentMonthStart);
  }, [currentMonthStart]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await getTrainerSchedule();
        setSchedules(data.schedules || []);
        
        // Load existing schedules into the week grids
        if (data.schedules && data.schedules.length > 0) {
          loadSchedulesIntoWeeks(data.schedules);
        }
      } catch (error) {
        console.error('Failed to fetch schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchVehicles = async () => {
      try {
        const data = await getTrainerVehicles();
        // Filter for available vehicles only
        const availableVehicles = (data.vehicles || []).filter((v: Vehicle) => v.isAvailable);
        setVehicles(availableVehicles);
        // Auto-select first available vehicle
        if (availableVehicles.length > 0) {
          setVehicleId(availableVehicles[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
      }
    };

    fetchSchedule();
    fetchVehicles();
  }, []);

  const initializeWeeks = (monthStart: Date) => {
    const weeks: WeekSchedule[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
    
    // Calculate 4 weeks from today (current month window)
    const oneMonthFromToday = new Date(today);
    oneMonthFromToday.setDate(today.getDate() + 28); // 4 weeks
    
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(monthStart);
      weekStart.setDate(monthStart.getDate() + (i * 7));
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const hasStarted = today >= weekStart;
      const isInEditableRange = weekStart <= oneMonthFromToday && weekStart >= today;

      weeks.push({
        weekNumber: i + 1,
        weekStartDate: weekStart,
        weekEndDate: weekEnd,
        slots: [], // Each week starts with empty slots
        hasStarted,
        hasBookings: false,
      });
    }
    setWeekSchedules(weeks);
  };

  const loadSchedulesIntoWeeks = (fetchedSchedules: any[]) => {
    // Map fetched schedules to week slots
    setWeekSchedules(prevWeeks => {
      const updatedWeeks = [...prevWeeks];
      
      fetchedSchedules.forEach((schedule: any) => {
        const scheduleStart = new Date(schedule.weekStartDate);
        scheduleStart.setHours(0, 0, 0, 0);
        
        // Find which week this schedule belongs to
        const weekIndex = updatedWeeks.findIndex(week => {
          const weekStart = new Date(week.weekStartDate);
          weekStart.setHours(0, 0, 0, 0);
          return weekStart.getTime() === scheduleStart.getTime();
        });
        
        if (weekIndex !== -1) {
          // Convert schedule slots to TimeSlot format
          const timeSlots: TimeSlot[] = schedule.slots.map((slot: any) => {
            const hour = parseInt(slot.startTime.split(':')[0]);
            return {
              day: slot.day,
              hour: hour,
              selected: true,
              isBooked: slot.isBooked,
              bookedBy: slot.bookedBy?.name,
              sessionDate: slot.sessionDate,
            };
          });
          
          updatedWeeks[weekIndex].slots = timeSlots;
          updatedWeeks[weekIndex].hasBookings = schedule.slots.some((s: any) => s.isBooked);
        }
      });
      
      return updatedWeeks;
    });
  };

  const handleScheduleChange = (slots: TimeSlot[]) => {
    const updatedWeeks = [...weekSchedules];
    updatedWeeks[selectedWeek].slots = slots;
    setWeekSchedules(updatedWeeks);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const newMonth = new Date(currentMonthStart);
    newMonth.setDate(newMonth.getDate() + (direction === 'next' ? 28 : -28));
    
    // Don't allow navigating to past months (before today)
    if (direction === 'prev' && newMonth < today) {
      // Instead, navigate to today
      setCurrentMonthStart(new Date(today));
    } else {
      setCurrentMonthStart(newMonth);
    }
    setSelectedWeek(0);
  };

  const formatDateRange = (start?: Date, end?: Date) => {
    if (!start || !end) return '';
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

  const getMonthLabel = () => {
    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    return currentMonthStart.toLocaleDateString('en-US', options);
  };

  const handleCreateSchedule = async () => {
    const currentWeek = weekSchedules[selectedWeek];
    
    if (!currentWeek) return;

    // Check if week has started
    if (currentWeek.hasStarted) {
      alert('Cannot create schedule for a week that has already started');
      return;
    }
    
    if (currentWeek.slots.filter(s => s.selected && !s.isBooked).length === 0) {
      alert('Please select at least one time slot');
      return;
    }

    if (!vehicleId) {
      alert('Please select a vehicle');
      return;
    }

    setSaving(true);
    try {
      const scheduleData = {
        slots: currentWeek.slots.filter(s => s.selected && !s.isBooked).map(slot => ({
          day: slot.day,
          startTime: `${slot.hour}:00`,
          endTime: `${slot.hour + 1}:00`,
        })),
        weekStartDate: currentWeek.weekStartDate.toISOString(),
        weekEndDate: currentWeek.weekEndDate.toISOString(),
        vehicleId,
      };

      console.log('Sending schedule data:', scheduleData);
      const response = await createWeeklySchedule(scheduleData);
      console.log('Response:', response);
      
      // Refresh schedules
      const data = await getTrainerSchedule();
      setSchedules(data.schedules || []);
      
      alert(`Schedule created for Week ${currentWeek.weekNumber}!`);
    } catch (error: any) {
      console.error('Failed to create schedule:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert(`Failed to create schedule: ${error.response?.data?.error || error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const saveAllWeeks = async () => {
    if (!vehicleId) {
      alert('Please select a vehicle');
      return;
    }

    setSaving(true);
    try {
      let savedCount = 0;
      let skippedCount = 0;

      for (const week of weekSchedules) {
        // Skip weeks that have already started
        if (week.hasStarted) {
          skippedCount++;
          continue;
        }

        if (week.slots.filter(s => s.selected && !s.isBooked).length > 0) {
          const scheduleData = {
            slots: week.slots.filter(s => s.selected && !s.isBooked).map(slot => ({
              day: slot.day,
              startTime: `${slot.hour}:00`,
              endTime: `${slot.hour + 1}:00`,
            })),
            weekStartDate: week.weekStartDate.toISOString(),
            weekEndDate: week.weekEndDate.toISOString(),
            vehicleId,
          };

          await createWeeklySchedule(scheduleData);
          savedCount++;
        }
      }
      
      // Refresh schedules
      const data = await getTrainerSchedule();
      setSchedules(data.schedules || []);
      
      alert(`${savedCount} week(s) saved successfully!${skippedCount > 0 ? ` (${skippedCount} week(s) skipped - already started)` : ''}`);
    } catch (error) {
      console.error('Failed to save schedules:', error);
      alert('Failed to save schedules. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">My Schedule</h1>
      
      {/* Month Navigation */}
      {weekSchedules.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6 shadow-md">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateMonth('prev')}
              className="px-4 py-2 bg-white hover:bg-blue-50 rounded-lg font-semibold transition-colors shadow-sm"
            >
              ← Previous Month
            </button>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{getMonthLabel()}</div>
              <div className="text-sm text-muted-foreground">
                {formatDateRange(weekSchedules[0]?.weekStartDate, weekSchedules[3]?.weekEndDate)}
              </div>
              {(() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const oneMonthFromToday = new Date(today);
                oneMonthFromToday.setDate(today.getDate() + 28);
                const isCurrentMonth = weekSchedules[0]?.weekStartDate <= oneMonthFromToday;
                
                return !isCurrentMonth && (
                  <div className="text-xs text-amber-600 font-semibold mt-1">
                    📖 View Only - Can only edit current month
                  </div>
                );
              })()}
            </div>
            
            <button
              onClick={() => navigateMonth('next')}
              className="px-4 py-2 bg-white hover:bg-blue-50 rounded-lg font-semibold transition-colors shadow-sm"
            >
              Next Month →
            </button>
          </div>
        </div>
      )}

      {/* Create Schedule Section */}
      <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Create Weekly Availability</h2>
          <div className="flex gap-2">
            <button
              onClick={saveAllWeeks}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              💾 Save All 4 Weeks
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Vehicle Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Vehicle</label>
            <select 
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full border border-border rounded-lg p-2"
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.licensePlate} - {vehicle.model} ({vehicle.type})
                </option>
              ))}
            </select>
            {vehicles.length === 0 && (
              <p className="text-sm text-amber-600 mt-1">No available vehicles assigned yet. Please contact admin.</p>
            )}
          </div>

          {/* Week Tabs */}
          <div>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {weekSchedules.map((week, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedWeek(index)}
                  className={`flex-shrink-0 px-6 py-3 rounded-lg font-semibold transition-all relative ${
                    selectedWeek === index
                      ? 'bg-secondary text-secondary-foreground shadow-lg scale-105'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  } ${week.hasStarted ? 'opacity-75' : ''}`}
                >
                  {week.hasStarted && (
                    <div className="absolute top-1 right-1 text-xs">🔒</div>
                  )}
                  <div className="text-sm">Week {week.weekNumber}</div>
                  <div className="text-xs mt-1 opacity-80">
                    {week.weekStartDate && week.weekEndDate && formatDateRange(week.weekStartDate, week.weekEndDate)}
                  </div>
                  {week.hasStarted && (
                    <div className="text-xs mt-1 bg-amber-500 text-white px-2 py-0.5 rounded-full inline-block">
                      Started
                    </div>
                  )}
                  {!week.hasStarted && week.slots && week.slots.filter(s => s.selected).length > 0 && (
                    <div className="text-xs mt-1 bg-green-500 text-white px-2 py-0.5 rounded-full inline-block">
                      {week.slots.filter(s => s.selected).length} slots
                    </div>
                  )}
                  {week.slots && week.slots.filter(s => s.isBooked).length > 0 && (
                    <div className="text-xs mt-1 bg-blue-500 text-white px-2 py-0.5 rounded-full inline-block">
                      {week.slots.filter(s => s.isBooked).length} booked
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Time Slot Grid for Selected Week */}
          <div>
            {weekSchedules[selectedWeek] && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">
                    Select Available Time Slots for Week {weekSchedules[selectedWeek].weekNumber}
                    {weekSchedules[selectedWeek].hasStarted && (
                      <span className="ml-2 text-sm text-amber-600">(Week started - View only)</span>
                    )}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {formatDateRange(
                      weekSchedules[selectedWeek].weekStartDate,
                      weekSchedules[selectedWeek].weekEndDate
                    )}
                  </span>
                </div>
                <TimeSlotGrid 
                  key={`week-${selectedWeek}-${weekSchedules[selectedWeek]?.weekStartDate?.getTime()}`}
                  onScheduleChange={handleScheduleChange}
                  initialSlots={weekSchedules[selectedWeek].slots}
                  weekStarted={weekSchedules[selectedWeek].hasStarted}
                />
              </>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={handleCreateSchedule}
              disabled={saving || weekSchedules[selectedWeek]?.hasStarted}
              className="flex-1 bg-secondary text-secondary-foreground py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : weekSchedules[selectedWeek]?.hasStarted ? '🔒 Week Started' : `Save Week ${weekSchedules[selectedWeek]?.weekNumber} Only`}
            </button>
            <button
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              title="Coming soon"
            >
              🤖 AI Suggest
            </button>
          </div>
        </div>
      </div>
      
      {/* Current Schedules Section */}
      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Current Schedules</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
          </div>
        ) : schedules.length > 0 ? (
          <div className="space-y-4">
            {schedules.map((schedule: any, scheduleIndex: number) => (
              <div key={scheduleIndex} className="bg-white p-4 rounded-lg border border-border">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="font-semibold text-lg">
                      {new Date(schedule.weekStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(schedule.weekEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    {schedule.vehicle && (
                      <div className="text-sm text-muted-foreground">
                        Vehicle: {schedule.vehicle.licensePlate} - {schedule.vehicle.model}
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                    {schedule.slots.length} slot{schedule.slots.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
                  {schedule.slots.map((slot: any, slotIndex: number) => (
                    <div 
                      key={slotIndex} 
                      className={`p-2 rounded text-sm ${
                        slot.isBooked 
                          ? 'bg-blue-50 border border-blue-200 text-blue-700' 
                          : 'bg-gray-50 border border-gray-200 text-gray-700'
                      }`}
                    >
                      <div className="font-medium">{slot.day}</div>
                      <div className="text-xs">{slot.startTime} - {slot.endTime}</div>
                      {slot.isBooked && slot.bookedBy && (
                        <div className="text-xs mt-1">👤 {slot.bookedBy.name}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">📅</div>
            <p>No schedules created yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
