import React, { useState, useEffect } from "react";

interface TreeFallProps {
  onHardDriveClick?: () => void;
}

export default function TreeFall({ onHardDriveClick }: TreeFallProps) {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [showHardDrive, setShowHardDrive] = useState(false);
  const [treesHaveFallen, setTreesHaveFallen] = useState(false);

  useEffect(() => {
    // Start animation after 3 seconds
    const timer = setTimeout(() => {
      setAnimationStarted(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (animationStarted) {
      // Show hard drive immediately when animation starts (it's behind the tree)
      setShowHardDrive(true);
      // Trees finish falling after 3s animation
      const treeFallTimer = setTimeout(() => {
        setTreesHaveFallen(true);
      }, 500);

      return () => clearTimeout(treeFallTimer);
    }
  }, [animationStarted]);

  const handleHardDriveClick = () => {
    // Open tree-fall-drive URL
    window.open('https://s.disco.ac/xhxzgtiwgsuy', '_blank');
    if (onHardDriveClick) onHardDriveClick();
  };

  return (
    <div className="absolute inset-0 pointer-events-none  z-70">
      {/* Hard Drive - Behind the tree */}
      {showHardDrive && (
        <div 
          className={`absolute right-32 top-1/2 transform -translate-y-1/2 transition-all duration-1000 cursor-pointer pointer-events-auto ${
            treesHaveFallen ? 'opacity-100 scale-100' : 'opacity-100 scale-100'
          }`}
          onClick={handleHardDriveClick}
        >
          {/* Hard Drive Icon/Image */}
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-xl scale-150"></div>
            
            {/* Hard Drive */}
            <div className="relative w-24 h-16 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg shadow-2xl border border-gray-600 group-hover:scale-110 transition-transform duration-300">
              {/* Drive Label */}
              <div className="absolute top-1 left-1 right-1 h-2 bg-gray-600 rounded-sm"></div>
              
              {/* LED Indicator */}
              <div className="absolute top-1 right-2 w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
              
              {/* Ports */}
              <div className="absolute bottom-1 left-2 w-3 h-1 bg-gray-800 rounded-sm"></div>
              <div className="absolute bottom-1 left-6 w-2 h-1 bg-gray-800 rounded-sm"></div>
              
              {/* Text Label */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-xs font-semibold bg-black bg-opacity-70 px-2 py-1 rounded whitespace-nowrap">
                Lost HDD
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animated Tree Layer (Green parts only) */}
      <div className="absolute inset-0">
        {/* Single Tree - Right side (Green parts only) */}
        <div 
          className={`absolute right-12 top-0 w-80 h-full bg-cover bg-no-repeat transform-gpu transition-all duration-3000 ease-in ${
            animationStarted ? '-rotate-90 -translate-x-64 translate-y-72' : 'rotate-0'
          }`}
          style={{
            backgroundImage: `url(/img/ui/wallpaper.jpg)`,
            backgroundPosition: '85% 40%',
            clipPath: treesHaveFallen ? 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            filter: 'hue-rotate(0deg) saturate(2) contrast(1.2)',
            // Mask to only show green areas (trees/foliage)
            WebkitMask: `
              radial-gradient(circle at 20% 30%, black 40%, transparent 50%),
              radial-gradient(circle at 40% 20%, black 35%, transparent 45%),
              radial-gradient(circle at 60% 40%, black 30%, transparent 40%),
              radial-gradient(circle at 80% 25%, black 25%, transparent 35%),
              radial-gradient(circle at 30% 60%, black 20%, transparent 30%),
              radial-gradient(circle at 70% 70%, black 15%, transparent 25%)
            `,
            mask: `
              radial-gradient(circle at 20% 30%, black 40%, transparent 50%),
              radial-gradient(circle at 40% 20%, black 35%, transparent 45%),
              radial-gradient(circle at 60% 40%, black 30%, transparent 40%),
              radial-gradient(circle at 80% 25%, black 25%, transparent 35%),
              radial-gradient(circle at 30% 60%, black 20%, transparent 30%),
              radial-gradient(circle at 70% 70%, black 15%, transparent 25%)
            `,
            WebkitMaskComposite: 'add',
            maskComposite: 'add'
          }}
        />
      </div>

      {/* Particle Effects */}
      {animationStarted && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Falling Leaves - focused on right side */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-green-600 rounded-full animate-bounce opacity-60"
              style={{
                left: `${70 + Math.random() * 25}%`, // Focus on right side (70-95%)
                top: `${Math.random() * 40}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
          
          {/* Dust particles - near the falling area */}
          {[...Array(4)].map((_, i) => (
            <div
              key={`dust-${i}`}
              className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-pulse opacity-40"
              style={{
                left: `${60 + Math.random() * 30}%`, // Focus on right side area
                top: `${60 + Math.random() * 30}%`,
                animationDelay: `${1 + Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
