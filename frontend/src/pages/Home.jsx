import React from "react";
import { EnhancedBackgroundFX } from "../components/EnhancedBackgroundFX";
import ParticleSystem from "../components/ParticleSystem";
import AICore from "../components/AICore";
import QueryCard from "../components/QueryCard";
import CustomCursor from "../components/CustomCursor";
import {
  ScrollReveal,
  ParallaxSection,
  ScrollProgress,
} from "../components/ScrollReveal";
import { WaveBackground, DistortionField } from "../components/WaveBackground";

const Home = ({
  query,
  setQuery,
  researchState,
  onRunResearch,
  result,
  onReset,
}) => {

  const parseReport = (reportText) => {
    const text = (reportText ?? "").toString();
    if (!text.trim()) return [];

    const lines = text.replace(/\r\n/g, "\n").split("\n");
    const sections = [];
    let current = { title: null, lines: [] };

    const pushCurrent = () => {
      if (!current.title && current.lines.every((l) => !l.trim())) return;
      sections.push(current);
    };

    for (const rawLine of lines) {
      const line = rawLine ?? "";
      const headingMatch = line.match(/^\s*(?:\d+\.|[IVX]+\.|[A-Z]\.|#+)\s+(.+?)\s*$/);
      const isLikelyHeading = headingMatch && line.trim().length < 120;

      if (isLikelyHeading) {
        pushCurrent();
        current = { title: headingMatch[1].trim(), lines: [] };
        continue;
      }

      current.lines.push(line);
    }
    pushCurrent();
    return sections;
  };

  const renderSectionContent = (lines) => {
    const blocks = [];
    let paragraph = [];
    let bulletItems = null;

    const flushParagraph = () => {
      const text = paragraph.join(" ").trim();
      if (text) blocks.push({ type: "p", text });
      paragraph = [];
    };

    const flushBullets = () => {
      if (bulletItems && bulletItems.length) blocks.push({ type: "ul", items: bulletItems });
      bulletItems = null;
    };

    for (const raw of lines) {
      const line = (raw ?? "").trimEnd();
      const trimmed = line.trim();

      if (!trimmed) {
        flushParagraph();
        flushBullets();
        continue;
      }

      const bulletMatch = trimmed.match(/^([-*•]|\d+[.)])\s+(.*)$/);
      if (bulletMatch) {
        flushParagraph();
        if (!bulletItems) bulletItems = [];
        bulletItems.push(bulletMatch[2].trim());
        continue;
      }

      flushBullets();
      paragraph.push(trimmed);
    }

    flushParagraph();
    flushBullets();

    return (
      <div className="space-y-4">
        {blocks.map((b, i) => {
          if (b.type === "ul") {
            return (
              <ul key={i} className="space-y-2 pl-5">
                {b.items.map((item, idx) => (
                  <li key={idx} className="text-gray-200">
                    <span className="text-cyan-400 mr-2">•</span>
                    <span className="break-words" style={{ overflowWrap: "anywhere" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            );
          }

          return (
            <p key={i} className="text-gray-200 break-words" style={{ overflowWrap: "anywhere" }}>
              {b.text}
            </p>
          );
        })}
      </div>
    );
  };

  const resetResearch = () => {
    onReset();
  };


  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Background Effects */}
      <EnhancedBackgroundFX />
      <ParticleSystem particleCount={100} />
      <WaveBackground />
      <DistortionField />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* HERO SECTION */}
        {researchState === "idle" && (
          <ParallaxSection speed={0.3}>
            <div className="text-center mb-16">
              <ScrollReveal id="hero-title">
                <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient">
                  AutoResearchX
                </h1>
              </ScrollReveal>

              <ScrollReveal id="hero-subtitle">
                <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  An autonomous AI research system that searches, reads,
                  summarizes, and synthesizes knowledge from across the digital
                  universe
                </p>
              </ScrollReveal>

              <ScrollReveal id="hero-core">
                <div className="flex justify-center mb-12">
                  <AICore state="idle" followCursor={true} />
                </div>
              </ScrollReveal>
            </div>
          </ParallaxSection>
        )}

        {/* QUERY CARD */}
        {researchState !== "completed" && (
          <ScrollReveal id="query-card">
            <QueryCard
              query={query}
              setQuery={setQuery}
              onSubmit={onRunResearch}
              isLoading={researchState !== "idle"}
            />
          </ScrollReveal>
        )}

        {/* RESEARCH IN PROGRESS */}
        {researchState !== "idle" && researchState !== "completed" && (
          <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/90 backdrop-blur-md">
            <ScrollReveal id="research-status">
              <div className="text-center">
                <div className="flex justify-center mb-8">
                  <AICore state={researchState} followCursor={false} />
                </div>

                <div className="text-3xl font-bold text-cyan-400 mb-8">
                  {researchState === "searching" &&
                    "Scanning the digital universe..."}
                  {researchState === "reading" &&
                    "Processing and understanding..."}
                  {researchState === "synthesizing" &&
                    "Connecting the dots..."}
                </div>

                <div className="w-80 h-3 bg-gray-800 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-600 transition-all duration-1000 ease-out"
                    style={{
                      width:
                        researchState === "searching"
                          ? "33%"
                          : researchState === "reading"
                          ? "66%"
                          : "100%",
                    }}
                  />
                </div>

                <div className="text-gray-400 text-sm">
                  {researchState === "searching" &&
                    "Phase 1: Knowledge Discovery"}
                  {researchState === "reading" &&
                    "Phase 2: Information Processing"}
                  {researchState === "synthesizing" &&
                    "Phase 3: Intelligence Synthesis"}
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* RESEARCH COMPLETE — REAL BACKEND DATA */}
        {researchState === "completed" && result && (
          <ScrollReveal id="research-complete">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-cyan-400 mb-8">
                Research Complete
              </h2>

              <div className="glassmorphism p-8 max-w-4xl mx-auto mb-8 text-left">
                <div className="max-h-[70vh] overflow-y-auto pr-2">
                  <div className="space-y-8 text-lg leading-relaxed">
                    {(() => {
                      const sections = parseReport(result.report);
                      if (!sections.length) {
                        return (
                          <p className="text-gray-300 break-words" style={{ overflowWrap: "anywhere" }}>
                            No report returned from the API.
                          </p>
                        );
                      }

                      return sections.map((section, idx) => (
                      <section key={idx} className="space-y-4">
                        {section.title && (
                          <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-cyan-300">
                              {section.title}
                            </h3>
                            <div className="h-px bg-white/10" />
                          </div>
                        )}
                        {renderSectionContent(section.lines)}
                      </section>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              <button
                onClick={resetResearch}
                className="glassmorphism inline-flex items-center justify-center px-8 py-4 text-white font-semibold rounded-lg neon-glow cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300"
              >
                New Research
              </button>

              <p className="mt-6 text-gray-400 italic animate-pulse">
                “Curiosity is the engine of discovery.”
              </p>
            </div>
          </ScrollReveal>
        )}
      </div>

      {/* Scroll Progress */}
      <ScrollProgress />

      {/* Footer */}
      <footer className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm z-20">
        AutoResearchX • Autonomous AI Research System
      </footer>
    </div>
  );
};

export default Home;
