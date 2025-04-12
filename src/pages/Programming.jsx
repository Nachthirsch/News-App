import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProgrammingNews, saveNews, unsaveNews, resetPageState } from "../store/slices/newsSlice";
import NewsGrid from "../components/NewsGrid";
import LoadingSpinner from "../components/LoadingSpinner";

const Programming = () => {
  const dispatch = useDispatch();
  const { programmingNews, savedNews, loading, error, currentPage } = useSelector((state) => state.news);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    // Reset page state and fetch initial programming news on component mount
    dispatch(resetPageState("programming"));
    dispatch(fetchProgrammingNews({ page: 0, isNewFetch: true }));

    console.log("Attempting to fetch Programming news");
  }, [dispatch]);

  useEffect(() => {
    // Log the news data when it changes
    console.log("Programming news data:", programmingNews);
  }, [programmingNews]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    const nextPage = currentPage.programming + 1;
    dispatch(fetchProgrammingNews({ page: nextPage, isNewFetch: false })).finally(() => {
      setLoadingMore(false);
    });
  };

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

      {/* Show skeleton loading state or news content */}
      {loading && currentPage.programming === 0 ? (
        <NewsGrid news={[]} onSave={handleSave} savedNews={savedNews} isLoading={true} />
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : programmingNews.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 py-8">No programming news available at the moment.</div>
      ) : (
        <>
          <NewsGrid news={programmingNews} onSave={handleSave} savedNews={savedNews} />

          {/* Load More Button */}
          {programmingNews.length >= 10 && (
            <div className="flex justify-center mt-8 mb-12">
              <button onClick={handleLoadMore} disabled={loadingMore} className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow transition duration-200 disabled:opacity-50">
                {loadingMore ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⟳</span>
                    Loading...
                  </>
                ) : (
                  "Load More Articles"
                )}
              </button>
            </div>
          )}

          {/* Show spinner when loading more */}
          {loadingMore && (
            <div className="flex justify-center mt-4">
              <LoadingSpinner />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Programming;
