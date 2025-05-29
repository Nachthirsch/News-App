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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Simplified Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-24">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{selectedApiType === "articlesearch" ? "Search News" : "Browse by Section"}</h1>
            <p className="text-gray-600 dark:text-gray-400">{selectedApiType === "articlesearch" ? "Find articles from trusted news sources worldwide" : "Latest articles from The New York Times"}</p>
          </div>

          {/* API Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex">
              <button onClick={() => handleApiTypeChange("articlesearch")} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedApiType === "articlesearch" ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"}`}>
                Article Search
              </button>
              <button onClick={() => handleApiTypeChange("timeswire")} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedApiType === "timeswire" ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"}`}>
                Times Wire
              </button>
            </div>
          </div>

          {/* TimeWire Section Selector */}
          {selectedApiType === "timeswire" && (
            <div className="mb-6 max-w-md mx-auto">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Section</label>
              <select value={selectedSection} onChange={handleSectionChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" disabled={loadingSections}>
                <option value="all">All Sections</option>
                {timeswireSections.map((section) => (
                  <option key={section.section} value={section.section}>
                    {section.display_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-lg mx-auto">
            <div className="flex gap-3">
              {selectedApiType === "articlesearch" && (
                <div className="flex-1">
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for news..." className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              )}
              <button type="submit" disabled={loading || (selectedApiType === "articlesearch" && !searchQuery.trim()) || (selectedApiType === "timeswire" && loadingSections)} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center gap-2">
                {loading && currentPage === 0 ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    {selectedApiType === "timeswire" ? "Loading..." : "Searching..."}
                  </>
                ) : selectedApiType === "timeswire" ? (
                  "Browse Articles"
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </form>

          {/* Popular Searches - Only for ArticleSearch */}
          {selectedApiType === "articlesearch" && !hasSearched && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Popular searches:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {popularSearches.map(({ term, icon }) => (
                  <button key={term} onClick={() => handleQuickSearch(term)} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm transition-colors flex items-center gap-1">
                    <span>{icon}</span>
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            <p className="font-medium">Error: {error}</p>
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
            {searchResults.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{selectedApiType === "articlesearch" ? `No articles found for "${searchQuery}". Try different keywords.` : "No articles found in this section."}</p>
                <button onClick={handleClearSearch} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  Start New Search
                </button>
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      {searchResults.length} results
                      {selectedApiType === "articlesearch" && searchQuery && <span className="text-gray-500 dark:text-gray-400 ml-2">for "{searchQuery}"</span>}
                    </h2>
                    {selectedApiType === "timeswire" && <p className="text-sm text-gray-500 dark:text-gray-400">{selectedSection === "all" ? "All Sections" : timeswireSections.find((s) => s.section === selectedSection)?.display_name || selectedSection}</p>}
                  </div>
                  <button onClick={handleClearSearch} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 underline">
                    Clear search
                  </button>
                </div>

                {/* News Grid */}
                <NewsGrid news={searchResults} onSave={handleSave} savedNews={savedNews} isLoading={loading && currentPage === 0} />

                {/* Load More Button */}
                {searchResults.length >= 10 && !loading && (
                  <div className="text-center mt-8">
                    <button onClick={handleLoadMore} className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Load More Articles
                    </button>
                  </div>
                )}

                {/* Loading More Indicator */}
                {loading && currentPage > 0 && (
                  <div className="text-center mt-6">
                    <LoadingSpinner />
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Loading more results...</p>
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
