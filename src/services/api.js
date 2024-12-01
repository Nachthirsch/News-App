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
    q: "Indonesia", // Search for Indonesia-related news
    sort: "newest",
    fq: 'glocations.contains:("Indonesia")', // Filter for Indonesia location
  };
  const cacheKey = getCacheKey("local", params);

  const cachedData = checkCache(cacheKey);
  if (cachedData) {
    return { data: cachedData };
  }

  try {
    const response = await api.get("/articlesearch.json", { params });
    saveToCache(cacheKey, response.data);
    return response;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a few minutes.");
    }
    throw error;
  }
};

export const getProgrammingNews = async () => {
  const params = {
    q: "programming OR software development OR coding OR developer",
    sort: "newest",
    fq: 'news_desk:("Technology") OR section_name:("Technology")',
  };
  const cacheKey = getCacheKey("programming", params);

  const cachedData = checkCache(cacheKey);
  if (cachedData) {
    return { data: cachedData };
  }

  try {
    const response = await api.get("/articlesearch.json", { params });
    saveToCache(cacheKey, response.data);
    return response;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a few minutes.");
    }
    throw error;
  }
};

export const searchNews = async (query, page = 1) => {
  const params = {
    q: query,
    page: page - 1,
    sort: "newest",
  };
  const cacheKey = getCacheKey("search", params);

  const cachedData = checkCache(cacheKey);
  if (cachedData) {
    return { data: cachedData };
  }

  try {
    const response = await api.get("/articlesearch.json", { params });
    saveToCache(cacheKey, response.data);
    return response;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a few minutes.");
    }
    throw error;
  }
};
