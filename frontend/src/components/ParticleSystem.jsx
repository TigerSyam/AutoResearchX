import { useState, useEffect, useRef } from 'react';
import { useCursor } from '../hooks/useCursor';

const Particle = ({ id, cursorPosition, cursorVelocity, isCursorMoving }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState(Math.random() * 3 + 1);
  const [opacity, setOpacity] = useState(Math.random() * 0.7 + 0.3);
  const [color, setColor] = useState('#00ffff');
  
  useEffect(() => {
    // Initialize particle position randomly
    setPosition({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight
    });

    // Set random color from neon palette
    const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff88', '#ff0088'];
    setColor(colors[Math.floor(Math.random() * colors.length)]);

    // Set initial random velocity
    setVelocity({
      x: (Math.random() - 0.5) * 0.5,
      y: (Math.random() - 0.5) * 0.5
    });
  }, []);

  useEffect(() => {
    const animate = () => {
      setPosition(prevPos => {
        setVelocity(prevVel => {
          let newVel = { ...prevVel };
          
          // Cursor attraction/repulsion effect
          if (isCursorMoving) {
            const dx = cursorPosition.x - prevPos.x;
            const dy = cursorPosition.y - prevPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
              const force = (1 - distance / 150) * 0.02;
              newVel.x += dx * force;
              newVel.y += dy * force;
            }
          }

          // Add some randomness
          newVel.x += (Math.random() - 0.5) * 0.01;
          newVel.y += (Math.random() - 0.5) * 0.01;

          // Damping
          newVel.x *= 0.98;
          newVel.y *= 0.98;

          return newVel;
        });

        // Update position
        const newPos = {
          x: prevPos.x + velocity.x,
          y: prevPos.y + velocity.y
        };

        // Wrap around screen edges
        if (newPos.x < 0) newPos.x = window.innerWidth;
        if (newPos.x > window.innerWidth) newPos.x = 0;
        if (newPos.y < 0) newPos.y = window.innerHeight;
        if (newPos.y > window.innerHeight) newPos.y = 0;

        return newPos;
      });

      // Update opacity based on cursor proximity
      setOpacity(prevOpacity => {
        const dx = cursorPosition.x - position.x;
        const dy = cursorPosition.y - position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          return Math.max(0.3, 1 - distance / 100);
        }
        return 0.3;
      });
    };

    const interval = setInterval(animate, 16); // ~60fps
    return () => clearInterval(interval);
  }, [cursorPosition, isCursorMoving, velocity]);

  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        width: size,
        height: size,
        backgroundColor: color,
        opacity: opacity,
        boxShadow: `0 0 ${size * 2}px ${color}`,
        transform: 'translate(-50%, -50%)',
        transition: 'opacity 0.3s ease-out'
      }}
    />
  );
};

export const ParticleSystem = ({ particleCount = 50 }) => {
  const { cursorPosition, cursorVelocity, isMoving: isCursorMoving } = useCursor();
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setParticles(Array.from({ length: particleCount }, (_, i) => i));
  }, [particleCount]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map(id => (
        <Particle
          key={id}
          id={id}
          cursorPosition={cursorPosition}
          cursorVelocity={cursorVelocity}
          isCursorMoving={isCursorMoving}
        />
      ))}
    </div>
  );
};

export const KnowledgeStream = ({ targetPosition, isActive = true }) => {
  const [streams, setStreams] = useState([]);
  const { cursorPosition } = useCursor();

  useEffect(() => {
    if (!isActive) return;

    const generateStreams = () => {
      const newStreams = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        startX: Math.random() * window.innerWidth,
        startY: -50,
        speed: Math.random() * 2 + 1,
        color: ['#00ffff', '#ff00ff', '#ffff00'][Math.floor(Math.random() * 3)],
        size: Math.random() * 4 + 2
      }));
      setStreams(newStreams);
    };

    const interval = setInterval(generateStreams, 2000);
    generateStreams();

    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    const animate = () => {
      setStreams(prevStreams => 
        prevStreams.map(stream => ({
          ...stream,
          startY: stream.startY + stream.speed,
          startX: stream.startX + Math.sin(stream.startY * 0.01) * 2
        })).filter(stream => stream.startY < window.innerHeight + 50)
      );
    };

    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {streams.map(stream => (
        <div
          key={stream.id}
          className="absolute rounded-full"
          style={{
            left: stream.startX,
            top: stream.startY,
            width: stream.size,
            height: stream.size,
            backgroundColor: stream.color,
            opacity: 0.8,
            boxShadow: `0 0 ${stream.size * 3}px ${stream.color}`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  );
};

export default ParticleSystem;