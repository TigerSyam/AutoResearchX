import React, { useState, useEffect } from 'react';

const ReportView = ({ isVisible = false, reportData = null }) => {
  const [revealedSections, setRevealedSections] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);

  // Mock report data
  const mockReport = {
    title: "The Future of Quantum Computing in Drug Discovery",
    summary: "This comprehensive analysis explores how quantum computing is revolutionizing pharmaceutical research by simulating molecular interactions at unprecedented scales.",
    sections: [
      {
        id: 'introduction',
        title: 'Introduction',
        content: 'Quantum computing represents a paradigm shift in computational capabilities, particularly in the field of drug discovery. Unlike classical computers that process information in binary states, quantum computers leverage quantum mechanical phenomena such as superposition and entanglement to perform complex calculations exponentially faster.',
      },
      {
        id: 'current_applications',
        title: 'Current Applications',
        content: 'Leading pharmaceutical companies are already implementing quantum computing in their research pipelines. IBM, Google, and several biotech startups have demonstrated successful applications in molecular simulation, protein folding prediction, and drug-target interaction analysis. These applications have shown potential to reduce drug development timelines from 10-15 years to potentially 5-7 years.',
      },
      {
        id: 'technological_advantages',
        title: 'Technological Advantages',
        content: 'The primary advantage lies in quantum computers\' ability to simulate quantum systems directly. Molecular interactions, chemical reactions, and protein folding are inherently quantum mechanical processes. Classical computers must approximate these systems, while quantum computers can model them natively, providing unprecedented accuracy and speed.',
      },
      {
        id: 'challenges',
        title: 'Challenges & Limitations',
        content: 'Despite the promise, significant challenges remain. Current quantum computers are limited by decoherence, error rates, and the need for extremely low temperatures. The technology is still in its infancy, with most practical applications limited to proof-of-concept demonstrations rather than real-world drug discovery pipelines.',
      },
      {
        id: 'future_outlook',
        title: 'Future Outlook',
        content: 'Experts predict that within the next decade, quantum computing will become integral to pharmaceutical research. As hardware improves and error correction becomes more sophisticated, we expect to see quantum-enhanced drug discovery platforms that can identify promising drug candidates in months rather than years.',
      },
      {
        id: 'conclusion',
        title: 'Conclusion',
        content: 'Quantum computing in drug discovery represents one of the most promising applications of this revolutionary technology. While challenges remain, the potential to accelerate drug development, reduce costs, and ultimately save lives makes this an area of intense research and investment. The convergence of quantum computing and biotechnology may usher in a new era of personalized medicine and rapid drug development.',
      },
    ],
    key_insights: [
      'Quantum computing could reduce drug development time by 50-70%',
      'Major pharmaceutical companies are investing billions in quantum research',
      'Protein folding simulation is the most promising near-term application',
      'Hybrid quantum-classical algorithms show immediate practical benefits',
      'The technology could enable personalized drug design at scale',
    ],
    sources: [
      { title: 'Nature Reviews Drug Discovery', year: 2023 },
      { title: 'IBM Quantum Network Study', year: 2023 },
      { title: 'MIT Technology Review: Quantum in Pharma', year: 2022 },
      { title: 'European Quantum Computing Initiative', year: 2023 },
    ],
  };

  const report = reportData || mockReport;

  useEffect(() => {
    if (isVisible) {
      const timer = setInterval(() => {
        setCurrentSection((prev) => {
          if (prev < report.sections.length - 1) {
            setRevealedSections(prev => [...prev, prev + 1]);
            return prev + 1;
          }
          return prev;
        });
      }, 2000);

      // Reveal first section immediately
      setRevealedSections([0]);

      return () => clearInterval(timer);
    }
  }, [isVisible, report.sections.length]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-4xl mx-auto animate-slide-up">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              {report.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {report.summary}
            </p>
          </div>

          {/* Key Insights */}
          <div
            className="glassmorphism p-6 mb-8 animate-slide-up"
            style={{
              opacity: revealedSections.includes(0) ? 1 : 0,
            }}
          >
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Key Insights</h2>
            <div className="grid gap-3">
              {report.key_insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 animate-fade-in"
                  style={{
                    animationDelay: `${index * 0.1 + 0.5}s`,
                  }}
                >
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-300">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {report.sections.map((section, index) => (
              <div
                key={section.id}
                className="glassmorphism p-8 animate-slide-up"
                style={{
                  opacity: revealedSections.includes(index) ? 1 : 0,
                  transform: revealedSections.includes(index) ? 'translateY(0)' : 'translateY(50px)',
                  transition: 'all 0.8s ease',
                }}
              >
                {/* Section Header with Glow Effect */}
                <div className="mb-6 relative">
                  <h3
                    className="text-2xl font-bold text-cyan-400"
                    style={{
                      textShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
                    }}
                  >
                    {section.title}
                  </h3>
                  <div
                    className="absolute -left-4 top-2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-600 rounded-full"
                    style={{
                      transform: revealedSections.includes(index) ? 'scaleY(1)' : 'scaleY(0)',
                      transition: 'transform 0.4s ease',
                    }}
                  />
                </div>

                {/* Section Content */}
                <div
                  style={{
                    opacity: revealedSections.includes(index) ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                  }}
                >
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {section.content}
                  </p>
                </div>

                {/* Animated Underline */}
                <div
                  className="mt-6 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                  style={{
                    transform: revealedSections.includes(index) ? 'scaleX(1)' : 'scaleX(0)',
                    transition: 'transform 0.8s ease',
                    transformOrigin: 'left',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Sources */}
          <div
            className="glassmorphism p-6 mt-8 animate-slide-up"
            style={{
              opacity: revealedSections.length === report.sections.length ? 1 : 0,
            }}
          >
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Sources</h3>
            <div className="grid gap-2">
              {report.sources.map((source, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 px-3 bg-white/5 rounded-lg animate-fade-in"
                  style={{
                    animationDelay: `${index * 0.1 + 1.2}s`,
                  }}
                >
                  <span className="text-gray-300">{source.title}</span>
                  <span className="text-gray-500 text-sm">{source.year}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Completion Animation */}
          {revealedSections.length === report.sections.length && (
            <div className="text-center mt-12 animate-fade-in">
              <div
                className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-white font-semibold"
                style={{
                  boxShadow: [
                    '0 0 20px rgba(0, 255, 255, 0.3)',
                    '0 0 40px rgba(0, 255, 255, 0.6)',
                    '0 0 20px rgba(0, 255, 255, 0.3)',
                  ][Math.floor(Date.now() / 2000) % 3],
                }}
              >
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span>Research Complete</span>
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportView;