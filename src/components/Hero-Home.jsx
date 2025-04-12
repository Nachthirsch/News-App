import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { Link } from "react-router-dom";
import { FaSearch, FaGlobeAsia } from "react-icons/fa";

const AnimatedHero = ({ children }) => {
  // Check for dark mode preference
  const [isDarkMode, setIsDarkMode] = useState(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Listen for changes in color scheme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Define the gradient animation with more steps to match CSS
  const gradientProps = useSpring({
    from: {
      backgroundImage: isDarkMode ? "linear-gradient(to right, #1f2937, #1f2937)" : "linear-gradient(to right, #ffffff, #ffffff)",
      backgroundSize: "300% 300%",
      backgroundPosition: "center",
      scale: 0.98,
      opacity: 0.9,
    },
    to: async (next) => {
      // Step 0 - Hold the solid color with no blue for a moment
      await next({
        backgroundImage: isDarkMode ? "linear-gradient(to right, #1f2937, #1f2937)" : "linear-gradient(to right, #ffffff, #ffffff)",
        config: { duration: 300 },
      });

      // Step 1 (5% in CSS)
      await next({
        backgroundImage: isDarkMode ? "radial-gradient(100% 100% at 50% 50%, #3b82f6 2%, #1f2937 90%)" : "radial-gradient(100% 100% at 50% 50%, #3b82f6 2%, #ffffff 90%)",
        config: { duration: 150 },
      });

      // Step 2 (10% in CSS)
      await next({
        backgroundImage: isDarkMode ? "radial-gradient(130% 130% at 50% 50%, #3b82f6 4%, #4338ca 5%, #1f2937 88%)" : "radial-gradient(130% 130% at 50% 50%, #3b82f6 4%, #4338ca 5%, #ffffff 88%)",
        config: { duration: 150 },
      });

      // Step 3 (15% in CSS)
      await next({
        backgroundImage: isDarkMode ? "radial-gradient(150% 150% at 50% 50%, #3b82f6 6%, #4338ca 10%, #1f2937 85%)" : "radial-gradient(150% 150% at 50% 50%, #3b82f6 6%, #4338ca 10%, #ffffff 85%)",
        config: { duration: 150 },
      });

      // Step 4 (20% in CSS)
      await next({
        backgroundImage: isDarkMode ? "radial-gradient(170% 170% at 50% 50%, #3b82f6 8%, #4338ca 15%, #6366f1 20%, #1f2937 80%)" : "radial-gradient(170% 170% at 50% 50%, #3b82f6 8%, #4338ca 15%, #6366f1 20%, #ffffff 80%)",
        config: { duration: 150 },
      });

      // Step 5 (25% in CSS)
      await next({
        backgroundImage: isDarkMode ? "radial-gradient(180% 180% at 50% 50%, #3b82f6 10%, #4338ca 20%, #6366f1 30%, #1f2937 75%)" : "radial-gradient(180% 180% at 50% 50%, #3b82f6 10%, #4338ca 20%, #6366f1 30%, #ffffff 75%)",
        config: { duration: 150 },
      });

      // Step 6 (30% in CSS)
      await next({
        backgroundImage: isDarkMode ? "radial-gradient(190% 190% at 50% 50%, #3b82f6 12%, #4338ca 25%, #6366f1 35%, #1f2937 70%)" : "radial-gradient(190% 190% at 50% 50%, #3b82f6 12%, #4338ca 25%, #6366f1 35%, #ffffff 70%)",
        config: { duration: 150 },
      });

      // Step 7 (35% in CSS)
      await next({
        backgroundImage: isDarkMode ? "radial-gradient(200% 200% at 50% 50%, #3b82f6 14%, #4338ca 30%, #6366f1 40%, #383e54 60%, #1f2937 70%)" : "radial-gradient(200% 200% at 50% 50%, #3b82f6 14%, #4338ca 30%, #6366f1 40%, #5352ab 60%, #ffffff 70%)",
        opacity: 0.95,
        config: { duration: 150 },
      });

      // Step 8 (40% in CSS)
      await next({
        backgroundImage: isDarkMode ? "radial-gradient(210% 210% at 50% 50%, #3b82f6 16%, #4338ca 35%, #6366f1 45%, #383e54 65%, #1f2937 68%)" : "radial-gradient(210% 210% at 50% 50%, #3b82f6 16%, #4338ca 35%, #6366f1 45%, #5352ab 65%, #ffffff 68%)",
        config: { duration: 150 },
      });

      // Step 9 (50% in CSS)
      await next({
        backgroundImage: isDarkMode ? "radial-gradient(220% 220% at 50% 50%, #3b82f6 18%, #4338ca 40%, #383e54 70%, #4f46e5 85%)" : "radial-gradient(220% 220% at 50% 50%, #3b82f6 18%, #4338ca 40%, #5352ab 70%, #4f46e5 85%)",
        scale: 0.99,
        config: { duration: 175 },
      });

      // Step 10 (60% in CSS)
      await next({
        backgroundImage: isDarkMode ? "radial-gradient(230% 230% at 50% 50%, #3b82f6 20%, #4338ca 50%, #4f46e5 90%)" : "radial-gradient(230% 230% at 50% 50%, #3b82f6 20%, #4338ca 50%, #4f46e5 90%)",
        opacity: 1,
        config: { duration: 175 },
      });

      // Step 11 (70% in CSS)
      await next({
        backgroundImage: isDarkMode ? "radial-gradient(240% 240% at 50% 50%, #3b82f6 24%, #4338ca 70%, #4f46e5 92%)" : "radial-gradient(240% 240% at 50% 50%, #3b82f6 24%, #4338ca 70%, #4f46e5 92%)",
        config: { duration: 175 },
      });

      // Step 12 (80% in CSS)
      await next({
        backgroundImage: isDarkMode ? "radial-gradient(250% 250% at 50% 50%, #3b82f6 26%, #4338ca 85%, #4f46e5 95%)" : "radial-gradient(250% 250% at 50% 50%, #3b82f6 26%, #4338ca 85%, #4f46e5 95%)",
        config: { duration: 175 },
      });

      // Step 13 (90% in CSS)
      await next({
        backgroundImage: isDarkMode ? "radial-gradient(265% 265% at 50% 50%, #3b82f6 28%, #4338ca 95%, #4f46e5 98%)" : "radial-gradient(265% 265% at 50% 50%, #3b82f6 28%, #4338ca 95%, #4f46e5 98%)",
        config: { duration: 175 },
      });

      // Final step with full coverage (100% in CSS)
      await next({
        backgroundImage: isDarkMode ? "linear-gradient(135deg, #3b82f6 0%, #4338ca 50%, #4338ca 100%)" : "linear-gradient(135deg, #3b82f6 0%, #4338ca 50%, #4338ca 100%)",
        scale: 1,
        config: { duration: 175 },
      });
    },
    config: { tension: 210, friction: 20, precision: 0.001 },
  });

  // Text animations remain unchanged
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

  return (
    <animated.section
      style={{
        ...gradientProps,
        transformOrigin: "center",
        transform: gradientProps.scale.to((s) => `scale(${s})`),
        willChange: "background, transform, opacity",
        backfaceVisibility: "hidden",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="rounded-2xl shadow-xl p-10 mb-16 overflow-hidden"
    >
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
