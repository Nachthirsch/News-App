import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchSearchNews, saveNews, unsaveNews, resetPageState } from "../store/slices/newsSlice";
import NewsGrid from "../components/NewsGrid";
import LoadingSpinner from "../components/LoadingSpinner";
import SkeletonNewsCard from "../components/SkeletonNewsCard";
import { motion, AnimatePresence } from "framer-motion";

const Search = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResults, savedNews, loading, error } = useSelector((state) => state.news);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [hasSearched, setHasSearched] = useState(false);
  const currentPage = useSelector((state) => state.news.currentPage.search);
  const [isFocused, setIsFocused] = useState(false);
  const [loadMoreHover, setLoadMoreHover] = useState(false);

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      console.log("Initiating search for:", query);
      setSearchQuery(query);
      dispatch(resetPageState("search")); // Reset page state before new search
      dispatch(fetchSearchNews({ query, page: 0 })); // Use page 0 for initial search
      setHasSearched(true);
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    console.log("Search results:", searchResults);
  }, [searchResults]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Executing search for:", searchQuery);
      setSearchParams({ q: searchQuery });
      dispatch(resetPageState("search")); // Reset page state before new search
      dispatch(fetchSearchNews({ query: searchQuery, page: 0 })); // Use page 0 for initial search
      setHasSearched(true);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
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
    dispatch(resetPageState("search"));
  };

  // Popular search terms with icons
  const popularSearches = [
    { term: "Technology", icon: "💻" },
    { term: "Business", icon: "📊" },
    { term: "Science", icon: "🔬" },
    { term: "Health", icon: "🏥" },
    { term: "Sports", icon: "🏆" },
    { term: "Arts", icon: "🎨" },
  ];

  const heroVariants = {
    expanded: {
      paddingTop: "10rem",
      paddingBottom: "11.5rem",
    },
    compact: {
      paddingTop: "5rem",
      paddingBottom: "4rem",
    },
  };

  // Add a new function to render skeleton cards
  const renderSkeletonCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
            <SkeletonNewsCard />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Search Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{
          opacity: 1,
          y: 0,
          ...(hasSearched && searchResults.length > 0 ? heroVariants.compact : heroVariants.expanded),
        }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900/20 z-0"></div>

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

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.div
            className="text-center"
            animate={{
              scale: hasSearched && searchResults.length > 0 ? 0.92 : 1,
              marginBottom: hasSearched && searchResults.length > 0 ? "1rem" : "2rem",
            }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="font-bold text-gray-900 dark:text-white"
              animate={{
                fontSize: hasSearched && searchResults.length > 0 ? "1.875rem" : "3rem",
              }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Discover News</span> That Matters
            </motion.h1>

            <AnimatePresence>
              {(!hasSearched || searchResults.length === 0) && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="mt-3 max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300">
                  Search for breaking news, articles, and stories from trusted sources worldwide
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div layout className="max-w-3xl mx-auto" animate={{ y: hasSearched && searchResults.length > 0 ? 0 : 10 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <form onSubmit={handleSearch} className="relative z-10">
              <div className={`flex flex-col md:flex-row md:items-center gap-3 ${isFocused ? "scale-[1.02]" : "scale-100"} transition-all duration-300`}>
                <div className="relative flex-1 group">
                  <div className={`absolute inset-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg ${isFocused ? "shadow-blue-200 dark:shadow-blue-900/30" : ""} transition-all duration-300`}></div>

                  <div className="relative flex items-center">
                    <div className="pl-4 py-1">
                      <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>

                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} placeholder="What news are you looking for?" className="w-full px-4 py-3.5 bg-transparent border-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0 text-base md:text-lg" />

                    {searchQuery && (
                      <button type="button" onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                <button type="submit" disabled={loading || !searchQuery.trim()} className="relative md:min-w-[120px] px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-600 dark:to-indigo-700 text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500">
                  {loading && currentPage === 0 ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      <span>Searching</span>
                    </div>
                  ) : (
                    <span>Search</span>
                  )}

                  <motion.span className="absolute inset-0 bg-white rounded-xl" initial={{ opacity: 0 }} animate={{ opacity: loading && currentPage === 0 ? 0.2 : 0 }} transition={{ duration: 0.3 }} />
                </button>
              </div>
            </form>

            {/* Popular Searches Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: hasSearched && searchResults.length > 0 ? 0.8 : 1,
                y: 0,
                marginTop: "0.75rem",
                marginBottom: hasSearched && searchResults.length > 0 ? "0" : "1rem",
              }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-2 text-center"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400 italic">Popular:</span>
              {popularSearches.map(({ term, icon }) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    setSearchParams({ q: term });
                    dispatch(resetPageState("search")); // Reset page state before new search
                    dispatch(fetchSearchNews({ query: term, page: 0 })); // Use page 0 for initial search
                    setHasSearched(true);
                  }}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800/80 hover:bg-blue-50 dark:hover:bg-gray-700/90 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-800 transition-all shadow-sm hover:shadow flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                  <span className="text-base">{icon}</span> {term}
                </button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <motion.div layout className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-r mb-6 shadow-sm" role="alert">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State - Replace with Skeleton */}
        <AnimatePresence>
          {loading && currentPage === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mt-8">
              <div className="mb-6 bg-gray-50 dark:bg-gray-800/50 px-4 py-3 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="h-6 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              {renderSkeletonCards()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results */}
        <AnimatePresence mode="wait">
          {hasSearched && !loading && !error && (
            <motion.div key={searchQuery} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              {searchResults.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl py-12 px-8 text-center max-w-2xl mx-auto border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-center mb-6">
                    <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-4">
                      <svg className="h-10 w-10 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">No results found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    We couldn't find any articles matching "<span className="font-medium">{searchQuery}</span>"
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm mb-6">Try using different keywords, checking your spelling, or using more general terms.</p>
                  <button onClick={handleClearSearch} className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Start a new search
                  </button>
                </motion.div>
              ) : (
                <motion.div layout>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 bg-gray-50 dark:bg-gray-800/50 px-4 py-3 rounded-lg border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2 sm:mb-0">
                      <motion.div className="flex items-center" initial={{ scale: 1 }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5, ease: "easeOut" }}>
                        <span className="text-blue-600 dark:text-blue-400 font-bold mr-1">{searchResults.length}</span>
                        <span>results for</span>
                      </motion.div>
                      <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-md ml-1">"{searchQuery}"</span>
                    </h2>
                    <button onClick={handleClearSearch} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-md px-2 py-1">
                      Clear search
                    </button>
                  </div>

                  <NewsGrid news={searchResults} onSave={handleSave} savedNews={savedNews} isLoading={loading && currentPage === 0} />

                  {/* Load More Button */}
                  {searchResults.length >= 10 && !loading && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-12 text-center">
                      <button onClick={handleLoadMore} onMouseEnter={() => setLoadMoreHover(true)} onMouseLeave={() => setLoadMoreHover(false)} className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium border border-gray-200 dark:border-gray-700 rounded-xl shadow-md transition duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <motion.span className="absolute inset-0 flex items-center justify-center w-full h-full text-white bg-gradient-to-t from-blue-600 to-blue-500 group-hover:translate-y-0 ease" initial={{ translateY: "100%" }} animate={{ translateY: loadMoreHover ? "0%" : "100%" }} transition={{ duration: 0.3 }}></motion.span>
                        <motion.span className="absolute flex items-center justify-center w-full h-full text-gray-700 dark:text-gray-300 transition-all duration-300 transform ease" animate={{ translateY: loadMoreHover ? "100%" : "0%" }} transition={{ duration: 0.3 }}>
                          Load more articles
                          <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.span>
                        <span className="relative invisible">Load more articles</span>
                      </button>
                    </motion.div>
                  )}

                  {/* Loading more indicator */}
                  <AnimatePresence>
                    {loading && currentPage > 0 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-10 text-center">
                        <LoadingSpinner />
                        <p className="mt-2 text-gray-500 dark:text-gray-400">Loading more results...</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Search;
