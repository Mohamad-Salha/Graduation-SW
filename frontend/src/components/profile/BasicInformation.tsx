interface BasicInformationProps {
  user: any;
}

export default function BasicInformation({ user }: BasicInformationProps) {
  if (!user) return null;

  const birthday = user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not provided';
  const gender = user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not provided';
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <span className="text-2xl">👤</span>
        Basic Information
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
          <span className="text-xl mt-0.5 group-hover:scale-110 transition-transform">🎂</span>
          <div className="flex-1">
            <p className="text-gray-400 text-sm mb-1">Birthday</p>
            <p className="text-white font-medium">{birthday}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
          <span className="text-xl mt-0.5 group-hover:scale-110 transition-transform">{user.gender === 'male' ? '👨' : user.gender === 'female' ? '👩' : '⚧️'}</span>
          <div className="flex-1">
            <p className="text-gray-400 text-sm mb-1">Gender</p>
            <p className="text-white font-medium">{gender}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
          <span className="text-xl mt-0.5 group-hover:scale-110 transition-transform">📅</span>
          <div className="flex-1">
            <p className="text-gray-400 text-sm mb-1">Member Since</p>
            <p className="text-white font-medium">{memberSince}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
