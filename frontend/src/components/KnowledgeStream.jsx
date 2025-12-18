import React from 'react';

const KnowledgeStream = ({ isActive = false, targetPosition = null }) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      {/* Knowledge Flow Lines */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`flow-${i}`}
          className="absolute w-1 bg-gradient-to-t from-transparent via-cyan-400 to-transparent animate-stream"
          style={{
            height: '200px',
            left: `${20 + i * 15}%`,
            top: '0',
            animationDelay: `${i * 0.5}s`,
            animationDuration: '3s',
          }}
        />
      ))}

      {/* Data Nodes */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30) * Math.PI / 180;
        const radius = 300;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <div
            key={`node-${i}`}
            className="absolute w-3 h-3 rounded-full bg-purple-500 animate-pulse"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: '2s',
            }}
          >
            <div
              className="absolute inset-0 rounded-full bg-purple-400 animate-ping"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s',
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default KnowledgeStream;