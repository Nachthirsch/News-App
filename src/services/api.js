import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const ARTICLE_SEARCH_URL = import.meta.env.VITE_ARTICLE_SEARCH_URL || import.meta.env.VITE_BASE_URL;
const TIMESWIRE_URL = import.meta.env.VITE_TIMESWIRE_URL || "https://api.nytimes.com/svc/news/v3";

// Membuat cache sederhana
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit dalam milliseconds

// Fungsi untuk membuat cache key - ensure uniqueness between different searches
const getCacheKey = (endpoint, params) => {
  // Add query parameter explicitly to create distinct cache keys for different search terms
  if (endpoint === "search" && params.q) {
    return `${endpoint}:${params.q}:${params.page || 0}:${params.apiType || "articlesearch"}`;
  }
  return `${endpoint}:${JSON.stringify(params)}`;
};

// Create separate axios instances for each API
const articleSearchApi = axios.create({
  baseURL: ARTICLE_SEARCH_URL,
  params: {
    "api-key": API_KEY,
  },
});

const timeswireApi = axios.create({
  baseURL: TIMESWIRE_URL,
  params: {
    "api-key": API_KEY,
  },
});

// Menambahkan interceptor untuk rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 detik antara requests

const addRateLimitingInterceptor = (apiInstance) => {
  apiInstance.interceptors.request.use(async (config) => {
    const now = Date.now();
    const timeToWait = MIN_REQUEST_INTERVAL - (now - lastRequestTime);

    if (timeToWait > 0) {
      await new Promise((resolve) => setTimeout(resolve, timeToWait));
    }

    lastRequestTime = Date.now();
    return config;
  });
};

// Apply rate limiting to both APIs
addRateLimitingInterceptor(articleSearchApi);
addRateLimitingInterceptor(timeswireApi);

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
    const response = await articleSearchApi.get("/articlesearch.json", { params });

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

    // Handle rate limiting with fallback to cache
    if (error.response?.status === 429) {
      const cachedData = checkCache(cacheKey);
      if (cachedData) {
        console.log("Rate limited, returning cached data");
        return { data: cachedData };
      }
      throw new Error("Rate limit exceeded. Please try again in a few minutes.");
    }

    // Handle other API errors
    if (error.response?.status >= 400) {
      throw new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
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
    const response = await articleSearchApi.get("/articlesearch.json", { params });

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

    // Handle rate limiting
    if (error.response?.status === 429) {
      // Return cached data if available, otherwise throw a user-friendly error
      const cachedData = checkCache(cacheKey);
      if (cachedData) {
        console.log("Rate limited, returning cached data");
        return { data: cachedData };
      }
      throw new Error("Rate limit exceeded. Please try again in a few minutes.");
    }

    // Handle other API errors
    if (error.response?.status >= 400) {
      throw new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
    }

    throw error;
  }
};

// New function for TimeWire API
export const getTimeswireNews = async (source = "all", section = "all", limit = 20, offset = 0) => {
  const params = { limit, offset };
  const cacheKey = getCacheKey("timeswire", { source, section, limit, offset });

  // Debug log for request parameters
  console.log("TimeWire API Request:", {
    source,
    section,
    limit,
    offset,
    url: `${TIMESWIRE_URL}/content/${source}/${section}.json`,
    params,
  });

  const cachedData = checkCache(cacheKey);
  if (cachedData) {
    console.log("Using cached TimeWire data:", {
      source,
      section,
      dataLength: cachedData.response.docs.length,
    });
    return { data: cachedData };
  }

  try {
    const response = await timeswireApi.get(`/content/${source}/${section}.json`, { params });

    // Debug logs untuk response asli dari API
    console.log("TimeWire Raw Response:", response.data);
    console.log("TimeWire Results Length:", response.data.results?.length || 0);

    // Debug log untuk multimedia
    if (response.data.results && response.data.results.length > 0) {
      console.log("Sample Multimedia from first article:", {
        multimedia: response.data.results[0].multimedia,
        title: response.data.results[0].title,
      });
    }

    if (!response.data?.results) {
      console.error("Unexpected API response structure:", response.data);
      throw new Error("Unexpected API response format");
    }

    const processedData = {
      ...response.data,
      response: {
        docs: response.data.results.map((item) => {
          // Debug log untuk setiap item multimedia
          if (item.multimedia) {
            console.log(`Multimedia for article "${item.title}":`, item.multimedia);
          }

          // Transformasi multimedia dari format TimeWire ke format yang konsisten
          const multimedia = item.multimedia
            ? item.multimedia.map((media) => ({
                url: media.url,
                height: media.height,
                width: media.width,
                type: media.type,
                subtype: media.subtype,
                format: media.format,
                caption: media.caption,
                copyright: media.copyright,
              }))
            : [];

          // Mencari berbagai format gambar yang tersedia
          const thumbnailStandard = multimedia.find((m) => m.format === "Standard Thumbnail");
          const mediumThreeByTwo210 = multimedia.find((m) => m.format === "mediumThreeByTwo210");
          const mediumThreeByTwo440 = multimedia.find((m) => m.format === "mediumThreeByTwo440");
          const articleInline = multimedia.find((m) => m.format === "Normal" || m.format === "articleInline");

          // Pilih gambar default berdasarkan ketersediaan dan preferensi ukuran
          // Prioritaskan ukuran yang lebih besar jika tersedia
          const bestImage = mediumThreeByTwo440 || mediumThreeByTwo210 || articleInline || thumbnailStandard;

          return {
            web_url: item.url,
            headline: { main: item.title },
            abstract: item.abstract,
            snippet: item.abstract,
            source: item.source,
            pub_date: item.published_date,
            byline: { original: item.byline },
            section_name: item.section,
            multimedia: multimedia,
            // Menambahkan properti untuk kemudahan akses gambar
            thumbnail_standard: thumbnailStandard ? thumbnailStandard.url : null,
            image_url: bestImage ? bestImage.url : null,
            // Tambahkan akses ke semua format gambar yang tersedia
            images: {
              small: thumbnailStandard ? thumbnailStandard.url : null,
              medium: mediumThreeByTwo210 ? mediumThreeByTwo210.url : null,
              large: mediumThreeByTwo440 ? mediumThreeByTwo440.url : null,
              inline: articleInline ? articleInline.url : null,
            },
            isTimeswire: true,
          };
        }),
      },
    };

    // Debug log untuk data yang telah diproses
    console.log("Processed TimeWire Data:", {
      totalArticles: processedData.response.docs.length,
      sampleArticle: processedData.response.docs[0],
    });

    saveToCache(cacheKey, processedData);
    return { data: processedData };
  } catch (error) {
    console.error("TimeWire API Error Details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config,
    });
    if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a few minutes.");
    }
    throw error;
  }
};

// New function to get available TimeWire sections
export const getTimeswireSections = async () => {
  const cacheKey = getCacheKey("timeswire-sections", {});

  const cachedData = checkCache(cacheKey);
  if (cachedData) {
    console.log("Using cached data for TimeWire sections");
    return { data: cachedData };
  }

  try {
    const response = await timeswireApi.get("/content/section-list.json");
    console.log("TimeWire Sections API Response:", response.data);

    if (!response.data?.results) {
      console.error("Unexpected API response structure:", response.data);
      throw new Error("Unexpected API response format");
    }

    saveToCache(cacheKey, response.data);
    return { data: response.data };
  } catch (error) {
    console.error("API Error in getTimeswireSections:", error);
    if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a few minutes.");
    }
    throw error;
  }
};

// Fixed searchNews function
export const searchNews = async (query, page = 0, apiType = "articlesearch") => {
  // If using TimeWire API, redirect to the appropriate function
  if (apiType === "timeswire") {
    // For TimeWire, we'll search by section that matches the query most closely
    // This is an approximation since TimeWire doesn't support direct text search
    let section = "all";

    // If query is a direct section name, use it directly
    // Otherwise, try to match it with known sections
    if (query.includes("section:")) {
      section = query.replace("section:", "").trim();
    } else {
      // Map common search terms to sections
      const sectionMap = {
        technology: "technology",
        tech: "technology",
        business: "business",
        politics: "politics",
        sport: "sports",
        sports: "sports",
        world: "world",
        art: "arts",
        arts: "arts",
        science: "science",
        health: "health",
        fashion: "fashion",
        food: "food",
        travel: "travel",
        opinion: "opinion",
        us: "u.s.",
        usa: "u.s.",
        america: "u.s.",
      };

      const lowercaseQuery = query.toLowerCase();

      // Check if query matches any section
      Object.entries(sectionMap).forEach(([key, value]) => {
        if (lowercaseQuery.includes(key)) {
          section = value;
        }
      });
    }

    return getTimeswireNews("all", section, 20, page * 20);
  }

  // Original ArticleSearch API logic
  const params = {
    q: query,
    sort: "relevance",
    page: page,
  };

  // Create a more specific cache key that includes API type
  const cacheKey = getCacheKey("search", { ...params, apiType });

  const cachedData = checkCache(cacheKey);
  if (cachedData) {
    console.log("Using cached data for search:", query, "page:", page, "API:", apiType);
    return { data: cachedData };
  }

  try {
    const response = await articleSearchApi.get("/articlesearch.json", { params });

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
