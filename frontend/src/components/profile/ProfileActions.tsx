interface ProfileActionsProps {
  onEdit: () => void;
}

export default function ProfileActions({ onEdit }: ProfileActionsProps) {
  const handleChangePassword = () => {
    // TODO: Implement change password
    console.log('Change password');
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <span className="text-2xl">⚙️</span>
        Actions
      </h2>
      
      <div className="space-y-3">
        <button 
          onClick={handleChangePassword}
          className="w-full px-6 py-3.5 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all duration-300 text-left font-medium shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3 group"
        >
          <span className="text-xl group-hover:rotate-12 transition-transform">🔐</span>
          <span>Change Password</span>
        </button>
        
        <button className="w-full px-6 py-3.5 bg-gradient-to-r from-red-600/20 to-red-700/20 text-red-400 rounded-lg hover:from-red-600/30 hover:to-red-700/30 transition-all duration-300 text-left font-medium border border-red-600/30 hover:border-red-500/50 flex items-center gap-3 group">
          <span className="text-xl group-hover:scale-110 transition-transform">🗑️</span>
          <span>Delete Account</span>
        </button>
      </div>
    </div>
  );
}
