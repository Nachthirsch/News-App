import NewsCard from "./NewsCard";
import SkeletonNewsCard from "./SkeletonNewsCard";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const NewsGrid = ({ news, onSave, savedNews, isLoading = false }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fungsi helper untuk mendapatkan URL gambar dari item berita
  const getImageUrl = (item) => {
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

    // Jika multimedia adalah array (format API lama)
    if (Array.isArray(item.multimedia) && item.multimedia.length > 0) {
      return `https://www.nytimes.com/${item.multimedia[0].url}`; // Format lama, perlu tambahkan domain
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
      .map((_, index) => (
        <motion.div key={`skeleton-${index}`} variants={cardVariants} className="h-full">
          <SkeletonNewsCard />
        </motion.div>
      ));
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" variants={containerVariants} initial="hidden" animate={mounted ? "visible" : "hidden"}>
        {isLoading
          ? renderSkeletonCards()
          : news.map((item, index) => {
              const imageUrl = getImageUrl(item);

              return (
                <motion.div key={item.web_url || index} variants={cardVariants} className="h-full" layout>
                  <NewsCard title={item.headline?.main || "No Title"} description={item.abstract || "No description available"} source={getSource(item)} url={item.web_url || "#"} imageUrl={imageUrl} onSave={() => onSave(item)} isSaved={savedNews.some((saved) => saved.web_url === item.web_url)} />
                </motion.div>
              );
            })}
      </motion.div>
      {!isLoading && news.length === 0 && (
        <motion.div className="flex flex-col justify-center items-center h-64 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No news articles found</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm text-center mt-2">Try adjusting your search or check back later for updates</p>
        </motion.div>
      )}
    </div>
  );
};

export default NewsGrid;
