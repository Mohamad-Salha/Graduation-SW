export default function Progress() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Progress Tracking</h1>
      
      <div className="bg-gray-800 p-6 rounded border border-gray-700 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Progress Breakdown</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-300">Theory Lectures</span>
              <span className="text-white">100%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full" style={{width: '100%'}}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-300">Practical Sessions</span>
              <span className="text-white">15/20 (75%)</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div className="bg-blue-500 h-3 rounded-full" style={{width: '75%'}}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-300">Payments</span>
              <span className="text-white">$450/$500 (90%)</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div className="bg-yellow-500 h-3 rounded-full" style={{width: '90%'}}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4">Session History</h2>
        <div className="space-y-2">
          <div className="bg-gray-700 p-3 rounded flex justify-between">
            <div>
              <div className="text-white">Session #15</div>
              <div className="text-sm text-gray-400">Dec 24, 2025 - Trainer John</div>
            </div>
            <div className="text-green-400">✓ Attended</div>
          </div>
        </div>
      </div>
    </div>
  );
}
