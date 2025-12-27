'use client';

interface DynamicBackgroundProps {
  activeColor: string;
  backgroundImage?: string;
}

export default function DynamicBackground({ activeColor, backgroundImage }: DynamicBackgroundProps) {
  return (
    <>
      {/* Background Image Layer */}
      {backgroundImage ? (
        <div
          key={backgroundImage}
          className="fixed inset-0 -z-10 transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px) brightness(0.5)',
          }}
        />
      ) : (
        // Default dark background when no image
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      )}

      {/* Subtle dark overlay for better text readability */}
      <div className="fixed inset-0 -z-5 bg-black/20" />
    </>
  );
}
