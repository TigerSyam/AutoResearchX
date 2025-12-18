import React, { useState, useEffect } from 'react';
import { useCursor } from '../hooks/useCursor';

const AICore = ({ state = 'idle', followCursor = false }) => {
  const { cursorPosition, isMoving } = useCursor();
  const [corePosition, setCorePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const getCoreIntensity = () => {
    switch (state) {
      case 'searching': return 'high';
      case 'reading': return 'medium';
      case 'synthesizing': return 'maximum';
      case 'completed': return 'pulse';
      default: return 'low';
    }
  };

  const coreIntensity = getCoreIntensity();

  // Cursor following effect
  useEffect(() => {
    if (followCursor && isMoving) {
      const targetX = (cursorPosition.x - window.innerWidth / 2) * 0.1;
      const targetY = (cursorPosition.y - window.innerHeight / 2) * 0.1;
      
      setCorePosition(prev => ({
        x: prev.x + (targetX - prev.x) * 0.1,
        y: prev.y + (targetY - prev.y) * 0.1
      }));
    }
  }, [cursorPosition, isMoving, followCursor]);

  return (
    <div 
      className="relative w-64 h-64 flex items-center justify-center"
      style={{
        transform: `translate(${corePosition.x}px, ${corePosition.y}px)`,
        transition: followCursor ? 'none' : 'transform 0.3s ease-out'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer Rings */}
      {[...Array(3)].map((_, i) => (
        <div
          key={`ring-${i}`}
          className="absolute rounded-full border-2 border-cyan-400 animate-spin"
          style={{
            width: `${200 + i * 40}px`,
            height: `${200 + i * 40}px`,
            opacity: 0.3 - i * 0.1,
            animationDuration: `${3 + i}s`,
          }}
        />
      ))}

      {/* Main Core */}
      <div
        className="relative w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 neon-glow-strong animate-pulse cursor-pointer"
        style={{
          animationDuration: coreIntensity === 'maximum' ? '1s' : '2s',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.3s ease'
        }}
      >
        {/* Inner Core */}
        <div
          className="absolute inset-4 rounded-full bg-gradient-to-br from-white to-cyan-200 animate-pulse"
          style={{
            animationDuration: '1.5s',
          }}
        />

        {/* Core Pulse Effect */}
        {(coreIntensity === 'high' || coreIntensity === 'maximum') && (
          <div
            className="absolute inset-0 rounded-full bg-cyan-400 animate-ping"
            style={{
              animationDuration: '2s',
            }}
          />
        )}
      </div>

      {/* Enhanced Energy Particles */}
      {(coreIntensity === 'medium' || coreIntensity === 'high' || coreIntensity === 'maximum') && (
        <>
          {[...Array(20)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full animate-ping"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${50 + Math.cos((i * 18) * Math.PI / 180) * (60 + Math.random() * 40)}%`,
                top: `${50 + Math.sin((i * 18) * Math.PI / 180) * (60 + Math.random() * 40)}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${1 + Math.random()}s`,
                backgroundColor: ['#00ffff', '#ff00ff', '#ffff00'][Math.floor(Math.random() * 3)],
                boxShadow: `0 0 ${Math.random() * 10 + 5}px currentColor`
              }}
            />
          ))}
        </>
      )}

      {/* Neural Connections */}
      {coreIntensity === 'maximum' && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45) * Math.PI / 180;
            const x1 = Math.cos(angle) * 60;
            const y1 = Math.sin(angle) * 60;
            const x2 = Math.cos(angle) * 150;
            const y2 = Math.sin(angle) * 150;
            
            return (
              <line
                key={`line-${i}`}
                x1={x1 + 128}
                y1={y1 + 128}
                x2={x2 + 128}
                y2={y2 + 128}
                stroke="rgba(0, 255, 255, 0.6)"
                strokeWidth="2"
                className="animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            );
          })}
        </svg>
      )}
    </div>
  );
};

export default AICore;