import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchSearchNews, saveNews, unsaveNews } from "../store/slices/newsSlice";
import NewsGrid from "../components/NewsGrid";
import LoadingSpinner from "../components/LoadingSpinner";

const Search = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResults, savedNews, loading, error } = useSelector((state) => state.news);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
      dispatch(fetchSearchNews({ query, page: 1 }));
      setHasSearched(true);
    }
  }, [searchParams, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      setPage(1);
      dispatch(fetchSearchNews({ query: searchQuery, page: 1 }));
      setHasSearched(true);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    dispatch(fetchSearchNews({ query: searchQuery, page: nextPage }));
  };

  const handleSave = (article) => {
    const isAlreadySaved = savedNews.some((saved) => saved.headline.main === article.headline.main);

    if (isAlreadySaved) {
      dispatch(unsaveNews(article));
    } else {
      dispatch(saveNews(article));
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchParams({});
    setHasSearched(false);
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Search News</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Search for news articles from around the world</p>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter keywords to search..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 
                rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                placeholder-gray-500 dark:placeholder-gray-400"
            />
            {searchQuery && (
              <button type="button" onClick={handleClearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 
              disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700"
            disabled={loading || !searchQuery.trim()}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Searching...
              </div>
            ) : (
              "Search"
            )}
          </button>
        </form>

        {/* Popular searches */}
        <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Popular searches:</span>
          {["Technology", "Business", "Science", "Health"].map((term) => (
            <button
              key={term}
              onClick={() => {
                setSearchQuery(term);
                setSearchParams({ q: term });
                dispatch(fetchSearchNews({ query: term, page: 1 }));
                setHasSearched(true);
              }}
              className="hover:text-blue-500 dark:hover:text-blue-400 underline"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {loading && page === 1 && (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {hasSearched && !loading && !error && (
        <>
          {searchResults.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found for "{searchQuery}"</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Try different keywords or check your spelling</p>
              <button onClick={handleClearSearch} className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                Clear search
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4 text-gray-600 dark:text-gray-400">
                Found {searchResults.length} results for "{searchQuery}"
              </div>
              <NewsGrid news={searchResults} onSave={handleSave} savedNews={savedNews} />
              {searchResults.length >= 10 && !loading && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                      rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 
                      focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                  >
                    Load More Results
                  </button>
                </div>
              )}
              {loading && page > 1 && (
                <div className="mt-6 text-center">
                  <LoadingSpinner />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
