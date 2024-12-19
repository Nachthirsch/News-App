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

export const getLocalNews = async () => {
  const params = {
    q: "Indonesia",
    sort: "relevance",
    fq: 'glocations.contains:("Indonesia")',
    fl: "headline,multimedia,web_url,pub_date,abstract,source", // Menambahkan field multimedia
  };
  const cacheKey = getCacheKey("local", params);

  const cachedData = checkCache(cacheKey);
  if (cachedData) {
    return { data: cachedData };
  }

  try {
    const response = await api.get("/articlesearch.json", { params });

    // Memproses data untuk mendapatkan URL gambar
    const processedData = {
      ...response.data,
      response: {
        ...response.data.response,
        docs: response.data.response.docs.map((doc) => ({
          ...doc,
          image_url: doc.multimedia?.length > 0 ? `https://www.nytimes.com/${doc.multimedia[0].url}` : "https://placehold.co/600x400?text=No+Image", // Default image jika tidak ada gambar
        })),
      },
    };

    saveToCache(cacheKey, processedData);
    return { data: processedData };
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a few minutes.");
    }
    throw error;
  }
};

export const getProgrammingNews = async () => {
  const params = {
    q: "Programming or Coding or Software Development",
    sort: "relevance",
    fl: "headline,multimedia,web_url,pub_date,abstract,source",
    page: 0,
  };
  const cacheKey = getCacheKey("programming", params);

  const cachedData = checkCache(cacheKey);
  if (cachedData) {
    return { data: cachedData };
  }

  try {
    const response = await api.get("/articlesearch.json", { params });
    const processedData = {
      ...response.data,
      response: {
        ...response.data.response,
        docs: response.data.response.docs.map((doc) => ({
          ...doc,
          image_url: doc.multimedia?.length > 0 ? `https://www.nytimes.com/${doc.multimedia[0].url}` : "https://placehold.co/600x400?text=No+Image",
        })),
      },
    };

    saveToCache(cacheKey, processedData);
    return { data: processedData };
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a few minutes.");
    }
    throw error;
  }
};

export const searchNews = async (query) => {
  const params = {
    q: query,
    sort: "relevance", // Change from "newest" to "relevance"
    fl: "headline,multimedia,web_url,pub_date,abstract,source",
    fq: `headline:("${query}") OR lead_paragraph:("${query}") OR keywords:("${query}")`,
    page: 0, // Start from the first page
  };
  const cacheKey = getCacheKey("search", params);

  const cachedData = checkCache(cacheKey);
  if (cachedData) {
    return { data: cachedData };
  }

  try {
    const response = await api.get("/articlesearch.json", { params });
    const processedData = {
      ...response.data,
      response: {
        ...response.data.response,
        docs: response.data.response.docs.map((doc) => ({
          ...doc,
          image_url: doc.multimedia?.length > 0 ? `https://www.nytimes.com/${doc.multimedia[0].url}` : "https://placehold.co/600x400?text=No+Image",
        })),
      },
    };

    saveToCache(cacheKey, processedData);
    return { data: processedData };
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a few minutes.");
    }
    throw error;
  }
};
