import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Membuat cache sederhana
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit dalam milliseconds

// Fungsi untuk membuat cache key
const getCacheKey = (endpoint, params) => {
  return `${endpoint}:${JSON.stringify(params)}`;
};

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    "api-key": API_KEY,
  },
});

// Menambahkan interceptor untuk rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 detik antara requests

api.interceptors.request.use(async (config) => {
  const now = Date.now();
  const timeToWait = MIN_REQUEST_INTERVAL - (now - lastRequestTime);

  if (timeToWait > 0) {
    await new Promise((resolve) => setTimeout(resolve, timeToWait));
  }

  lastRequestTime = Date.now();
  return config;
});

// Fungsi helper untuk mengecek cache
const checkCache = (cacheKey) => {
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

// Fungsi helper untuk menyimpan ke cache
const saveToCache = (cacheKey, data) => {
  cache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });
};

export const getLocalNews = async (page = 0) => {
  // Using a more flexible approach with multiple query combinations
  const params = {
    q: "Indonesia",
    sort: "relevance",
    page: page,
    // Try a more general query without specific field filters
    // The API will search across multiple fields including headline, body, etc.
  };
  const cacheKey = getCacheKey("local", params);

  const cachedData = checkCache(cacheKey);
  if (cachedData) {
    return { data: cachedData };
  }

  try {
    const response = await api.get("/articlesearch.json", { params });

    // Log the response for debugging
    console.log("API Response:", response.data);

    // Check if response has the expected structure
    if (!response.data?.response?.docs) {
      console.error("Unexpected API response structure:", response.data);
      throw new Error("Unexpected API response format");
    }

    const processedData = {
      ...response.data,
      response: {
        ...response.data.response,
        docs: response.data.response.docs,
      },
    };

    saveToCache(cacheKey, processedData);
    return { data: processedData };
  } catch (error) {
    console.error("API Error:", error);
    if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a few minutes.");
    }
    throw error;
  }
};

export const getProgrammingNews = async (page = 0) => {
  const params = {
    q: "Programming or Coding or Software Development",
    sort: "relevance",
    page: page,
  };
  const cacheKey = getCacheKey("programming", params);

  const cachedData = checkCache(cacheKey);
  if (cachedData) {
    return { data: cachedData };
  }

  try {
    const response = await api.get("/articlesearch.json", { params });

    // Log the response for debugging
    console.log("Programming News API Response:", response.data);

    // Check if response has the expected structure
    if (!response.data?.response?.docs) {
      console.error("Unexpected API response structure:", response.data);
      throw new Error("Unexpected API response format");
    }

    const processedData = {
      ...response.data,
      response: {
        ...response.data.response,
        docs: response.data.response.docs,
      },
    };

    saveToCache(cacheKey, processedData);
    return { data: processedData };
  } catch (error) {
    console.error("API Error in getProgrammingNews:", error);
    if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a few minutes.");
    }
    throw error;
  }
};

export const searchNews = async (query, page = 0) => {
  const params = {
    q: query,
    sort: "relevance",
    // Use a more general query approach after the API change
    page: page,
  };
  const cacheKey = getCacheKey("search", params);

  const cachedData = checkCache(cacheKey);
  if (cachedData) {
    return { data: cachedData };
  }

  try {
    const response = await api.get("/articlesearch.json", { params });

    // Log the response for debugging
    console.log("Search News API Response:", response.data);

    // Check if response has the expected structure
    if (!response.data?.response?.docs) {
      console.error("Unexpected API response structure:", response.data);
      throw new Error("Unexpected API response format");
    }

    const processedData = {
      ...response.data,
      response: {
        ...response.data.response,
        docs: response.data.response.docs,
      },
    };

    saveToCache(cacheKey, processedData);
    return { data: processedData };
  } catch (error) {
    console.error("API Error in searchNews:", error);
    if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a few minutes.");
    }
    throw error;
  }
};
