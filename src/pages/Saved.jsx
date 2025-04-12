import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { unsaveNews } from "../store/slices/newsSlice";
import NewsGrid from "../components/NewsGrid";

const Saved = () => {
  const dispatch = useDispatch();
  const { savedNews } = useSelector((state) => state.news);

  const handleUnsave = (article) => {
    dispatch(unsaveNews(article));
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      {/* Header with gradient background */}
      <div className="relative mb-12 pb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 opacity-50 rounded-xl h-32 w-full"></div>

        <div className="relative pt-8 px-8">
          <h1 className="text-4xl font-extrabold mb-3 text-gray-900 dark:text-white tracking-tight">Saved Articles</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">Your curated collection of saved articles from various categories</p>
        </div>
      </div>

      {savedNews.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-12 text-center border border-gray-100 dark:border-gray-700 max-w-3xl mx-auto transform transition-all duration-300 hover:shadow-2xl">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-blue-50 dark:bg-gray-700 mb-8">
            <svg className="h-12 w-12 text-blue-500 dark:text-blue-400" fill="none" strokeCurrentColor viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No saved articles yet</h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto leading-relaxed mb-2">Articles you save will appear here. Click the "Save" button on any article to add it to your collection.</p>
          <p className="text-blue-500 dark:text-blue-400 text-sm font-medium mt-6">Start exploring to find articles worth saving</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Stats card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center justify-between border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-700 flex items-center justify-center mr-4">
                <svg className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Your Collection</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {savedNews.length} {savedNews.length === 1 ? "Article" : "Articles"}
                </p>
              </div>
            </div>
          </div>

          {/* News grid with a beautiful wrapper */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 shadow-sm">
            <NewsGrid news={savedNews} onSave={handleUnsave} savedNews={savedNews} />
          </div>
        </div>
      )}

      {/* Footer note with styled info box */}
      <div className="mt-12 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-blue-50 dark:bg-gray-900 px-4 py-3 flex items-center border-l-4 border-blue-500">
          <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Saved articles are stored in your browser and will be cleared when you clear your browser data.</p>
        </div>
      </div>
    </div>
  );
};

export default Saved;
