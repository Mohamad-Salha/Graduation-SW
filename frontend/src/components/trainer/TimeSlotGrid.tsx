'use client';

import { useState, useEffect } from 'react';

interface TimeSlot {
  day: string;
  hour: number;
  selected: boolean;
  isBooked?: boolean;
  bookedBy?: string;
  sessionDate?: string;
}

interface TimeSlotGridProps {
  onScheduleChange?: (slots: TimeSlot[]) => void;
  initialSlots?: TimeSlot[];
  isLocked?: boolean;
  weekStarted?: boolean;
  key?: string | number; // Force re-render when week changes
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16]; // 9AM to 4PM (8 slots)

const formatHour = (hour: number) => {
  if (hour === 12) return '12 PM';
  if (hour > 12) return `${hour - 12} PM`;
  return `${hour} AM`;
};

export default function TimeSlotGrid({ onScheduleChange, initialSlots = [], isLocked = false, weekStarted = false }: TimeSlotGridProps) {
  // Initialize slots from props or create empty grid
  const [slots, setSlots] = useState<TimeSlot[]>(() => {
    if (initialSlots.length > 0) return initialSlots;
    
    const emptySlots: TimeSlot[] = [];
    DAYS.forEach(day => {
      HOURS.forEach(hour => {
        emptySlots.push({ day, hour, selected: false, isBooked: false });
      });
    });
    return emptySlots;
  });

  // Update slots when initialSlots prop changes (when switching weeks)
  useEffect(() => {
    if (initialSlots.length > 0) {
      setSlots(initialSlots);
    } else {
      // Create empty grid
      const emptySlots: TimeSlot[] = [];
      DAYS.forEach(day => {
        HOURS.forEach(hour => {
          emptySlots.push({ day, hour, selected: false, isBooked: false });
        });
      });
      setSlots(emptySlots);
    }
  }, [initialSlots]);

  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'select' | 'deselect'>('select');

  const toggleSlot = (day: string, hour: number) => {
    const slot = slots.find(s => s.day === day && s.hour === hour);
    
    // Can't toggle if locked, week started, or slot is booked
    if (isLocked || weekStarted || slot?.isBooked) {
      return;
    }

    const newSlots = slots.map(slot => {
      if (slot.day === day && slot.hour === hour) {
        return { ...slot, selected: !slot.selected };
      }
      return slot;
    });
    setSlots(newSlots);
    onScheduleChange?.(newSlots);
  };

  const handleMouseDown = (day: string, hour: number) => {
    setIsDragging(true);
    const slot = slots.find(s => s.day === day && s.hour === hour);
    setDragMode(slot?.selected ? 'deselect' : 'select');
    toggleSlot(day, hour);
  };

  const handleMouseEnter = (day: string, hour: number) => {
    if (!isDragging) return;
    
    const slot = slots.find(s => s.day === day && s.hour === hour);
    if ((dragMode === 'select' && !slot?.selected) || (dragMode === 'deselect' && slot?.selected)) {
      toggleSlot(day, hour);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const isSlotSelected = (day: string, hour: number) => {
    return slots.find(s => s.day === day && s.hour === hour)?.selected || false;
  };

  const selectAll = () => {
    if (isLocked || weekStarted) return;
    
    const newSlots = slots.map(slot => 
      slot.isBooked ? slot : { ...slot, selected: true }
    );
    setSlots(newSlots);
    onScheduleChange?.(newSlots);
  };

  const clearAll = () => {
    if (isLocked || weekStarted) return;
    
    const newSlots = slots.map(slot => 
      slot.isBooked ? slot : { ...slot, selected: false }
    );
    setSlots(newSlots);
    onScheduleChange?.(newSlots);
  };

  const selectDay = (day: string) => {
    if (isLocked || weekStarted) return;
    
    const newSlots = slots.map(slot => 
      slot.day === day && !slot.isBooked ? { ...slot, selected: true } : slot
    );
    setSlots(newSlots);
    onScheduleChange?.(newSlots);
  };

  const selectHour = (hour: number) => {
    if (isLocked || weekStarted) return;
    
    const newSlots = slots.map(slot => 
      slot.hour === hour && !slot.isBooked ? { ...slot, selected: true } : slot
    );
    setSlots(newSlots);
    onScheduleChange?.(newSlots);
  };

  return (
    <div className="space-y-4" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      {/* Status Banner */}
      {(isLocked || weekStarted) && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 flex items-center gap-2">
          <span className="text-2xl">🔒</span>
          <div>
            <div className="font-semibold text-amber-900">
              {weekStarted ? 'Week Already Started' : 'Schedule Locked'}
            </div>
            <div className="text-sm text-amber-700">
              {weekStarted 
                ? 'Cannot edit schedule after week has started' 
                : 'This schedule cannot be modified'}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={selectAll}
          disabled={isLocked || weekStarted}
          className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Select All
        </button>
        <button
          onClick={clearAll}
          disabled={isLocked || weekStarted}
          className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear All
        </button>
        <span className="text-sm text-muted-foreground ml-auto self-center">
          {isLocked || weekStarted ? '🔒 Viewing only' : '💡 Click or drag to select time slots'}
        </span>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid grid-cols-8 gap-1 bg-muted/30 p-2 rounded-lg">
            {/* Header Row - Time Labels */}
            <div className="text-center font-semibold text-sm p-2"></div>
            {DAYS.map(day => (
              <div key={day} className="text-center">
                <button
                  onClick={() => selectDay(day)}
                  className="font-semibold text-sm p-2 hover:bg-secondary/20 rounded w-full transition-colors"
                  title={`Select all ${day}`}
                >
                  {day.substring(0, 3)}
                </button>
              </div>
            ))}

            {/* Time Slot Rows */}
            {HOURS.map(hour => (
              <div key={hour} className="contents">
                {/* Hour Label */}
                <button
                  onClick={() => selectHour(hour)}
                  className="text-sm font-medium p-2 hover:bg-secondary/20 rounded transition-colors"
                  title={`Select all ${formatHour(hour)} slots`}
                >
                  {formatHour(hour)}
                </button>

                {/* Day Slots */}
                {DAYS.map(day => {
                  const selected = isSlotSelected(day, hour);
                  const slot = slots.find(s => s.day === day && s.hour === hour);
                  const booked = slot?.isBooked;
                  const disabled = isLocked || weekStarted || booked;
                  
                  return (
                    <div
                      key={`${day}-${hour}`}
                      onMouseDown={() => !disabled && handleMouseDown(day, hour)}
                      onMouseEnter={() => !disabled && handleMouseEnter(day, hour)}
                      className={`
                        h-12 rounded transition-all duration-150 relative
                        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer select-none'}
                        ${booked 
                          ? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-md' 
                          : selected 
                            ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-md scale-105' 
                            : 'bg-white hover:bg-gray-100 border-2 border-gray-200'
                        }
                      `}
                      title={
                        booked 
                          ? `Booked by ${slot.bookedBy || 'Student'} - Cannot modify`
                          : disabled
                            ? 'Schedule locked'
                            : `${day} ${formatHour(hour)} - ${formatHour(hour + 1)}`
                      }
                    >
                      {selected && !booked && (
                        <div className="h-full flex items-center justify-center text-white font-bold">
                          ✓
                        </div>
                      )}
                      {booked && (
                        <div className="h-full flex flex-col items-center justify-center text-white text-xs">
                          <div className="font-bold">📅</div>
                          <div className="text-[10px] mt-0.5">Booked</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="text-sm flex items-center justify-between">
          <div>
            <span className="font-semibold">Selected Slots:</span>{' '}
            <span className="text-secondary">{slots.filter(s => s.selected).length} / {slots.length}</span>
            <span className="text-muted-foreground ml-2">
              ({slots.filter(s => s.selected).length} hours per week)
            </span>
          </div>
          {slots.filter(s => s.isBooked).length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-blue-700 font-semibold">
                🔒 {slots.filter(s => s.isBooked).length} Booked
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
