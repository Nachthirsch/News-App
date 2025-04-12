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
      {/* Features Section - Enhanced with deeper shadows and better spacing */}
      <section className="mb-20">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-200">Discover What You Can Do</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {/* Feature 1 - Enhanced card design */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
            <div className="text-blue-500 text-4xl mb-6 flex justify-center">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <FaSearch />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">Advanced Search</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">Find articles using keywords, date ranges, and multiple filters. Search by desk, section, author, and more using the powerful NYT Article Search API.</p>
          </div>

          {/* Feature 2 - Enhanced card design */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
            <div className="text-blue-500 text-4xl mb-6 flex justify-center">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <FaGlobeAsia />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">Indonesia Focus</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">Access curated international news with a special focus on Indonesia. Stay updated with the latest developments relevant to the region.</p>
          </div>

          {/* Feature 3 - Enhanced card design */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
            <div className="text-blue-500 text-4xl mb-6 flex justify-center">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <FaBookmark />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">Save Articles</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">Bookmark your favorite articles to read later and create your personal news collection. Access your saved articles anytime, even offline.</p>
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

      {/* Getting Started Section - Enhanced with visual improvements */}
      <section className="mb-20">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-800 dark:text-gray-200">How to Get Started</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg">1</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Navigate</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">Choose between Indonesia news or use the search function to find specific topics.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg">2</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Discover</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">Browse through articles and use filters to find exactly what you're looking for.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg">3</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Save</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">Bookmark interesting articles to build your personal reading list for later.</p>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced with better visual appeal */}
      <section className="text-center mb-16">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-12 shadow-xl">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Explore?</h2>
          <p className="text-2xl text-indigo-100 mb-10 max-w-3xl mx-auto leading-relaxed">Start your journey through the latest news and in-depth journalism from around the world.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/search" className="bg-white text-indigo-600 hover:bg-indigo-50 px-10 py-4 rounded-xl font-semibold transition duration-300 text-lg shadow-lg hover:shadow-xl flex items-center justify-center transform hover:-translate-y-1">
              Search Articles <FaArrowRight className="ml-3" />
            </Link>
            <Link to="/saved" className="bg-indigo-800 text-white hover:bg-indigo-900 px-10 py-4 rounded-xl font-semibold transition duration-300 text-lg shadow-lg hover:shadow-xl flex items-center justify-center transform hover:-translate-y-1">
              View Saved Articles <FaArrowRight className="ml-3" />
            </Link>
          </div>
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
