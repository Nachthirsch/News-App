import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getLocalNews, getProgrammingNews, searchNews } from "../../services/api";

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
    // Pastikan headline ada
    if (!article.headline) {
      article.headline = { main: "No Title Available" };
    }

    // Pastikan abstract ada
    if (!article.abstract) {
      article.abstract = "No description available";
    }

    return article;
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

export const fetchSearchNews = createAsyncThunk("news/fetchSearchNews", async ({ query, page = 0 }) => {
  const response = await searchNews(query, page);
  return {
    docs: processArticles(response.data.response.docs),
    page,
    query, // Add query to the payload
    isNewSearch: page === 0, // Set isNewSearch flag when page is 0
  };
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
        } else {
          state.searchResults = [...state.searchResults, ...action.payload.docs];
        }
        state.currentPage.search = action.payload.page;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchSearchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { saveNews, unsaveNews, clearError, resetPageState } = newsSlice.actions;
export default newsSlice.reducer;
