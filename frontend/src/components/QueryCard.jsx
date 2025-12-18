import React, { useState, useRef } from "react";
import { useTiltEffect } from "../hooks/useCursor";

const QueryCard = ({
  query,
  setQuery,
  onSubmit,
  isLoading = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const cardRef = useRef(null);
  const tilt = useTiltEffect(cardRef, 0.8);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    // IMPORTANT: do NOT pass query
    // App.jsx already owns the query state
    if (typeof onSubmit === "function") {
      onSubmit();
    }
  };

  return (
    <div
      ref={cardRef}
      className="relative z-30 mx-auto max-w-2xl animate-fade-in"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      <form onSubmit={handleSubmit} className="relative">
        <div
          className="glassmorphism p-6 relative overflow-hidden"
          style={{
            boxShadow: isFocused
              ? "0 0 30px rgba(0, 255, 255, 0.3), 0 0 60px rgba(0, 255, 255, 0.1)"
              : "0 0 20px rgba(0, 255, 255, 0.1)",
            transition: "all 0.3s ease",
          }}
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-20 blur-xl pointer-events-none" />

          <div className="relative z-10">
            {/* Input */}
            <div className="relative mb-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="What would you like to research?"
                className="w-full bg-transparent border-2 border-transparent border-b-cyan-400/30 focus:border-b-cyan-400 text-white placeholder-gray-400 text-lg py-3 px-2 outline-none transition-all duration-300"
                disabled={isLoading}
              />

              <div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500"
                style={{
                  width: isFocused ? "100%" : "0%",
                  transition: "width 0.3s ease",
                }}
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold text-lg rounded-lg relative overflow-hidden transition-all duration-300 disabled:opacity-50 group"
              style={{
                transform: "translateZ(20px)",
                boxShadow: "0 10px 30px rgba(0, 255, 255, 0.3)",
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                  Researching...
                </div>
              ) : (
                "Begin Research"
              )}
            </button>

            {/* Button glow */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 blur-lg pointer-events-none"
              style={{
                opacity: isFocused ? 0.3 : 0,
                transition: "opacity 0.3s ease",
              }}
            />
          </div>
        </div>
      </form>

      {/* Example Queries */}
      <div
        className="mt-6 text-center"
        style={{
          opacity: isFocused ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        <p className="text-gray-400 text-sm mb-3">Try asking about:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "Quantum computing applications",
            "Climate change solutions",
            "Space exploration",
            "AI ethics",
          ].map((example, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setQuery(example)}
              className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-gray-300 rounded-full border border-white/20 transition-all duration-200 hover:scale-105"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueryCard;
