export default function Schedule() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Schedule</h1>
      
      <div className="bg-gray-800 p-6 rounded border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4">Theory Lecture Schedule</h2>
        <div className="space-y-2">
          <div className="bg-gray-700 p-3 rounded flex justify-between">
            <div>
              <div className="text-white">Monday - Traffic Rules</div>
              <div className="text-sm text-gray-400">10:00 AM - 12:00 PM</div>
            </div>
            <div className="text-gray-400">Teacher Name</div>
          </div>
          <div className="bg-gray-700 p-3 rounded flex justify-between">
            <div>
              <div className="text-white">Wednesday - Road Signs</div>
              <div className="text-sm text-gray-400">10:00 AM - 12:00 PM</div>
            </div>
            <div className="text-gray-400">Teacher Name</div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded border border-gray-700 mt-6">
        <h2 className="text-lg font-bold text-white mb-4">Practical Sessions</h2>
        <div className="space-y-2">
          <div className="bg-gray-700 p-3 rounded flex justify-between">
            <div>
              <div className="text-white">December 28, 2025</div>
              <div className="text-sm text-gray-400">10:00 AM - Trainer John</div>
            </div>
            <div className="text-green-400">Booked</div>
          </div>
        </div>
      </div>
    </div>
  );
}
