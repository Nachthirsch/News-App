import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { Link } from "react-router-dom";
import { FaSearch, FaGlobeAsia } from "react-icons/fa";

const AnimatedHero = () => {
  // Check for dark mode preference
  const [isDarkMode, setIsDarkMode] = useState(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Listen for changes in color scheme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Simplified and stable animation that won't cause string interpolation issues
  const gradientProps = useSpring({
    from: {
      transform: "scale(0.98)",
      opacity: 0.9,
    },
    to: {
      transform: "scale(1)",
      opacity: 1,
    },
    config: {
      tension: 120,
      friction: 14,
    },
    loop: { reverse: true },
  });

  // Text animations
  const textProps1 = useSpring({
    from: { opacity: 0, transform: "translateY(15px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    delay: 800,
    config: { tension: 280, friction: 18 },
  });

  const textProps2 = useSpring({
    from: { opacity: 0, transform: "translateY(15px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    delay: 1200,
    config: { tension: 280, friction: 18 },
  });

  const textProps3 = useSpring({
    from: { opacity: 0, transform: "translateY(15px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    delay: 1600,
    config: { tension: 280, friction: 18 },
  });

  // Create the gradient using CSS classes instead of dynamic background-image
  const gradientClass = isDarkMode ? "bg-gradient-to-br from-gray-800 via-blue-900 to-gray-900" : "bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800";

  return (
    <animated.section style={gradientProps} className={`${gradientClass} rounded-2xl shadow-xl p-10 mb-16 overflow-hidden transition-all duration-500`}>
      <div className="max-w-3xl mx-auto text-center">
        <animated.h1 style={textProps1} className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Your Gateway to <span className="text-blue-200">Global News</span>
        </animated.h1>

        <animated.p style={textProps2} className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed">
          Access the latest articles from The New York Times with powerful search and personalization features
        </animated.p>

        <animated.div style={textProps3} className="flex flex-col sm:flex-row justify-center gap-5">
          <Link to="/search" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold transition duration-300 flex items-center justify-center text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <FaSearch className="mr-3" /> Start Searching
          </Link>
          <Link to="/indonesia" className="bg-blue-800 text-white hover:bg-blue-900 px-8 py-4 rounded-xl font-semibold transition duration-300 flex items-center justify-center text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <FaGlobeAsia className="mr-3" /> Indonesia News
          </Link>
        </animated.div>
      </div>
    </animated.section>
  );
};

export default AnimatedHero;
