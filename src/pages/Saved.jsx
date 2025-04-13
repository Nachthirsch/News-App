import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { unsaveNews } from "../store/slices/newsSlice";
import NewsGrid from "../components/NewsGrid";
import { motion, AnimatePresence } from "framer-motion";

const Saved = () => {
  const dispatch = useDispatch();
  const { savedNews } = useSelector((state) => state.news);

  const handleUnsave = (article) => {
    dispatch(unsaveNews(article));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header with gradient background */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative mb-12 pb-10 pt-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900/20 z-0"></div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden opacity-30 dark:opacity-10 z-0">
          <div className="absolute right-0 top-0 -rotate-12 transform translate-x-1/3 -translate-y-1/4">
            <svg width="400" height="400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-500" />
            </svg>
          </div>
          <div className="absolute left-0 bottom-0 rotate-12 transform -translate-x-1/3 translate-y-1/4">
            <svg width="300" height="300" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-indigo-500" />
            </svg>
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-6 pt-16 max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="relative px-4 sm:px-8">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-4 shadow-sm">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Saved</span> Articles
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl ml-12 font-light">Your curated collection of saved articles from various categories</p>
          </motion.div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 max-w-6xl pb-16">
        <AnimatePresence mode="wait">
          {savedNews.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center border border-gray-100 dark:border-gray-700 max-w-3xl mx-auto transform hover:shadow-2xl transition-all duration-300">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-md"></div>
                  <div className="relative inline-flex items-center justify-center h-24 w-24 rounded-full bg-blue-50 dark:bg-gray-700 mb-8 shadow-inner">
                    <svg className="h-12 w-12 text-blue-500 dark:text-blue-400" fill="none" strokeCurrentColor viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No saved articles yet</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto leading-relaxed mb-2">Articles you save will appear here. Click the "Save" button on any article to add it to your collection.</p>
                <div className="relative mt-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20 blur-sm rounded-lg"></div>
                  <p className="relative text-blue-600 dark:text-blue-400 text-sm font-medium py-2">Start exploring to find articles worth saving</p>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-10">
              {/* Stats card */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="flex items-center p-6">
                  <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 mr-5 shadow-sm">
                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Your Collection</p>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{savedNews.length}</p>
                      <p className="ml-2 text-gray-600 dark:text-gray-300 font-medium">{savedNews.length === 1 ? "Saved Article" : "Saved Articles"}</p>
                    </div>
                  </div>
                </div>
                <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              </motion.div>

              {/* News grid with a beautiful wrapper */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700/50">
                <NewsGrid news={savedNews} onSave={handleUnsave} savedNews={savedNews} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer note with styled info box */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="mt-12 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-blue-50 dark:bg-gray-800 px-5 py-4 flex items-center border-l-4 border-blue-500">
            <svg className="flex-shrink-0 w-5 h-5 text-blue-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-gray-700 dark:text-gray-300">Saved articles are stored in your browser and will be cleared when you clear your browser data.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Saved;
