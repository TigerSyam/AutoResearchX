import { useState, useEffect } from 'react';
import { useCursor } from '../hooks/useCursor';

export const EnhancedBackgroundFX = () => {
  const { cursorPosition, isMoving } = useCursor();
  const [gradientPhase, setGradientPhase] = useState(0);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const animate = () => {
      setGradientPhase(prev => prev + (isMoving ? 0.03 : 0.01));
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, [isMoving]);

  useEffect(() => {
    // Generate floating particles
    const generateParticles = () => {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        color: ['#00ffff', '#ff00ff', '#ffff00', '#00ff88'][Math.floor(Math.random() * 4)],
        speed: Math.random() * 0.5 + 0.2,
        direction: Math.random() * Math.PI * 2
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animateParticles = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          let newX = particle.x + Math.cos(particle.direction) * particle.speed * 0.1;
          let newY = particle.y + Math.sin(particle.direction) * particle.speed * 0.1;

          // Wrap around screen
          if (newX < 0) newX = 100;
          if (newX > 100) newX = 0;
          if (newY < 0) newY = 100;
          if (newY > 100) newY = 0;

          // Cursor interaction
          const cursorX = cursorPosition.x / window.innerWidth * 100;
          const cursorY = cursorPosition.y / window.innerHeight * 100;
          const dx = cursorX - newX;
          const dy = cursorY - newY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 20 && isMoving) {
            const force = (1 - distance / 20) * 0.5;
            newX -= dx * force * 0.1;
            newY -= dy * force * 0.1;
          }

          return {
            ...particle,
            x: newX,
            y: newY,
            opacity: particle.opacity + (isMoving ? 0.1 : 0)
          };
        })
      );
    };

    const interval = setInterval(animateParticles, 100);
    return () => clearInterval(interval);
  }, [cursorPosition, isMoving]);

  const gradient1 = {
    x: 50 + Math.sin(gradientPhase) * 40,
    y: 50 + Math.cos(gradientPhase * 0.8) * 40,
    radius: 70 + Math.sin(gradientPhase * 1.2) * 30,
    opacity: 0.3 + Math.sin(gradientPhase * 0.7) * 0.2
  };

  const gradient2 = {
    x: 50 + Math.cos(gradientPhase * 0.6) * 50,
    y: 50 + Math.sin(gradientPhase * 1.1) * 50,
    radius: 90 + Math.cos(gradientPhase * 0.9) * 40,
    opacity: 0.2 + Math.cos(gradientPhase * 0.5) * 0.15
  };

  const gradient3 = {
    x: 50 + Math.sin(gradientPhase * 1.3) * 30,
    y: 50 + Math.cos(gradientPhase * 0.9) * 30,
    radius: 60 + Math.sin(gradientPhase * 1.5) * 25,
    opacity: 0.25 + Math.sin(gradientPhase * 0.8) * 0.15
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Animated Gradient Background */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="enhanced-gradient1" cx={`${gradient1.x}%`} cy={`${gradient1.y}%`} r={`${gradient1.radius}%`}>
            <stop offset="0%" stopColor="#00ffff" stopOpacity={gradient1.opacity} />
            <stop offset="50%" stopColor="#ff00ff" stopOpacity={gradient1.opacity * 0.5} />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="enhanced-gradient2" cx={`${gradient2.x}%`} cy={`${gradient2.y}%`} r={`${gradient2.radius}%`}>
            <stop offset="0%" stopColor="#ff00ff" stopOpacity={gradient2.opacity} />
            <stop offset="50%" stopColor="#ffff00" stopOpacity={gradient2.opacity * 0.5} />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="enhanced-gradient3" cx={`${gradient3.x}%`} cy={`${gradient3.y}%`} r={`${gradient3.radius}%`}>
            <stop offset="0%" stopColor="#ffff00" stopOpacity={gradient3.opacity} />
            <stop offset="50%" stopColor="#00ff88" stopOpacity={gradient3.opacity * 0.5} />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#enhanced-gradient1)" />
        <rect width="100%" height="100%" fill="url(#enhanced-gradient2)" />
        <rect width="100%" height="100%" fill="url(#enhanced-gradient3)" />
      </svg>

      {/* Floating Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.3s ease-out'
          }}
        />
      ))}

      {/* Cursor Trail Effect */}
      {isMoving && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: cursorPosition.x,
            top: cursorPosition.y,
            width: '20px',
            height: '20px',
            background: 'radial-gradient(circle, rgba(0, 255, 255, 0.8) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            opacity: 0.6,
            filter: 'blur(2px)',
            transition: 'all 0.1s ease-out'
          }}
        />
      )}

      {/* Enhanced Grid Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${50 + Math.sin(gradientPhase) * 10}px ${50 + Math.cos(gradientPhase * 0.8) * 10}px`,
            transition: 'background-size 0.3s ease-out'
          }}
        />
      </div>

      {/* Pulsing Energy Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-cyan-400 pointer-events-none"
            style={{
              width: `${200 + i * 100 + Math.sin(gradientPhase + i) * 50}px`,
              height: `${200 + i * 100 + Math.sin(gradientPhase + i) * 50}px`,
              opacity: 0.1 + Math.sin(gradientPhase + i * 2) * 0.1,
              transition: 'all 0.5s ease-out'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const NeonGrid = () => {
  const [gridPhase, setGridPhase] = useState(0);
  const { isMoving } = useCursor();

  useEffect(() => {
    const animate = () => {
      setGridPhase(prev => prev + (isMoving ? 0.05 : 0.02));
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, [isMoving]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div 
        className="w-full h-full opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: `${40 + Math.sin(gridPhase) * 10}px ${40 + Math.cos(gridPhase * 0.7) * 10}px`,
          transform: `perspective(500px) rotateX(${Math.sin(gridPhase * 0.5) * 5}deg)`,
          transition: 'all 0.3s ease-out'
        }}
      />
    </div>
  );
};