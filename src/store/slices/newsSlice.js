import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getLocalNews, getProgrammingNews, searchNews, getTimeswireSections } from "../../services/api";

const loadSavedNews = () => {
  try {
    const savedNews = localStorage.getItem("savedNews");
    return savedNews ? JSON.parse(savedNews) : [];
  } catch (error) {
    console.error("Error loading saved news:", error);
    return [];
  }
};

// Helper untuk memastikan data berita diolah dengan konsisten
const processArticles = (articles) => {
  if (!Array.isArray(articles)) return [];

  return articles.map((article) => {
    // Normalisasi struktur artikel untuk konsistensi antar API
    const normalizedArticle = { ...article };

    // Pastikan headline ada
    if (!normalizedArticle.headline) {
      normalizedArticle.headline = { main: "No Title Available" };
    } else if (typeof normalizedArticle.headline === "string") {
      // Jika headline adalah string (mungkin dari TimeWire), konversi ke format yang diharapkan
      normalizedArticle.headline = { main: normalizedArticle.headline };
    }

    // Pastikan abstract ada
    if (!normalizedArticle.abstract) {
      normalizedArticle.abstract = "No description available";
    }

    // Pastikan URL tersedia dengan benar
    if (!normalizedArticle.web_url && normalizedArticle.url) {
      normalizedArticle.web_url = normalizedArticle.url;
    }

    // Pastikan byline ada dan dalam format yang diharapkan
    if (!normalizedArticle.byline) {
      normalizedArticle.byline = { original: "Unknown Author" };
    } else if (typeof normalizedArticle.byline === "string") {
      normalizedArticle.byline = { original: normalizedArticle.byline };
    }

    // Pastikan source ada
    if (!normalizedArticle.source) {
      normalizedArticle.source = normalizedArticle.isTimeswire ? "New York Times Wire" : "New York Times";
    }

    // Pastikan section_name ada
    if (!normalizedArticle.section_name && normalizedArticle.section) {
      normalizedArticle.section_name = normalizedArticle.section;
    }

    return normalizedArticle;
  });
};

export const fetchIndonesiaNews = createAsyncThunk("news/fetchIndonesiaNews", async ({ page = 0, isNewFetch = false }) => {
  const response = await getLocalNews(page);
  return {
    docs: processArticles(response.data.response.docs),
    page,
    isNewFetch,
  };
});

export const fetchProgrammingNews = createAsyncThunk("news/fetchProgrammingNews", async ({ page = 0, isNewFetch = false }) => {
  const response = await getProgrammingNews(page);
  return {
    docs: processArticles(response.data.response.docs),
    page,
    isNewFetch,
  };
});

export const fetchSearchNews = createAsyncThunk("news/fetchSearchNews", async ({ query, page = 0, apiType = "articlesearch" }) => {
  const response = await searchNews(query, page, apiType);
  return {
    docs: processArticles(response.data.response.docs),
    page,
    query,
    apiType,
    isNewSearch: page === 0,
  };
});

// New thunk action to fetch TimeWire sections
export const fetchTimeswireSections = createAsyncThunk("news/fetchTimeswireSections", async (_, { rejectWithValue }) => {
  try {
    const response = await getTimeswireSections();
    return response.data.results;
  } catch (error) {
    return rejectWithValue(error.message || "Failed to fetch TimeWire sections");
  }
});

const newsSlice = createSlice({
  name: "news",
  initialState: {
    indonesiaNews: [],
    programmingNews: [],
    searchResults: [],
    savedNews: loadSavedNews(),
    loading: false,
    error: null,
    lastUpdated: null,
    currentPage: {
      indonesia: 0,
      programming: 0,
      search: 0,
    },
    selectedApiType: "articlesearch", // Default API type
    timeswireSections: [], // New state for TimeWire sections
    loadingSections: false, // Loading state for sections
    sectionsError: null, // Store error for sections fetch
  },
  reducers: {
    saveNews: (state, action) => {
      const isAlreadySaved = state.savedNews.some((saved) => saved.web_url === action.payload.web_url);
      if (!isAlreadySaved) {
        state.savedNews.push(action.payload);
        localStorage.setItem("savedNews", JSON.stringify(state.savedNews));
      }
    },
    unsaveNews: (state, action) => {
      state.savedNews = state.savedNews.filter((news) => news.web_url !== action.payload.web_url);
      localStorage.setItem("savedNews", JSON.stringify(state.savedNews));
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPageState: (state, action) => {
      if (action.payload === "indonesia") {
        state.currentPage.indonesia = 0;
      } else if (action.payload === "programming") {
        state.currentPage.programming = 0;
      } else if (action.payload === "search") {
        state.currentPage.search = 0;
      }
    },
    // New reducer to change the selected API type
    setApiType: (state, action) => {
      state.selectedApiType = action.payload;
      // Reset search results when changing API to avoid mixing data
      state.searchResults = [];
      state.currentPage.search = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Indonesia News
      .addCase(fetchIndonesiaNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIndonesiaNews.fulfilled, (state, action) => {
        state.loading = false;

        // If it's a new fetch (e.g. first load or refresh), replace the array
        // Otherwise, append to existing array for pagination
        if (action.payload.isNewFetch) {
          state.indonesiaNews = action.payload.docs;
        } else {
          state.indonesiaNews = [...state.indonesiaNews, ...action.payload.docs];
        }

        state.currentPage.indonesia = action.payload.page;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchIndonesiaNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Programming News
      .addCase(fetchProgrammingNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgrammingNews.fulfilled, (state, action) => {
        state.loading = false;

        // If it's a new fetch (e.g. first load or refresh), replace the array
        // Otherwise, append to existing array for pagination
        if (action.payload.isNewFetch) {
          state.programmingNews = action.payload.docs;
        } else {
          state.programmingNews = [...state.programmingNews, ...action.payload.docs];
        }

        state.currentPage.programming = action.payload.page;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchProgrammingNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Search News
      .addCase(fetchSearchNews.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchNews.fulfilled, (state, action) => {
        state.loading = false;
        // Clear previous search results if it's a new search
        if (action.payload.isNewSearch) {
          state.searchResults = action.payload.docs;
          state.selectedApiType = action.payload.apiType; // Update the selected API type
        } else {
          state.searchResults = [...state.searchResults, ...action.payload.docs];
        }
        state.currentPage.search = action.payload.page;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchSearchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // TimeWire Sections
      .addCase(fetchTimeswireSections.pending, (state) => {
        state.loadingSections = true;
        state.sectionsError = null;
      })
      .addCase(fetchTimeswireSections.fulfilled, (state, action) => {
        state.timeswireSections = action.payload;
        state.loadingSections = false;
        state.sectionsError = null;
      })
      .addCase(fetchTimeswireSections.rejected, (state, action) => {
        state.loadingSections = false;
        state.sectionsError = action.payload || "Failed to load TimeWire sections";
        console.error("Failed to fetch TimeWire sections:", state.sectionsError);
      });
  },
});

export const { saveNews, unsaveNews, clearError, resetPageState, setApiType } = newsSlice.actions;
export default newsSlice.reducer;
