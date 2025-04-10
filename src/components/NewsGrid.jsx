import NewsCard from "./NewsCard";
import { motion } from "framer-motion";

const NewsGrid = ({ news, onSave, savedNews }) => {
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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {news.map((item, index) => {
          const imageUrl = getImageUrl(item);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              className="h-full"
            >
              <NewsCard title={item.headline?.main || "No Title"} description={item.abstract || "No description available"} source={getSource(item)} url={item.web_url || "#"} imageUrl={imageUrl} onSave={() => onSave(item)} isSaved={savedNews.some((saved) => saved.web_url === item.web_url)} />
            </motion.div>
          );
        })}
      </div>
      {news.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg">No news articles found</p>
        </div>
      )}
    </div>
  );
};

export default NewsGrid;
