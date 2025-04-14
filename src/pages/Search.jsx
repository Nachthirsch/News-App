import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchSearchNews, saveNews, unsaveNews, resetPageState, setApiType, fetchTimeswireSections } from "../store/slices/newsSlice";
import NewsGrid from "../components/NewsGrid";
import LoadingSpinner from "../components/LoadingSpinner";
import SkeletonNewsCard from "../components/SkeletonNewsCard";
import { motion, AnimatePresence } from "framer-motion";

const Search = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResults, savedNews, loading, error, selectedApiType, timeswireSections, loadingSections } = useSelector((state) => state.news);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [hasSearched, setHasSearched] = useState(false);
  const currentPage = useSelector((state) => state.news.currentPage.search);
  const [isFocused, setIsFocused] = useState(false);
  const [loadMoreHover, setLoadMoreHover] = useState(false);
  const [selectedSection, setSelectedSection] = useState("all");

  useEffect(() => {
    // Fetch TimeWire sections when component mounts or when API type changes to TimeWire
    if (selectedApiType === "timeswire" && timeswireSections.length === 0) {
      dispatch(fetchTimeswireSections());
    }
  }, [selectedApiType, timeswireSections.length, dispatch]);

  useEffect(() => {
    const query = searchParams.get("q");
    const api = searchParams.get("api") || "articlesearch";
    const section = searchParams.get("section") || "all";

    // Set the selected API type from URL
    if (api && (api === "articlesearch" || api === "timeswire")) {
      dispatch(setApiType(api));
    }

    if (section) {
      setSelectedSection(section);
    }

    if (query) {
      console.log("Initiating search for:", query, "using API:", api, "section:", section);
      setSearchQuery(query);
      dispatch(resetPageState("search"));

      // For TimeWire, use section-based search
      if (api === "timeswire") {
        // Format query to include section prefix for better handling in the API
        const formattedQuery = section !== "all" ? `section:${section}` : query;
        dispatch(fetchSearchNews({ query: formattedQuery, page: 0, apiType: api }));
      } else {
        dispatch(fetchSearchNews({ query, page: 0, apiType: api }));
      }

      setHasSearched(true);
    }
  }, [searchParams, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();

    // Logika berbeda untuk ArticleSearch dan TimeWire
    if (selectedApiType === "articlesearch") {
      // Artikel harus menggunakan pencarian teks
      if (searchQuery.trim()) {
        setSearchParams({ q: searchQuery, api: selectedApiType });
        dispatch(resetPageState("search"));
        dispatch(
          fetchSearchNews({
            query: searchQuery,
            page: 0,
            apiType: selectedApiType,
          })
        );
        setHasSearched(true);
      }
    } else {
      // TimeWire hanya menggunakan section
      let params = { api: selectedApiType, section: selectedSection };
      const queryToUse = `section:${selectedSection}`;

      setSearchParams(params);
      dispatch(resetPageState("search"));
      dispatch(
        fetchSearchNews({
          query: queryToUse,
          page: 0,
          apiType: selectedApiType,
        })
      );
      setHasSearched(true);
    }
  };

  const handleApiTypeChange = (apiType) => {
    dispatch(setApiType(apiType));

    // Reset query jika berubah dari TimeWire ke ArticleSearch
    if (apiType === "articlesearch" && selectedApiType === "timeswire") {
      setSearchQuery("");
    }

    // Reset section when changing API type
    if (apiType === "timeswire" && timeswireSections.length === 0) {
      dispatch(fetchTimeswireSections());
    }

    setSelectedSection("all");

    // Reset everything and clear the URL params
    setSearchParams({});
    dispatch(resetPageState("search"));
    setHasSearched(false);
  };

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
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

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    dispatch(fetchSearchNews({ query: searchQuery, page: nextPage, apiType: selectedApiType }));
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">{selectedApiType === "articlesearch" ? "Discover News" : "Latest News"}</span> {selectedApiType === "articlesearch" ? "That Matters" : "By Section"}
            </motion.h1>

            <AnimatePresence>
              {(!hasSearched || searchResults.length === 0) && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="mt-3 max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300">
                  {selectedApiType === "articlesearch" ? "Search for breaking news, articles, and stories from trusted sources worldwide" : "Browse the latest New York Times articles by section"}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div layout className="max-w-3xl mx-auto" animate={{ y: hasSearched && searchResults.length > 0 ? 0 : 10 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            {/* API Selection Toggle - Improved with icons */}
            <div className="flex justify-center mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-1.5 shadow-md flex gap-1">
                <button onClick={() => handleApiTypeChange("articlesearch")} className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${selectedApiType === "articlesearch" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Article Search
                </button>
                <button onClick={() => handleApiTypeChange("timeswire")} className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${selectedApiType === "timeswire" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Times Wire
                </button>
              </div>
            </div>

            {/* TimeWire Section Selector dengan UI yang lebih menarik */}
            {selectedApiType === "timeswire" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-800/40">
                  <label className="block text-base font-medium text-gray-800 dark:text-gray-200 mb-3 text-center flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    Select News Section
                  </label>

                  {/* Section Quick-select Chips */}
                  {!loadingSections && timeswireSections.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {["all", "world", "business", "technology", "science"].map((sectionKey) => {
                        const section = sectionKey === "all" ? { section: "all", display_name: "All Sections" } : timeswireSections.find((s) => s.section === sectionKey);

                        if (!section) return null;

                        return (
                          <button key={section.section} onClick={() => setSelectedSection(section.section)} className={`px-3 py-1.5 text-xs rounded-full transition-all ${selectedSection === section.section ? "bg-blue-600 text-white dark:bg-blue-700" : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"} border border-gray-200 dark:border-gray-700`}>
                            {section.display_name}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="relative">
                    <select value={selectedSection} onChange={handleSectionChange} className="block w-full pl-4 pr-10 py-3.5 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl shadow-md dark:text-white text-gray-900" disabled={loadingSections}>
                      <option value="all">All Sections</option>
                      {timeswireSections.map((section) => (
                        <option key={section.section} value={section.section}>
                          {section.display_name}
                        </option>
                      ))}
                    </select>
                    {loadingSections && (
                      <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                    {/* Improved dropdown indicator positioning */}
                    <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none flex items-center justify-center"></div>
                  </div>

                  <div className="mt-3 flex items-center justify-center text-sm">
                    <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z" />
                      </svg>
                      Showing most recent articles from each section
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSearch} className="relative z-10">
              <div className={`flex flex-col md:flex-row md:items-center gap-3`}>
                {/* Hanya tampilkan input pencarian untuk ArticleSearch */}
                {selectedApiType === "articlesearch" && (
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
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Tombol submit dengan gaya berbeda berdasarkan API */}
                <button type="submit" disabled={loading || (selectedApiType === "articlesearch" && !searchQuery.trim()) || (selectedApiType === "timeswire" && loadingSections)} className={`relative px-6 py-3.5 font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${selectedApiType === "timeswire" ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white md:min-w-[160px]" : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white md:min-w-[120px]"}`}>
                  {loading && currentPage === 0 ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      <span>{selectedApiType === "timeswire" ? "Loading" : "Searching"}</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {selectedApiType === "timeswire" ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Latest Articles
                        </>
                      ) : (
                        "Search"
                      )}
                    </span>
                  )}

                  <motion.span className="absolute inset-0 bg-white rounded-xl" initial={{ opacity: 0 }} animate={{ opacity: loading && currentPage === 0 ? 0.2 : 0 }} transition={{ duration: 0.3 }} />
                </button>
              </div>
            </form>

            {/* API Description - Enhanced styling */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className={`mt-3 text-center ${selectedApiType === "articlesearch" ? "text-xs text-gray-500 dark:text-gray-400" : "text-sm text-gray-600 dark:text-gray-400 italic"}`}>
              {selectedApiType === "articlesearch" ? "Article Search API allows searching across all published articles" : "Times Wire provides real-time access to newest NYT content as it's published"}
            </motion.div>

            {/* Popular Searches Section - Only show for ArticleSearch */}
            {selectedApiType === "articlesearch" && (
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
                      setSearchParams({ q: term, api: selectedApiType });
                      dispatch(resetPageState("search"));
                      dispatch(fetchSearchNews({ query: term, page: 0, apiType: selectedApiType }));
                      setHasSearched(true);
                    }}
                    className="px-3 py-1.5 bg-white dark:bg-gray-800/80 hover:bg-blue-50 dark:hover:bg-gray-700/90 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-800 transition-all shadow-sm hover:shadow flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  >
                    <span className="text-base">{icon}</span> {term}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <motion.div layout className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 max-w-6xl py-4 md:py-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-500 text-red-700 dark:text-red-400 p-3 sm:p-4 rounded-r mb-4 sm:mb-6 shadow-sm" role="alert">
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

        {/* API Type Indicator */}
        {hasSearched && !loading && searchResults.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-4 text-center">
            {selectedApiType === "articlesearch" ? (
              <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">Article Search API</span>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Times Wire API • {selectedSection === "all" ? "All Sections" : timeswireSections.find((s) => s.section === selectedSection)?.display_name || selectedSection}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Showing latest articles published by The New York Times</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Loading State - Replace with Skeleton */}
        <AnimatePresence>
          {loading && currentPage === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mt-4 sm:mt-6 md:mt-8">
              <div className="mb-4 sm:mb-6 bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="h-5 sm:h-6 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              {renderSkeletonCards()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results */}
        <AnimatePresence mode="wait">
          {hasSearched && !loading && !error && (
            <motion.div key={searchQuery} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="space-y-6 md:space-y-8">
              {searchResults.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 text-center max-w-2xl mx-auto border border-gray-100 dark:border-gray-700 my-4 sm:my-6 md:my-8">
                  <div className="flex justify-center mb-5 sm:mb-6">
                    <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3 sm:p-4">
                      <svg className="h-8 w-8 sm:h-10 sm:w-10 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">No results found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                    We couldn't find any articles matching "<span className="font-medium">{searchQuery}</span>"
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm mb-5 sm:mb-6 max-w-md mx-auto">Try using different keywords, checking your spelling, or using more general terms.</p>
                  <button onClick={handleClearSearch} className="inline-flex items-center justify-center px-4 sm:px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Start a new search
                  </button>
                </motion.div>
              ) : (
                <motion.div layout className="space-y-6 md:space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-0">
                      <motion.div className="flex items-center" initial={{ scale: 1 }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5, ease: "easeOut" }}>
                        <span className="text-blue-600 dark:text-blue-400 font-bold mr-1">{searchResults.length}</span>
                        <span>results for</span>
                      </motion.div>
                      <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md">"{searchQuery.length > 25 ? `${searchQuery.substring(0, 25)}...` : searchQuery}"</span>
                    </h2>
                    <button onClick={handleClearSearch} className="self-start sm:self-auto text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-md px-2 py-1">
                      Clear search
                    </button>
                  </div>

                  <div className="mb-2 sm:mb-4">
                    <NewsGrid news={searchResults} onSave={handleSave} savedNews={savedNews} isLoading={loading && currentPage === 0} />
                  </div>

                  {/* Load More Button */}
                  {searchResults.length >= 10 && !loading && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 sm:mt-10 md:mt-12 mb-12 sm:mb-16 md:mb-20 text-center">
                      <button onClick={handleLoadMore} onMouseEnter={() => setLoadMoreHover(true)} onMouseLeave={() => setLoadMoreHover(false)} className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 overflow-hidden font-medium border border-gray-200 dark:border-gray-700 rounded-xl shadow-md transition duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <motion.span className="absolute inset-0 flex items-center justify-center w-full h-full text-white bg-gradient-to-t from-blue-600 to-blue-500 group-hover:translate-y-0 ease" initial={{ translateY: "100%" }} animate={{ translateY: loadMoreHover ? "0%" : "100%" }} transition={{ duration: 0.3 }}></motion.span>
                        <motion.span className="absolute flex items-center justify-center w-full h-full text-gray-700 dark:text-gray-300 transition-all duration-300 transform ease" animate={{ translateY: loadMoreHover ? "100%" : "0%" }} transition={{ duration: 0.3 }}>
                          Load more articles
                          <svg className="ml-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 sm:mt-8 mb-4 sm:mb-6 text-center">
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
