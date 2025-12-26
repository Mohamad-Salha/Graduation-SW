'use client';

import { useRouter } from 'next/navigation';

export default function StudentHeader() {
  const router = useRouter();

  return (
    <header className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white p-3 border-b border-purple-800/50 sticky top-0 z-50 shadow-xl">
      <div className="flex items-center justify-between">
        {/* Logo and Title with Background */}
        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm p-2 rounded-lg border border-white/10">
          <div className="text-xl animate-pulse bg-white/20 backdrop-blur-sm p-2 rounded-lg">🚗</div>
          <div>
            <div className="font-bold text-white">Driving School</div>
            <div className="text-xs text-blue-100">Student Portal</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Notification and Settings Icons */}
          <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-200 backdrop-blur-sm border border-white/10">🔔</button>
          <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-200 backdrop-blur-sm border border-white/10">⚙️</button>
          
          {/* Profile Section with Different Background - Clickable */}
          <button 
            onClick={() => router.push('/profile')}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg hover:bg-white/15 transition-all duration-200 border border-white/20"
          >
            <div className="w-7 h-7 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50">
              <span className="text-sm">👤</span>
            </div>
            <span className="font-medium text-white text-sm">Student Name</span>
          </button>
          
          <button className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 shadow-lg text-sm">Logout</button>
        </div>
      </div>
    </header>
  );
}
