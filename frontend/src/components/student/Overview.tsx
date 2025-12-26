export default function Overview() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded border border-gray-700">
          <div className="text-sm text-gray-400">Theory Status</div>
          <div className="text-2xl font-bold text-green-400">Passed</div>
        </div>
        <div className="bg-gray-800 p-4 rounded border border-gray-700">
          <div className="text-sm text-gray-400">Practical Sessions</div>
          <div className="text-2xl font-bold text-white">15/20</div>
        </div>
        <div className="bg-gray-800 p-4 rounded border border-gray-700">
          <div className="text-sm text-gray-400">Payment Status</div>
          <div className="text-2xl font-bold text-red-400">$50 Due</div>
        </div>
        <div className="bg-gray-800 p-4 rounded border border-gray-700">
          <div className="text-sm text-gray-400">Next Session</div>
          <div className="text-sm text-white">Dec 28, 10:00 AM</div>
        </div>
      </div>
      
      {/* Upcoming Sessions */}
      <div className="bg-gray-800 p-6 rounded border border-gray-700 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Upcoming Sessions</h2>
        <div className="space-y-3">
          <div className="bg-gray-700 p-4 rounded flex justify-between">
            <div>
              <div className="text-white font-semibold">Practical Session</div>
              <div className="text-sm text-gray-400">Dec 28, 10:00 AM - Trainer John</div>
            </div>
            <button className="text-blue-400">View</button>
          </div>
        </div>
      </div>
      
      {/* Progress Circle */}
      <div className="bg-gray-800 p-6 rounded border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4">Overall Progress</h2>
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 rounded-full border-8 border-blue-500 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">60%</div>
              <div className="text-xs text-gray-400">Complete</div>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <div className="text-sm text-gray-400">Theory: 100%</div>
              <div className="w-48 bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Practical: 75%</div>
              <div className="w-48 bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
