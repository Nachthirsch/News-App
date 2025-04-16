import NewsCard from "./NewsCard";
import SkeletonNewsCard from "./SkeletonNewsCard";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const NewsGrid = ({ news, onSave, savedNews, isLoading = false }) => {
  const [mounted, setMounted] = useState(false);
  const [layoutType, setLayoutType] = useState("magazine"); // 'magazine', 'classic', 'compact'

  useEffect(() => {
    setMounted(true);

    // Choose layout based on number of articles
    if (news.length <= 3) {
      setLayoutType("classic");
    } else if (news.length >= 10) {
      setLayoutType("magazine");
    } else {
      setLayoutType("magazine");
    }
  }, [news.length]);

  // Fungsi helper untuk mendapatkan URL gambar dari item berita
  const getImageUrl = (item) => {
    // Check for direct image URL from TimeWire
    if (item.image_url) {
      return item.image_url;
    }

    // Check for images object structure from TimeWire
    if (item.images) {
      // Prioritize images by size (large to small)
      return item.images.large || item.images.medium || item.images.inline || item.images.small;
    }

    // Check for thumbnail_standard (common in TimeWire)
    if (item.thumbnail_standard) {
      return item.thumbnail_standard;
    }

    // Jika multimedia adalah objek dengan properti default (format API baru yang benar)
    if (item.multimedia && typeof item.multimedia === "object" && !Array.isArray(item.multimedia)) {
      // Gunakan URL dari default (ukuran besar) jika ada
      if (item.multimedia.default && item.multimedia.default.url) {
        return item.multimedia.default.url; // URL sudah lengkap, tidak perlu tambahkan domain
      }
      // Atau gunakan thumbnail jika default tidak ada
      if (item.multimedia.thumbnail && item.multimedia.thumbnail.url) {
        return item.multimedia.thumbnail.url; // URL sudah lengkap, tidak perlu tambahkan domain
      }
    }

    // Jika multimedia adalah array (format API lama atau TimeWire)
    if (Array.isArray(item.multimedia) && item.multimedia.length > 0) {
      // TimeWire items already contain complete URLs
      if (item.isTimeswire) {
        // Find the best image format from TimeWire (prefer larger images)
        const mediumThreeByTwo440 = item.multimedia.find((m) => m.format === "mediumThreeByTwo440");
        const mediumThreeByTwo210 = item.multimedia.find((m) => m.format === "mediumThreeByTwo210");
        const normalImage = item.multimedia.find((m) => m.format === "Normal" || m.format === "articleInline");
        const thumbnailStandard = item.multimedia.find((m) => m.format === "Standard Thumbnail");

        // Return the best available image
        if (mediumThreeByTwo440) return mediumThreeByTwo440.url;
        if (mediumThreeByTwo210) return mediumThreeByTwo210.url;
        if (normalImage) return normalImage.url;
        if (thumbnailStandard) return thumbnailStandard.url;

        // If no specific format found, use the first available
        return item.multimedia[0].url;
      }

      // ArticleSearch URLs need domain prefix
      return `https://www.nytimes.com/${item.multimedia[0].url}`;
    }

    // Fallback ke placeholder
    return `https://placehold.co/600x400?text=${encodeURIComponent(item.headline?.main || "News")}`;
  };

  // Fungsi helper untuk mendapatkan source dari item berita
  const getSource = (item) => {
    // Format API baru menggunakan source.vernacular
    if (item.source && typeof item.source === "object" && item.source.vernacular) {
      return item.source.vernacular;
    }
    // Format API lama menggunakan string source
    if (typeof item.source === "string") {
      return item.source;
    }
    // Fallback
    return "The New York Times";
  };

  // Configure container animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Create an array of skeleton cards when loading
  const renderSkeletonCards = () => {
    return Array(6)
      .fill()
      .map((_, index) => {
        // Define skeleton card sizes based on position
        let skeletonClass = "";

        if (layoutType === "magazine") {
          if (index === 0) {
            skeletonClass = "col-span-full md:col-span-4 md:row-span-2 lg:col-span-4 lg:row-span-2";
          } else if (index === 1) {
            skeletonClass = "col-span-1 md:col-span-2 lg:col-span-2";
          } else if (index === 2) {
            skeletonClass = "col-span-1 md:col-span-2 lg:col-span-2";
          } else {
            skeletonClass = "col-span-1 md:col-span-2 lg:col-span-2";
          }
        }

        return (
          <motion.div key={`skeleton-${index}`} variants={cardVariants} className={`h-full ${skeletonClass}`}>
            <SkeletonNewsCard isFeature={index === 0 && layoutType === "magazine"} variant={index < 3 ? "large" : "small"} />
          </motion.div>
        );
      });
  };

  // Determine if we have enough news items for a good layout
  const hasEnoughItems = news.length >= 5;

  // Magazine layout grid configuration
  const getMagazineGridClass = () => {
    return "grid-cols-1 md:grid-cols-6 lg:grid-cols-6 md:grid-rows-[minmax(400px,auto)_auto_auto]";
  };

  // Classic layout grid configuration
  const getClassicGridClass = () => {
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  };

  // Get current grid class based on layout type
  const getGridClass = () => {
    if (!hasEnoughItems) return getClassicGridClass();

    switch (layoutType) {
      case "magazine":
        return getMagazineGridClass();
      case "compact":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      default:
        return getClassicGridClass();
    }
  };

  // Get article size/position class for magazine layout
  const getMagazineItemClass = (index) => {
    if (index === 0) {
      // Main headline - spans full width on mobile, 4 columns on larger screens
      return "col-span-full md:col-span-4 md:row-span-1 lg:col-span-4 lg:row-span-1";
    } else if (index === 1) {
      // Featured sub-headline 1
      return "col-span-full md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-1";
    } else if (index === 2) {
      // Featured sub-headline 2 - positioned right side
      return "col-span-full md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-1";
    } else if (index === 3) {
      // Horizontal feature below main headline
      return "col-span-full md:col-span-3 lg:col-span-3";
    } else if (index === 4) {
      // Small feature 1
      return "col-span-1 md:col-span-3 lg:col-span-3";
    } else if (index % 3 === 0) {
      // Every third item after index 4 gets full width on mobile, half width on desktop
      return "col-span-full md:col-span-3 lg:col-span-3";
    } else {
      // Regular items
      return "col-span-full md:col-span-3 lg:col-span-3";
    }
  };

  // Get article class based on layout type and index
  const getItemClass = (index) => {
    if (!hasEnoughItems) return "";

    switch (layoutType) {
      case "magazine":
        return getMagazineItemClass(index);
      case "compact":
        return "";
      default:
        return "";
    }
  };

  // Get article variant based on position in layout
  const getArticleVariant = (index) => {
    if (!hasEnoughItems) return index === 0 ? "feature" : "regular";

    if (layoutType === "magazine") {
      if (index === 0) return "hero";
      if (index === 1 || index === 2) return "feature";
      if (index === 3) return "horizontal";
      return index % 3 === 0 ? "horizontal" : "regular";
    }

    return index === 0 ? "feature" : "regular";
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!isLoading && news.length === 0 ? (
        <motion.div className="flex flex-col justify-center items-center h-64 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No news articles found</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm text-center mt-2">Try adjusting your search or check back later for updates</p>
        </motion.div>
      ) : (
        <motion.div className={`grid gap-5 md:gap-6 lg:gap-8 ${getGridClass()}`} variants={containerVariants} initial="hidden" animate={mounted ? "visible" : "hidden"}>
          {isLoading
            ? renderSkeletonCards()
            : news.map((item, index) => {
                const imageUrl = getImageUrl(item);
                const title = item.headline?.main || "No Title";
                const url = item.web_url || item.url || "#";
                const variant = getArticleVariant(index);
                const gridClass = getItemClass(index);

                return (
                  <motion.div key={item.web_url || index} variants={cardVariants} className={`h-full ${gridClass}`} layout>
                    <NewsCard title={title} description={item.abstract || "No description available"} source={getSource(item)} url={url} imageUrl={imageUrl} onSave={() => onSave(item)} isSaved={savedNews.some((saved) => saved.web_url === item.web_url)} variant={variant} isFeature={variant === "hero" || variant === "feature"} priority={index < 3} />
                  </motion.div>
                );
              })}
        </motion.div>
      )}

      {!isLoading && news.length > 0 && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button onClick={() => setLayoutType("magazine")} className={`px-4 py-2 text-sm rounded-md transition-colors ${layoutType === "magazine" ? "bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
              Magazine
            </button>
            <button onClick={() => setLayoutType("classic")} className={`px-4 py-2 text-sm rounded-md transition-colors ${layoutType === "classic" ? "bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
              Classic
            </button>
            <button onClick={() => setLayoutType("compact")} className={`px-4 py-2 text-sm rounded-md transition-colors ${layoutType === "compact" ? "bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
              Compact
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsGrid;
