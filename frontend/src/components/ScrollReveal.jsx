import { useState, useEffect, useRef } from 'react';

export const useScrollReveal = () => {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const registerElement = (id, element) => {
    if (observerRef.current && element) {
      observerRef.current.observe(element);
    }
  };

  return { visibleElements, registerElement };
};

export const ScrollReveal = ({ children, id, className = '' }) => {
  const { visibleElements, registerElement } = useScrollReveal();
  const elementRef = useRef(null);
  const isVisible = visibleElements.has(id);

  useEffect(() => {
    if (elementRef.current) {
      registerElement(id, elementRef.current);
    }
  }, [id, registerElement]);

  return (
    <div
      ref={elementRef}
      id={id}
      className={`${className} transition-all duration-1000 ${
        isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-10'
      }`}
      style={{
        transitionDelay: isVisible ? '0ms' : '0ms',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {children}
    </div>
  );
};

export const ParallaxSection = ({ children, speed = 0.5, className = '' }) => {
  const [offsetY, setOffsetY] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const element = sectionRef.current;
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top;
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;
        
        // Calculate parallax offset based on element position
        const scrollProgress = Math.max(0, Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight)));
        setOffsetY(scrollProgress * speed * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{
        transform: `translateY(${offsetY}px)`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {children}
    </div>
  );
};

export const StickyContainer = ({ children, stickyTop = '20vh', className = '' }) => {
  const [isSticky, setIsSticky] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const element = containerRef.current;
      if (element) {
        const rect = element.getBoundingClientRect();
        const shouldStick = rect.top <= parseInt(stickyTop);
        setIsSticky(shouldStick);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [stickyTop]);

  return (
    <div
      ref={containerRef}
      className={`${className} ${isSticky ? 'sticky' : ''}`}
      style={{
        top: isSticky ? stickyTop : 'auto',
        position: isSticky ? 'sticky' : 'relative',
        zIndex: isSticky ? 20 : 'auto'
      }}
    >
      {children}
    </div>
  );
};

export const ScrollProgress = ({ className = '' }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 left-0 w-full h-1 z-50 ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
        style={{
          width: `${scrollProgress}%`,
          transition: 'width 0.1s ease-out'
        }}
      />
    </div>
  );
};