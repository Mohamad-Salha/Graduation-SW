export default function Exams() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Exams</h1>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Theory Exam */}
        <div className="bg-gray-800 p-6 rounded border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">Theory Exam</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-400">Status</div>
              <div className="text-xl font-bold text-green-400">✓ Passed</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Date</div>
              <div className="text-white">December 15, 2025</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Score</div>
              <div className="text-white">95/100</div>
            </div>
          </div>
        </div>
        
        {/* Practical Exam */}
        <div className="bg-gray-800 p-6 rounded border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">Practical Exam</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-400">Status</div>
              <div className="text-xl font-bold text-yellow-400">Not Scheduled</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Requirements</div>
              <div className="text-white">Complete 20 sessions</div>
              <div className="text-white">Pay all fees</div>
            </div>
            <div className="text-sm text-gray-400">You need 5 more sessions</div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded border border-gray-700 mt-6">
        <h2 className="text-lg font-bold text-white mb-4">Exam History</h2>
        <div className="space-y-2">
          <div className="bg-gray-700 p-3 rounded flex justify-between">
            <div>
              <div className="text-white">Theory Exam - Attempt 1</div>
              <div className="text-sm text-gray-400">December 15, 2025</div>
            </div>
            <div className="text-green-400">Passed - 95/100</div>
          </div>
        </div>
      </div>
    </div>
  );
}
