import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchSearchNews, saveNews, unsaveNews, resetPageState, setApiType, fetchTimeswireSections } from "../store/slices/newsSlice";
import NewsGrid from "../components/NewsGrid";
import LoadingSpinner from "../components/LoadingSpinner";
import SkeletonNewsCard from "../components/SkeletonNewsCard";

// Custom debounce hook for search optimization
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

  // Debounce search query for optimization
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Popular searches for quick access
  const popularSearches = [
    { term: "Technology", icon: "💻" },
    { term: "Business", icon: "📊" },
    { term: "Science", icon: "🔬" },
    { term: "Health", icon: "🏥" },
    { term: "Sports", icon: "🏆" },
    { term: "Politics", icon: "🏛️" },
  ];

  // Optimized search function with debounce
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

  // Auto-search when debounced query changes
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
    <div className="max-w-[1200px] mx-auto px-5 md:px-6">
      {/* Simple Header Section */}
      <section className="pt-32 pb-12">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-3">{selectedApiType === "articlesearch" ? "Search Articles" : "Browse Categories"}</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">{selectedApiType === "articlesearch" ? "Find specific news articles using keywords" : "Explore the latest articles by section"}</p>

        {/* API Type Toggle */}
        <div className="flex mb-8 border-b border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => handleApiTypeChange("articlesearch")}
            className={`py-3 px-5 mr-4 font-medium text-sm relative
              ${selectedApiType === "articlesearch" ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"}`}
          >
            Article Search
            {selectedApiType === "articlesearch" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-neutral-800 dark:bg-neutral-200"></span>}
          </button>

          <button
            onClick={() => handleApiTypeChange("timeswire")}
            className={`py-3 px-5 font-medium text-sm relative
              ${selectedApiType === "timeswire" ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"}`}
          >
            Times Wire
            {selectedApiType === "timeswire" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-neutral-800 dark:bg-neutral-200"></span>}
          </button>
        </div>

        {/* Search Form */}
        <div className="space-y-6">
          {selectedApiType === "timeswire" && (
            <div className="max-w-md">
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-2">Select Section</label>
              <div className="relative">
                <select value={selectedSection} onChange={handleSectionChange} className="w-full px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 focus:outline-none" disabled={loadingSections}>
                  <option value="all">All Sections</option>
                  {timeswireSections.map((section) => (
                    <option key={section.section} value={section.section}>
                      {section.display_name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {selectedApiType === "articlesearch" && (
            <form onSubmit={handleSearch} className="flex gap-4">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for news..." className="flex-1 px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 focus:outline-none" />

              <button type="submit" disabled={loading || !searchQuery.trim()} className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white font-medium disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:text-neutral-500 dark:disabled:text-neutral-500">
                Search
              </button>
            </form>
          )}

          {selectedApiType === "timeswire" && (
            <button onClick={handleSearch} disabled={loading || loadingSections} className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white font-medium disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:text-neutral-500 dark:disabled:text-neutral-500">
              Browse Articles
            </button>
          )}
        </div>

        {/* Popular searches */}
        {selectedApiType === "articlesearch" && !hasSearched && (
          <div className="mt-10">
            <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-3">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map(({ term, icon }) => (
                <button key={term} onClick={() => handleQuickSearch(term)} className="px-3 py-2 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm hover:border-neutral-400 dark:hover:border-neutral-600">
                  {icon} {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Results Section */}
      <section className="py-8 border-t border-neutral-200 dark:border-neutral-800">
        {/* Error display */}
        {error && (
          <div className="mb-8 border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-4">
            <p className="text-neutral-800 dark:text-neutral-200">Error: {error}</p>
          </div>
        )}

        {/* Search results info */}
        {hasSearched && !loading && !error && searchResults.length > 0 && (
          <div className="mb-8 flex justify-between items-center">
            <div>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {searchResults.length} results
                {selectedApiType === "articlesearch" && searchQuery && <span> for "{searchQuery}"</span>}
              </span>
            </div>
            <button onClick={handleClearSearch} className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300">
              Clear search
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && currentPage === 0 && (
          <div className="py-12 text-center">
            <LoadingSpinner />
            <p className="mt-4 text-neutral-500 dark:text-neutral-500">Searching...</p>
          </div>
        )}

        {/* Empty results */}
        {hasSearched && !loading && searchResults.length === 0 && (
          <div className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 dark:bg-neutral-800 mb-4">
              <svg className="w-6 h-6 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-neutral-800 dark:text-neutral-100 mb-2">No results found</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">{selectedApiType === "articlesearch" ? `No articles found for "${searchQuery}". Try different keywords.` : "No articles found in this section."}</p>
            <button onClick={handleClearSearch} className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-sm hover:border-neutral-400 dark:hover:border-neutral-600">
              Start New Search
            </button>
          </div>
        )}

        {/* News grid */}
        {hasSearched && !loading && searchResults.length > 0 && <NewsGrid news={searchResults} onSave={handleSave} savedNews={savedNews} />}

        {/* Load more button */}
        {searchResults.length >= 10 && !loading && (
          <div className="mt-12 text-center">
            <button onClick={handleLoadMore} className="px-6 py-3 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200">
              Load More Articles
            </button>
          </div>
        )}

        {/* Loading more indicator */}
        {loading && currentPage > 0 && (
          <div className="mt-12 text-center">
            <LoadingSpinner />
            <p className="mt-4 text-neutral-500 dark:text-neutral-500">Loading more...</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Search;
