import React from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaBookmark, FaGlobeAsia } from "react-icons/fa";

const Home = () => {
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-5">
      {/* Hero Section - Full Screen */}
      <section className="min-h-screen flex flex-col justify-center py-16">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-neutral-800 dark:text-neutral-100">
            Access quality journalism
            <span className="block mt-1 text-neutral-500 dark:text-neutral-400">crafted for readers</span>
          </h1>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-10 max-w-xl">Read news that matters from The New York Times with focus on Indonesia, Programming and global topics</p>

          {/* Simplified CTA */}
          <div className="flex flex-col sm:flex-row gap-6">
            <Link
              to="/search"
              className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-800 
                         dark:hover:bg-neutral-700 text-white font-medium"
            >
              Start exploring
            </Link>
            <Link
              to="/indonesia"
              className="px-6 py-3 border border-neutral-300 dark:border-neutral-700
                         text-neutral-800 dark:text-neutral-200 font-medium 
                         hover:border-neutral-900 dark:hover:border-neutral-500"
            >
              Local news
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Full Screen */}
      <section className="min-h-screen flex flex-col justify-center border-t border-neutral-200 dark:border-neutral-800 py-16">
        <h2 className="text-2xl font-medium mb-16 text-neutral-800 dark:text-neutral-100">Key features</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 my-auto">
          {/* Feature 1 */}
          <div>
            <div className="flex items-start mb-4">
              <FaSearch className="mt-1 mr-4 w-5 h-5 text-neutral-700 dark:text-neutral-400" />
              <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">Advanced Search</h3>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 ml-9">Find content with precision using multiple filters and keywords</p>
          </div>

          {/* Feature 2 */}
          <div>
            <div className="flex items-start mb-4">
              <FaGlobeAsia className="mt-1 mr-4 w-5 h-5 text-neutral-700 dark:text-neutral-400" />
              <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">Indonesia Focus</h3>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 ml-9">Curated news with emphasis on Indonesia and Programming news and the surrounding region</p>
          </div>

          {/* Feature 3 */}
          <div>
            <div className="flex items-start mb-4">
              <FaBookmark className="mt-1 mr-4 w-5 h-5 text-neutral-700 dark:text-neutral-400" />
              <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">Save Articles</h3>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 ml-9">Build your reading collection for future reference</p>
          </div>
        </div>
      </section>

      {/* How It Works - Full Screen */}
      <section className="min-h-screen flex flex-col justify-center border-t border-neutral-200 dark:border-neutral-800 py-16">
        <h2 className="text-2xl font-medium mb-16 text-neutral-800 dark:text-neutral-100">How it works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-auto">
          <div>
            <span className="block text-5xl font-light text-neutral-400 dark:text-neutral-600 mb-4">01</span>
            <p className="text-neutral-600 dark:text-neutral-400">Choose between Indonesia news or Programming news and search for specific topics</p>
          </div>

          <div>
            <span className="block text-5xl font-light text-neutral-400 dark:text-neutral-600 mb-4">02</span>
            <p className="text-neutral-600 dark:text-neutral-400">Browse articles and apply filters to refine results</p>
          </div>

          <div>
            <span className="block text-5xl font-light text-neutral-400 dark:text-neutral-600 mb-4">03</span>
            <p className="text-neutral-600 dark:text-neutral-400">Save interesting articles to your personal reading list</p>
          </div>
        </div>
      </section>

      {/* CTA Section - Full Screen */}
      <section className="min-h-screen flex flex-col justify-center border-t border-neutral-200 dark:border-neutral-800 py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between my-auto">
          <h2 className="text-3xl font-medium text-neutral-800 dark:text-neutral-100 mb-8 md:mb-0">Ready to explore?</h2>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/search" className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white font-medium">
              Search articles
            </Link>
            <Link to="/saved" className="px-6 py-3 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-500 text-neutral-800 dark:text-neutral-200 font-medium">
              View saved
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
