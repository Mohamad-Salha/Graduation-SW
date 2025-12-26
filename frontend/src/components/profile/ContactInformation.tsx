interface ContactInformationProps {
  user: any;
}

export default function ContactInformation({ user }: ContactInformationProps) {
  if (!user) return null;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <span className="text-2xl">📞</span>
        Contact Information
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
          <span className="text-xl mt-0.5 group-hover:scale-110 transition-transform">📱</span>
          <div className="flex-1">
            <p className="text-gray-400 text-sm mb-1">Phone</p>
            <p className="text-white font-medium">{user.phone}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
          <span className="text-xl mt-0.5 group-hover:scale-110 transition-transform">📍</span>
          <div className="flex-1">
            <p className="text-gray-400 text-sm mb-1">Address</p>
            <p className="text-white font-medium">{user.address || 'Not provided'}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
          <span className="text-xl mt-0.5 group-hover:scale-110 transition-transform">✉️</span>
          <div className="flex-1">
            <p className="text-gray-400 text-sm mb-1">Email</p>
            <p className="text-white font-medium">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
