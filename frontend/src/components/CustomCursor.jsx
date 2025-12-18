import { useState, useEffect } from 'react';
import { useCursor } from '../hooks/useCursor';

const CustomCursor = () => {
  const { cursorPosition, isMoving } = useCursor();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Add event listeners to interactive elements
    const interactiveElements = document.querySelectorAll('button, input, a, [class*="cursor-pointer"]');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <div
      className="custom-cursor"
      style={{
        left: cursorPosition.x,
        top: cursorPosition.y,
        transform: `translate(-50%, -50%) scale(${isMoving ? 1.2 : 1})`,
        opacity: isHovering ? 0.8 : 0.6
      }}
    />
  );
};

export default CustomCursor;