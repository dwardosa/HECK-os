import React, { useState } from "react";

interface WaterCoolerProps {
  onHover?: () => void;
}

export default function WaterCooler({ onHover }: WaterCoolerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const message = "STAFF PARTY ANNOUCEMENT COMING SOON!";

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowMessage(true);
    if (onHover) onHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTimeout(() => setShowMessage(false), 200); // Small delay to allow reading
  };

  return (
    <div 
      className="fixed bottom-32 right-8 z-60 cursor-pointer select-none transition-opacity duration-500 hover:opacity-100 opacity-75"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Message Tooltip */}
      {showMessage && (
        <div 
          className={`absolute -top-16 right-0 bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg text-base whitespace-nowrap transition-all duration-300 transform ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          {message}
          {/* Arrow pointing down */}
        </div>
      )}

      {/* Water Cooler Icon */}
      <div 
        className={`transition-all duration-300 transform ${
          isHovered ? 'scale-110 rotate-3' : 'scale-100'
        }`}
      >
        {/* Water Cooler GIF */}
        <img 
          src="/img/ui/water-cooler.gif" 
          alt="Water Cooler" 
          className="w-32 h-40 object-contain"
          draggable={false}
        />
      </div>

      {/* Invisible click area for better UX */}
      <div className="absolute -inset-4"></div>
    </div>
  );
}
