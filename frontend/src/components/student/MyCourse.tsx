export default function MyCourse() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">My Course</h1>
      
      <div className="grid grid-cols-2 gap-6">
        {/* License Details */}
        <div className="bg-gray-800 p-6 rounded border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">License Details</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-400">License Type</div>
              <div className="text-white">Category B - Standard Car</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Start Date</div>
              <div className="text-white">December 1, 2025</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Expected Completion</div>
              <div className="text-white">February 15, 2026</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Total Cost</div>
              <div className="text-white">$500</div>
            </div>
          </div>
        </div>
        
        {/* Teacher Info */}
        <div className="bg-gray-800 p-6 rounded border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">My Teacher</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full"></div>
            <div>
              <div className="text-white font-semibold">Teacher Name</div>
              <div className="text-sm text-gray-400">Theoretical Instructor</div>
              <div className="text-sm text-gray-400">📧 teacher@example.com</div>
            </div>
          </div>
        </div>
        
        {/* Trainer Info */}
        <div className="bg-gray-800 p-6 rounded border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">My Trainer</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-500 rounded-full"></div>
            <div>
              <div className="text-white font-semibold">Trainer Name</div>
              <div className="text-sm text-gray-400">Practical Instructor</div>
              <div className="text-sm text-gray-400">🚗 Vehicle: ABC123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
