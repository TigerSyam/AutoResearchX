import { useState, useEffect, useRef } from 'react';

export const useCursor = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorVelocity, setCursorVelocity] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(Date.now());
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTimeRef.current;
      
      if (deltaTime > 0) {
        const velocityX = (e.clientX - lastPositionRef.current.x) / deltaTime * 100;
        const velocityY = (e.clientY - lastPositionRef.current.y) / deltaTime * 100;
        
        setCursorVelocity({ x: velocityX, y: velocityY });
        setCursorPosition({ x: e.clientX, y: e.clientY });
        
        lastPositionRef.current = { x: e.clientX, y: e.clientY };
        lastTimeRef.current = currentTime;
      }

      setIsMoving(true);

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout to detect when cursor stops
      timeoutRef.current = setTimeout(() => {
        setIsMoving(false);
        setCursorVelocity({ x: 0, y: 0 });
      }, 150);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { cursorPosition, cursorVelocity, isMoving };
};

export const useMagneticEffect = (ref, intensity = 0.5) => {
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 200;
      
      if (distance < maxDistance) {
        const force = (1 - distance / maxDistance) * intensity;
        setMagneticOffset({
          x: deltaX * force * 0.3,
          y: deltaY * force * 0.3
        });
      } else {
        setMagneticOffset({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [ref, intensity]);

  return magneticOffset;
};

export const useTiltEffect = (ref, intensity = 0.1) => {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      const rotateY = (deltaX / rect.width) * intensity * 40;
      const rotateX = -(deltaY / rect.height) * intensity * 40;
      
      setTilt({ rotateX, rotateY });
    };

    const handleMouseLeave = () => {
      setTilt({ rotateX: 0, rotateY: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    if (ref.current) {
      ref.current.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (ref.current) {
        ref.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [ref, intensity]);

  return tilt;
};