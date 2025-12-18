import { useState, useEffect } from 'react';
import { useCursor } from '../hooks/useCursor';

export const WaveBackground = () => {
  const { cursorPosition, isMoving } = useCursor();
  const [waves, setWaves] = useState([]);

  useEffect(() => {
    const generateWaves = () => {
      const newWaves = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        amplitude: Math.random() * 50 + 20,
        frequency: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.01,
        color: ['rgba(0, 255, 255, 0.1)', 'rgba(255, 0, 255, 0.1)', 'rgba(255, 255, 0, 0.1)'][Math.floor(Math.random() * 3)]
      }));
      setWaves(newWaves);
    };

    generateWaves();
  }, []);

  useEffect(() => {
    const animate = () => {
      setWaves(prevWaves => 
        prevWaves.map(wave => ({
          ...wave,
          phase: wave.phase + wave.speed + (isMoving ? 0.02 : 0)
        }))
      );
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, [isMoving]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="wave-distortion">
            <feTurbulence baseFrequency="0.02" numOctaves="3" result="turbulence" />
            <feColorMatrix in="turbulence" type="saturate" values="2" />
            <feComposite in="SourceGraphic" in2="turbulence" operator="arithmetic" k1="0" k2="1" k3="-0.5" k4="0.5" />
          </filter>
        </defs>
        
        {waves.map(wave => (
          <path
            key={wave.id}
            d={`M0,${window.innerHeight / 2} Q${window.innerWidth / 4},${window.innerHeight / 2 - wave.amplitude} ${window.innerWidth / 2},${window.innerHeight / 2} T${window.innerWidth},${window.innerHeight / 2}`}
            fill="none"
            stroke={wave.color}
            strokeWidth="2"
            opacity="0.6"
            filter="url(#wave-distortion)"
            style={{
              transform: `translateY(${Math.sin(wave.phase) * 20}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export const DistortionField = () => {
  const { cursorPosition } = useCursor();
  const [distortionPoints, setDistortionPoints] = useState([]);

  useEffect(() => {
    const points = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      intensity: Math.random() * 0.5 + 0.2
    }));
    setDistortionPoints(points);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="relative w-full h-full">
        {distortionPoints.map(point => {
          const dx = cursorPosition.x - (point.x / 100 * window.innerWidth);
          const dy = cursorPosition.y - (point.y / 100 * window.innerHeight);
          const distance = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.max(0, 1 - distance / 300);

          return (
            <div
              key={point.id}
              className="absolute rounded-full"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                width: `${20 + influence * 30}px`,
                height: `${20 + influence * 30}px`,
                background: `radial-gradient(circle, rgba(0, 255, 255, ${point.intensity * influence}) 0%, transparent 70%)`,
                transform: 'translate(-50%, -50%)',
                filter: 'blur(2px)',
                transition: 'all 0.3s ease-out'
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export const MorphingGradient = () => {
  const [gradientPhase, setGradientPhase] = useState(0);
  const { isMoving } = useCursor();

  useEffect(() => {
    const animate = () => {
      setGradientPhase(prev => prev + (isMoving ? 0.02 : 0.01));
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, [isMoving]);

  const gradient1 = {
    x: 50 + Math.sin(gradientPhase) * 30,
    y: 50 + Math.cos(gradientPhase * 0.7) * 30,
    radius: 60 + Math.sin(gradientPhase * 1.3) * 20
  };

  const gradient2 = {
    x: 50 + Math.cos(gradientPhase * 0.8) * 40,
    y: 50 + Math.sin(gradientPhase * 1.2) * 40,
    radius: 80 + Math.cos(gradientPhase * 0.9) * 30
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="morph-gradient1" cx={`${gradient1.x}%`} cy={`${gradient1.y}%`} r={`${gradient1.radius}%`}>
            <stop offset="0%" stopColor="#00ffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="morph-gradient2" cx={`${gradient2.x}%`} cy={`${gradient2.y}%`} r={`${gradient2.radius}%`}>
            <stop offset="0%" stopColor="#ff00ff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#morph-gradient1)" />
        <rect width="100%" height="100%" fill="url(#morph-gradient2)" />
      </svg>
    </div>
  );
};