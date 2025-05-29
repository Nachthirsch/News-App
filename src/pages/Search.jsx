import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchSearchNews, saveNews, unsaveNews, resetPageState, setApiType, fetchTimeswireSections } from "../store/slices/newsSlice";
import NewsGrid from "../components/NewsGrid";
import LoadingSpinner from "../components/LoadingSpinner";
import SkeletonNewsCard from "../components/SkeletonNewsCard";

// Custom debounce hook untuk optimisasi search
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Search = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResults, savedNews, loading, error, selectedApiType, timeswireSections, loadingSections } = useSelector((state) => state.news);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedSection, setSelectedSection] = useState("all");

  const currentPage = useSelector((state) => state.news.currentPage.search);

  // Debounce search query untuk optimisasi
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Memoize frequent computations
  const popularSearches = [
    { term: "Technology", icon: "💻" },
    { term: "Business", icon: "📊" },
    { term: "Science", icon: "🔬" },
    { term: "Health", icon: "🏥" },
    { term: "Sports", icon: "🏆" },
    { term: "Politics", icon: "🏛️" },
  ];
  // Optimized search function dengan debounce
  const performSearch = useCallback(
    (query, apiType, section = "all", page = 0) => {
      if (!query.trim() && apiType === "articlesearch") return;

      dispatch(resetPageState("search"));

      const searchQuery = apiType === "timeswire" ? `section:${section}` : query;
      const params = apiType === "timeswire" ? { api: apiType, section } : { q: query, api: apiType };

      setSearchParams(params);

      dispatch(
        fetchSearchNews({
          query: searchQuery,
          page,
          apiType,
        })
      ).finally(() => {
        setHasSearched(true);
      });
    },
    [dispatch, setSearchParams]
  );

  // Auto-search ketika debounced query berubah (untuk ArticleSearch)
  useEffect(() => {
    if (debouncedSearchQuery && selectedApiType === "articlesearch" && hasSearched) {
      performSearch(debouncedSearchQuery, selectedApiType);
    }
  }, [debouncedSearchQuery, selectedApiType, performSearch, hasSearched]);

  // Fetch TimeWire sections
  useEffect(() => {
    if (selectedApiType === "timeswire" && timeswireSections.length === 0) {
      dispatch(fetchTimeswireSections());
    }
  }, [selectedApiType, timeswireSections.length, dispatch]);

  // Handle URL parameters
  useEffect(() => {
    const query = searchParams.get("q");
    const api = searchParams.get("api") || "articlesearch";
    const section = searchParams.get("section") || "all";

    if (api && (api === "articlesearch" || api === "timeswire")) {
      dispatch(setApiType(api));
    }

    if (section) {
      setSelectedSection(section);
    }

    if (query) {
      setSearchQuery(query);
      performSearch(query, api, section);
    }
  }, [searchParams, dispatch, performSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(searchQuery, selectedApiType, selectedSection);
  };

  const handleApiTypeChange = (apiType) => {
    dispatch(setApiType(apiType));
    setSearchQuery("");
    setSelectedSection("all");
    setSearchParams({});
    dispatch(resetPageState("search"));
    setHasSearched(false);

    if (apiType === "timeswire" && timeswireSections.length === 0) {
      dispatch(fetchTimeswireSections());
    }
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
    const searchQuery = selectedApiType === "timeswire" ? `section:${selectedSection}` : searchParams.get("q");
    dispatch(fetchSearchNews({ query: searchQuery, page: nextPage, apiType: selectedApiType }));
  };

  const handleQuickSearch = (term) => {
    setSearchQuery(term);
    performSearch(term, selectedApiType);
  };
  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30">
      {/* Enhanced Header with more depth and visual appeal */}
      <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 dark:from-gray-800 dark:via-blue-900/40 dark:to-indigo-900/30 shadow-2xl border-b border-blue-200/50 dark:border-gray-600 backdrop-blur-sm">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 rounded-2xl mb-6 shadow-xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-800 dark:from-white dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent mb-4 tracking-tight">{selectedApiType === "articlesearch" ? "Discover News" : "Explore Sections"}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-medium">{selectedApiType === "articlesearch" ? "Uncover stories from the world's most trusted news sources" : "Browse the latest from The New York Times by category"}</p>
          </div>{" "}
          {/* Enhanced API Toggle with better depth */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-2 flex shadow-2xl border border-blue-200/50 dark:border-gray-600 backdrop-blur-lg">
              <button onClick={() => handleApiTypeChange("articlesearch")} className={`px-8 py-4 rounded-xl text-sm font-bold transition-all duration-300 ${selectedApiType === "articlesearch" ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105 shadow-blue-500/25" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50"}`}>
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Article Search
                </span>
              </button>
              <button onClick={() => handleApiTypeChange("timeswire")} className={`px-8 py-4 rounded-xl text-sm font-bold transition-all duration-300 ${selectedApiType === "timeswire" ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105 shadow-blue-500/25" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50"}`}>
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Times Wire
                </span>
              </button>
            </div>
          </div>{" "}
          {/* Enhanced TimeWire Section Selector */}
          {selectedApiType === "timeswire" && (
            <div className="mb-8 max-w-md mx-auto">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Select Section</label>
              <div className="relative">
                <select value={selectedSection} onChange={handleSectionChange} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none cursor-pointer transition-all duration-200 hover:shadow-md" disabled={loadingSections}>
                  <option value="all">All Sections</option>
                  {timeswireSections.map((section) => (
                    <option key={section.section} value={section.section}>
                      {section.display_name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}{" "}
          {/* Enhanced Search Form */}
          <form onSubmit={handleSearch} className="max-w-lg mx-auto">
            <div className="flex gap-3">
              {selectedApiType === "articlesearch" && (
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for news..." className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 hover:shadow-md focus:shadow-lg" />
                </div>
              )}
              <button type="submit" disabled={loading || (selectedApiType === "articlesearch" && !searchQuery.trim()) || (selectedApiType === "timeswire" && loadingSections)} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:hover:scale-100">
                {loading && currentPage === 0 ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    {selectedApiType === "timeswire" ? "Loading..." : "Searching..."}
                  </>
                ) : selectedApiType === "timeswire" ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Browse Articles
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </>
                )}
              </button>
            </div>
          </form>{" "}
          {/* Enhanced Popular Searches - Only for ArticleSearch */}
          {selectedApiType === "articlesearch" && !hasSearched && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">Popular searches:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {popularSearches.map(({ term, icon }) => (
                  <button key={term} onClick={() => handleQuickSearch(term)} className="px-5 py-3 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm hover:border-blue-300 dark:hover:border-blue-500">
                    <span className="text-lg">{icon}</span>
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>{" "}
      {/* Enhanced Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Enhanced Error Display */}
        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl shadow-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-semibold">Error: {error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && currentPage === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonNewsCard key={index} />
            ))}
          </div>
        )}

        {/* Search Results */}
        {hasSearched && !loading && !error && (
          <>
            {" "}
            {searchResults.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No results found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">{selectedApiType === "articlesearch" ? `No articles found for "${searchQuery}". Try different keywords.` : "No articles found in this section."}</p>
                <button onClick={handleClearSearch} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Start New Search
                </button>
              </div>
            ) : (
              <>
                {/* Enhanced Results Header */}
                <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        {searchResults.length} results
                        {selectedApiType === "articlesearch" && searchQuery && <span className="text-gray-500 dark:text-gray-400 ml-2 font-normal">for "{searchQuery}"</span>}
                      </h2>
                      {selectedApiType === "timeswire" && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {selectedSection === "all" ? "All Sections" : timeswireSections.find((s) => s.section === selectedSection)?.display_name || selectedSection}
                        </p>
                      )}
                    </div>
                    <button onClick={handleClearSearch} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear search
                    </button>
                  </div>
                </div>
                {/* News Grid */}
                <NewsGrid news={searchResults} onSave={handleSave} savedNews={savedNews} isLoading={loading && currentPage === 0} /> {/* Enhanced Load More Button */}
                {searchResults.length >= 10 && !loading && (
                  <div className="text-center mt-12">
                    <button onClick={handleLoadMore} className="px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3 mx-auto">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Load More Articles
                    </button>
                  </div>
                )}
                {/* Enhanced Loading More Indicator */}
                {loading && currentPage > 0 && (
                  <div className="text-center mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <LoadingSpinner />
                    <p className="mt-3 text-gray-500 dark:text-gray-400 font-medium">Loading more results...</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
