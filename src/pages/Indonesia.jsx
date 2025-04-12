import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchIndonesiaNews, saveNews, unsaveNews, resetPageState } from "../store/slices/newsSlice";
import NewsGrid from "../components/NewsGrid";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
  const dispatch = useDispatch();
  const { indonesiaNews, savedNews, loading, error, currentPage } = useSelector((state) => state.news);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    // Reset page state and fetch initial news on component mount
    dispatch(resetPageState("indonesia"));
    dispatch(fetchIndonesiaNews({ page: 0, isNewFetch: true }));

    // Add debugging log to see when fetch is attempted
    console.log("Attempting to fetch Indonesia news");
  }, [dispatch]);

  useEffect(() => {
    // Log the news data when it changes
    console.log("Indonesia news data:", indonesiaNews);
  }, [indonesiaNews]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    const nextPage = currentPage.indonesia + 1;
    dispatch(fetchIndonesiaNews({ page: nextPage, isNewFetch: false })).finally(() => {
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
    <div className="container mx-auto px-4 pt-10 sm:pt-10">
      {loading && currentPage.indonesia === 0 ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : indonesiaNews?.length === 0 ? (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded relative">
          <strong className="font-bold">No news found: </strong>
          <span className="block sm:inline">The API did not return any news articles for Indonesia. This may be due to recent API changes. Try using the search functionality instead.</span>
        </div>
      ) : (
        <>
          <NewsGrid news={indonesiaNews} onSave={handleSave} savedNews={savedNews} />

          {/* Load More Button */}
          {indonesiaNews.length >= 10 && (
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

export default Home;
