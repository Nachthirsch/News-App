import React from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaBookmark, FaGlobeAsia, FaNewspaper, FaArrowRight } from "react-icons/fa";
import "../styles/animations.css"; // Import the animations file
import Hero from "../components/Hero-Home"; // Import the Hero component

const Home = () => {
  // Check for dark mode preference
  const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  return (
    <div className="container mx-auto px-4 py-20 max-w-7xl">
      {/* Hero Section - Enhanced with animation from white/gray to blue gradient */}
      <Hero />

      {/* Features Section - Artistic Redesign */}
      <section className="mb-28 relative overflow-hidden">
        {/* Decorative elements - changed to squares instead of circles */}
        <div className="absolute top-10 left-0 w-24 h-24 bg-blue-500/10 blur-xl -z-10"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 blur-xl -z-10"></div>
        <div className="absolute top-40 right-0 w-20 h-20 border-2 border-dashed border-blue-300/30 -z-10"></div>

        <h2 className="text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-blue-600 dark:from-blue-300 dark:to-purple-300">Discover What You Can Do</h2>

        <div className="flex flex-col items-center space-y-16 md:space-y-0 md:items-start relative">
          {/* Feature 1 - Fixed positioning to prevent overflow */}
          <div className="group w-full md:w-11/12 md:ml-auto flex flex-col md:flex-row items-center bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 p-8 shadow-xl hover:shadow-2xl transition duration-500 border border-blue-100/50 dark:border-blue-500/10 overflow-hidden relative z-10">
            <div className="absolute top-0 left-0 w-full h-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 -z-10 group-hover:scale-150 transition-transform duration-700"></div>

            <div className="mb-6 md:mb-0 md:mr-8 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
              <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-4xl shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <FaSearch className="transform -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
              </div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">Advanced Search</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-xl">Find articles using keywords, date ranges, and multiple filters. Search by desk, section, author, and more using the powerful NYT Article Search API.</p>
            </div>
          </div>

          {/* Feature 2 - Fixed positioning to prevent overflow */}
          <div className="group w-full md:w-11/12 md:mr-auto flex flex-col md:flex-row-reverse items-center bg-gradient-to-bl from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-950 p-8 shadow-xl hover:shadow-2xl transition duration-500 border border-indigo-100/50 dark:border-indigo-500/10 overflow-hidden relative z-20">
            <div className="absolute top-0 left-0 w-full h-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 -z-10 group-hover:scale-150 transition-transform duration-700"></div>

            <div className="mb-6 md:mb-0 md:ml-8 transform transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3">
              <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-4xl shadow-lg -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <FaGlobeAsia className="transform rotate-12 group-hover:rotate-0 transition-transform duration-500" />
              </div>
            </div>

            <div className="text-center md:text-right">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">Indonesia Focus</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-xl">Access curated international news with a special focus on Indonesia. Stay updated with the latest developments relevant to the region.</p>
            </div>
          </div>

          {/* Feature 3 - Fixed positioning to prevent overflow */}
          <div className="group w-full md:w-11/12 md:ml-auto flex flex-col md:flex-row items-center bg-gradient-to-tr from-white to-purple-50 dark:from-gray-800 dark:to-purple-950 p-8 shadow-xl hover:shadow-2xl transition duration-500 border border-purple-100/50 dark:border-purple-500/10 overflow-hidden relative z-10">
            <div className="absolute top-0 left-0 w-full h-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 -z-10 group-hover:scale-150 transition-transform duration-700"></div>

            <div className="mb-6 md:mb-0 md:mr-8 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
              <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600 text-white text-4xl shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <FaBookmark className="transform -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
              </div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">Save Articles</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-xl">Bookmark your favorite articles to read later and create your personal news collection. Access your saved articles anytime, even offline.</p>
            </div>
          </div>
        </div>
      </section>

      {/* API Information Section - Enhanced with better styling */}
      <section className="mb-20">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800/80 dark:to-gray-800/50 rounded-2xl p-10 shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Powered by The New York Times</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-xl leading-relaxed">This application uses the NYT Article Search API to provide you with high-quality journalism and reporting from one of the world's most respected news sources.</p>
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="bg-white dark:bg-gray-800 p-7 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-200">Rich Content Types</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">Access various content types including news articles, reviews, opinion pieces, interviews, and multimedia content.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-7 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-200">Comprehensive Coverage</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">Browse through decades of journalism spanning politics, business, arts, science, sports, and more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section - Completely redesigned with zigzag timeline */}
      <section className="mb-28 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute w-full h-full">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-[150%] h-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent transform -rotate-6"></div>
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-[150%] h-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent transform rotate-6"></div>
        </div>

        <h2 className="text-5xl font-bold mb-20 text-center relative">
          <span className="relative z-10 font-extrabold tracking-tight">
            <span className="bg-white dark:bg-gray-900 px-6 text-black dark:text-white">HOW TO</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500 mt-2 inline-block">GET STARTED</span>
          </span>
        </h2>

        <div className="relative max-w-4xl mx-auto">
          {/* Central vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-600"></div>

          {/* Step 1 - Left side */}
          <div className="relative mb-24">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-[calc(50%-2rem)] md:pr-12 md:text-right order-2 md:order-1">
                <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3 group-hover:text-blue-600 transition-colors duration-300">Navigate</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">Choose between Indonesia news or use the search function to find specific topics.</p>
              </div>

              <div className="flex justify-center items-center order-1 md:order-2 mb-6 md:mb-0">
                <div className="relative w-20 h-20 flex items-center justify-center z-10 bg-white dark:bg-gray-900 border-4 border-blue-500">
                  <div className="absolute -inset-3 bg-blue-500/10 transform rotate-45"></div>
                  <span className="font-mono text-5xl font-black text-blue-500">1</span>
                </div>
              </div>

              <div className="w-full md:w-[calc(50%-2rem)] md:pl-12 hidden md:block order-3">{/* Empty div for layout */}</div>
            </div>
          </div>

          {/* Step 2 - Right side */}
          <div className="relative mb-24">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-[calc(50%-2rem)] md:pr-12 hidden md:block order-1">{/* Empty div for layout */}</div>

              <div className="flex justify-center items-center order-1 md:order-2 mb-6 md:mb-0">
                <div className="relative w-20 h-20 flex items-center justify-center z-10 bg-white dark:bg-gray-900 border-4 border-indigo-500">
                  <div className="absolute -inset-3 bg-indigo-500/10 transform -rotate-45"></div>
                  <span className="font-mono text-5xl font-black text-indigo-500">2</span>
                </div>
              </div>

              <div className="w-full md:w-[calc(50%-2rem)] md:pl-12 md:text-left order-2 md:order-3">
                <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3 group-hover:text-indigo-600 transition-colors duration-300">Discover</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">Browse through articles and use filters to find exactly what you're looking for.</p>
              </div>
            </div>
          </div>

          {/* Step 3 - Left side */}
          <div className="relative">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-[calc(50%-2rem)] md:pr-12 md:text-right order-2 md:order-1">
                <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3 group-hover:text-purple-600 transition-colors duration-300">Save</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">Bookmark interesting articles to build your personal reading list for later.</p>
              </div>

              <div className="flex justify-center items-center order-1 md:order-2 mb-6 md:mb-0">
                <div className="relative w-20 h-20 flex items-center justify-center z-10 bg-white dark:bg-gray-900 border-4 border-purple-500">
                  <div className="absolute -inset-3 bg-purple-500/10 transform rotate-45"></div>
                  <span className="font-mono text-5xl font-black text-purple-500">3</span>
                </div>
              </div>

              <div className="w-full md:w-[calc(50%-2rem)] md:pl-12 hidden md:block order-3">{/* Empty div for layout */}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Completely redesigned with asymmetrical split layout */}
      <section className="mb-24">
        <div className="relative overflow-hidden border border-indigo-200/30 dark:border-indigo-800/30">
          {/* Abstract geometric background elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/5 to-indigo-900/5 dark:from-black/20 dark:to-indigo-900/20 -z-10"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-indigo-600 -z-10 transform translate-x-1/4 translate-y-1/4"></div>
          <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-purple-500 -z-10 transform -translate-x-1/4 -translate-y-1/4"></div>

          {/* Main content grid */}
          <div className="grid md:grid-cols-12 min-h-[420px]">
            {/* Left column - Typography focused */}
            <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center items-start relative">
              <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-indigo-600 via-purple-600 to-blue-600 hidden md:block"></div>

              {/* Layered typography */}
              <div className="relative mb-8">
                <span className="absolute -top-14 -left-3 text-[140px] font-black text-indigo-50 dark:text-indigo-950 select-none leading-none opacity-70">GO</span>
                <h2 className="text-5xl md:text-6xl font-black text-indigo-900 dark:text-white relative mb-6 tracking-tight leading-none">
                  READY TO
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">EXPLORE?</span>
                </h2>
              </div>

              <p className="text-xl text-gray-700 dark:text-gray-300 mb-10 md:max-w-lg z-10 bg-white/80 dark:bg-gray-900/80 p-4">Start your journey through the latest news and in-depth journalism from around the world.</p>
            </div>

            {/* Right column - Button focused */}
            <div className="md:col-span-5 flex flex-col justify-center items-center p-8 md:p-0 relative">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-indigo-500 hidden md:block"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-purple-500 hidden md:block"></div>

              {/* Action buttons */}
              <div className="flex flex-col gap-6 w-full max-w-xs">
                <Link to="/search" className="group">
                  <div className="bg-white hover:bg-indigo-50 dark:bg-indigo-900 dark:hover:bg-indigo-800 p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative">
                    <div className="absolute top-0 left-0 w-0 h-full bg-indigo-600 group-hover:w-1 transition-all duration-300"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-indigo-600 dark:text-indigo-300">Search Articles</span>
                      <FaArrowRight className="text-indigo-600 dark:text-indigo-300 transform group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>

                <Link to="/saved" className="group">
                  <div className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative">
                    <div className="absolute top-0 left-0 w-0 h-full bg-purple-600 group-hover:w-1 transition-all duration-300"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-white">View Saved Articles</span>
                      <FaArrowRight className="text-white transform group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Diagonal decorative separator */}
          <div className="h-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 transform -skew-y-1"></div>
        </div>
      </section>

      {/* Footer note */}
      <div className="text-center text-gray-500 dark:text-gray-400 text-sm pb-6">
        <p>Powered by the New York Times Article Search API &copy; {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default Home;
