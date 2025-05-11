"use client";

import { useState, useEffect } from 'react';

interface RubberDuckProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  onClick?: () => void;
}

const RubberDuck = ({ size = 'md', animated = false, onClick }: RubberDuckProps) => {
  const [isFloating, setIsFloating] = useState(animated);

  useEffect(() => {
    setIsFloating(animated);
  }, [animated]);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-80 h-80',
  };

  return (
    <div 
      className={`relative ${onClick ? 'cursor-pointer' : ''} ${sizeClasses[size]}`} 
      style={{
        zIndex: 20,  // Ensure the duck is above the water
        position: 'absolute',
        bottom: '-290px',  // Adjust to desired height
      }}
      onClick={onClick}
    >
      <img 
        src="/rubber-ducky.gif" 
        alt="Rubber Duck" 
        className={`${isFloating ? 'animate-bounce' : ''}`}
      />
    </div>
  );
};

export default RubberDuck;
