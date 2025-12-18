import React from 'react';

const ResearchStages = ({ currentStage = 'idle' }) => {
  const stages = [
    { id: 'searching', title: 'Searching Sources', description: 'Scanning the web for relevant information' },
    { id: 'reading', title: 'Reading & Analyzing', description: 'Processing and understanding content' },
    { id: 'synthesizing', title: 'Synthesizing Knowledge', description: 'Connecting insights and forming conclusions' },
  ];

  const getStageIndex = (stage) => {
    switch (stage) {
      case 'searching': return 0;
      case 'reading': return 1;
      case 'synthesizing': return 2;
      case 'completed': return 3;
      default: return -1;
    }
  };

  const currentStageIndex = getStageIndex(currentStage);

  if (currentStage === 'idle') return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative">
        {/* Stage Indicators */}
        <div className="flex items-center justify-center space-x-8 mb-12">
          {stages.map((stage, index) => (
            <div
              key={stage.id}
              className="flex flex-col items-center"
              style={{
                opacity: currentStageIndex >= index ? 1 : 0.3,
              }}
            >
              {/* Stage Icon */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 relative ${
                  currentStageIndex >= index 
                    ? 'bg-gradient-to-br from-cyan-400 to-purple-600' 
                    : 'bg-gray-700'
                }`}
                style={{
                  transform: currentStage === stage.id ? 'scale(1.2)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                }}
              >
                {stage.id === 'searching' && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
                {stage.id === 'reading' && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )}
                {stage.id === 'synthesizing' && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.828.995A383.15 383.15 0 0112.5 14.5a4.5 4.5 0 01-1.898-7.268z" />
                  </svg>
                )}

                {/* Active Ring */}
                {currentStage === stage.id && (
                  <div
                    className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping"
                    style={{
                      animationDuration: '1.5s',
                    }}
                  />
                )}
              </div>

              {/* Stage Title */}
              <h3
                className={`text-lg font-semibold mb-2 ${
                  currentStageIndex >= index ? 'text-white' : 'text-gray-500'
                }`}
                style={{
                  color: currentStage === stage.id ? '#00ffff' : undefined,
                  textShadow: currentStage === stage.id ? '0 0 10px rgba(0, 255, 255, 0.5)' : undefined,
                }}
              >
                {stage.title}
              </h3>

              {/* Stage Description */}
              <p
                className={`text-sm text-center max-w-xs ${
                  currentStageIndex >= index ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {stage.description}
              </p>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto">
          <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-purple-600 transition-all duration-800 ease-out"
              style={{
                width: currentStage === 'completed' ? '100%' : `${((currentStageIndex + 1) / 4) * 100}%`,
              }}
            />
          </div>
          
          {/* Progress Indicators */}
          <div className="flex justify-between mt-4">
            {stages.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentStageIndex >= index ? 'bg-cyan-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Current Stage Status */}
        <div className="text-center mt-8">
          <div
            className="text-2xl font-bold text-cyan-400 mb-2"
            style={{
              textShadow: [
                '0 0 10px rgba(0, 255, 255, 0.5)',
                '0 0 20px rgba(0, 255, 255, 0.8)',
                '0 0 10px rgba(0, 255, 255, 0.5)',
              ][currentStageIndex % 3],
            }}
          >
            {currentStage === 'searching' && 'Scanning the digital universe...'}
            {currentStage === 'reading' && 'Processing and understanding...'}
            {currentStage === 'synthesizing' && 'Connecting the dots...'}
            {currentStage === 'completed' && 'Research Complete!'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchStages;