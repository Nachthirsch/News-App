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
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Saved Articles</h1>
        <p className="text-gray-600 dark:text-gray-400">Your collection of saved articles from various categories</p>
      </div>

      {savedNews.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" strokeCurrentColor viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No saved articles yet</h3>
          <p className="text-gray-600 dark:text-gray-400">Articles you save will appear here. Click the "Save" button on any article to add it to your collection.</p>
        </div>
      ) : (
        <div>
          <div className="mb-4 text-gray-600 dark:text-gray-400">
            {savedNews.length} {savedNews.length === 1 ? "article" : "articles"} saved
          </div>
          <NewsGrid news={savedNews} onSave={handleUnsave} savedNews={savedNews} />
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Note: Saved articles are stored in your browser and will be cleared when you clear your browser data.</p>
      </div>
    </div>
  );
};

export default Saved;
