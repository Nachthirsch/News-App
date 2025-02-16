import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProgrammingNews, saveNews, unsaveNews } from "../store/slices/newsSlice";
import NewsGrid from "../components/NewsGrid";
import LoadingSpinner from "../components/LoadingSpinner";

const Programming = () => {
  const dispatch = useDispatch();
  const { programmingNews, savedNews, loading, error } = useSelector((state) => state.news);

  useEffect(() => {
    dispatch(fetchProgrammingNews());
  }, [dispatch]);

  const handleSave = (article) => {
    const isAlreadySaved = savedNews.some((saved) => saved.web_url === article.web_url);

    if (isAlreadySaved) {
      dispatch(unsaveNews(article));
    } else {
      dispatch(saveNews(article));
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Programming News</h1>
        <p className="text-gray-600 dark:text-gray-400">Latest programming and technology news from around the world</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : programmingNews.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 py-8">No programming news available at the moment.</div>
      ) : (
        <NewsGrid news={programmingNews} onSave={handleSave} savedNews={savedNews} />
      )}
    </div>
  );
};

export default Programming;
