export default function Sessions() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Book Sessions</h1>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Available Slots */}
        <div className="col-span-2 bg-gray-800 p-6 rounded border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">Available Slots</h2>
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-3 text-left text-white">Date</th>
                <th className="p-3 text-left text-white">Time</th>
                <th className="p-3 text-left text-white">Trainer</th>
                <th className="p-3 text-left text-white">Vehicle</th>
                <th className="p-3 text-left text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700">
                <td className="p-3 text-gray-300">Dec 28</td>
                <td className="p-3 text-gray-300">10:00 AM</td>
                <td className="p-3 text-gray-300">John Doe</td>
                <td className="p-3 text-gray-300">ABC123</td>
                <td className="p-3"><button className="bg-blue-600 text-white px-3 py-1 rounded">Book</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Booking Form */}
        <div className="bg-gray-800 p-6 rounded border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">Quick Book</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-400">Select Trainer</label>
              <select className="w-full bg-gray-700 text-white p-2 rounded">
                <option>Select...</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400">Select Date</label>
              <input type="date" className="w-full bg-gray-700 text-white p-2 rounded" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Select Time</label>
              <select className="w-full bg-gray-700 text-white p-2 rounded">
                <option>Select...</option>
              </select>
            </div>
            <button className="w-full bg-blue-600 text-white p-2 rounded">Book Session</button>
          </div>
        </div>
      </div>
      
      {/* My Bookings */}
      <div className="bg-gray-800 p-6 rounded border border-gray-700 mt-6">
        <h2 className="text-lg font-bold text-white mb-4">My Bookings</h2>
        <div className="space-y-2">
          <div className="bg-gray-700 p-3 rounded flex justify-between">
            <div>
              <div className="text-white">Dec 28, 10:00 AM - Trainer John</div>
              <div className="text-sm text-gray-400">Vehicle: ABC123</div>
            </div>
            <div className="text-green-400">Confirmed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
