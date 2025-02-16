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

export const fetchIndonesiaNews = createAsyncThunk("news/fetchIndonesiaNews", async () => {
  const response = await getLocalNews();
  return response.data.response.docs;
});

export const fetchProgrammingNews = createAsyncThunk("news/fetchProgrammingNews", async () => {
  const response = await getProgrammingNews();
  return response.data.response.docs;
});

export const fetchSearchNews = createAsyncThunk("news/fetchSearchNews", async ({ query, page = 1 }) => {
  const response = await searchNews(query, page);
  return {
    docs: response.data.response.docs,
    page,
    isNewSearch: page === 1,
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIndonesiaNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIndonesiaNews.fulfilled, (state, action) => {
        state.loading = false;
        state.indonesiaNews = action.payload;
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
        state.programmingNews = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchProgrammingNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Search News
      .addCase(fetchSearchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchNews.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.isNewSearch) {
          state.searchResults = action.payload.docs;
        } else {
          state.searchResults = [...state.searchResults, ...action.payload.docs];
        }
        state.lastUpdated = Date.now();
      })
      .addCase(fetchSearchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { saveNews, unsaveNews, clearError } = newsSlice.actions;
export default newsSlice.reducer;
