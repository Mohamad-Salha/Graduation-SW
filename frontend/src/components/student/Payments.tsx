export default function Payments() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Payments</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded border border-gray-700">
          <div className="text-sm text-gray-400">Total Cost</div>
          <div className="text-2xl font-bold text-white">$500</div>
        </div>
        <div className="bg-gray-800 p-4 rounded border border-gray-700">
          <div className="text-sm text-gray-400">Paid</div>
          <div className="text-2xl font-bold text-green-400">$450</div>
        </div>
        <div className="bg-gray-800 p-4 rounded border border-gray-700">
          <div className="text-sm text-gray-400">Outstanding</div>
          <div className="text-2xl font-bold text-red-400">$50</div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4">Payment History</h2>
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3 text-left text-white">Date</th>
              <th className="p-3 text-left text-white">Description</th>
              <th className="p-3 text-left text-white">Amount</th>
              <th className="p-3 text-left text-white">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-700">
              <td className="p-3 text-gray-300">Dec 24</td>
              <td className="p-3 text-gray-300">Practical Session #15</td>
              <td className="p-3 text-gray-300">$50</td>
              <td className="p-3"><span className="text-green-400">Paid</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
