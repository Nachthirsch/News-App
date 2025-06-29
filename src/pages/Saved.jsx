import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { unsaveNews } from "../store/slices/newsSlice";
import NewsGrid from "../components/NewsGrid";
import { motion } from "framer-motion";

const Saved = () => {
  const dispatch = useDispatch();
  const { savedNews } = useSelector((state) => state.news);

  const handleUnsave = (article) => {
    dispatch(unsaveNews(article));
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-6">
      {/* Simple Header Section */}
      <section className="pt-32 pb-8">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">Saved Articles</h1>
        <p className="text-neutral-600 dark:text-neutral-400">Your personal collection of saved news articles</p>
        {savedNews.length > 0 && (
          <div className="mt-6 text-sm text-neutral-500 dark:text-neutral-500">
            {savedNews.length} {savedNews.length === 1 ? "article" : "articles"} saved
          </div>
        )}
      </section>

      {/* Content Section */}
      <section className="py-8 border-t border-neutral-200 dark:border-neutral-800">
        {savedNews.length === 0 ? (
          <div className="py-16 text-center">
            <div className="inline-flex items-center justify-center mb-6 w-16 h-16 bg-neutral-100 dark:bg-neutral-800">
              <svg className="w-6 h-6 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-neutral-800 dark:text-neutral-100 mb-4">No saved articles</h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">Articles you save will appear here. Click the save icon on any article to add it to your collection.</p>
          </div>
        ) : (
          <div>
            <NewsGrid news={savedNews} onSave={handleUnsave} savedNews={savedNews} />
          </div>
        )}
      </section>

      {/* Footer note */}
      <div className="py-8 text-neutral-500 dark:text-neutral-500 text-sm text-center border-t border-neutral-200 dark:border-neutral-800 mt-8">
        <p>Saved articles are stored in your browser's local storage</p>
      </div>
    </div>
  );
};

export default Saved;
