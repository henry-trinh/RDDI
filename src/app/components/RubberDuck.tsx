"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface RubberDuckProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  onClick?: () => void;
}

const RubberDuck = ({ size = 'md', animated = false, onClick }: RubberDuckProps) => {
  const [isFloating, setIsFloating] = useState<boolean>(animated);

  useEffect(() => {
    setIsFloating(animated);
  }, [animated]);

  const sizeClasses: Record<string, string> = {
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
        bottom: '-290px',
      }}
      onClick={onClick}
    >
      <Image 
        src="/rubber-ducky.gif" 
        alt="Rubber Duck" 
        width={128} 
        height={128} 
        priority 
        className={`${isFloating ? 'animate-bounce' : ''}`}
      />
    </div>
  );
};

export default RubberDuck;