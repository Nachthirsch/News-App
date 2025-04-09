import NewsCard from "./NewsCard";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-16 sm:mt-24 px-4">
      {news.map((item, index) => {
        const imageUrl = getImageUrl(item);

        return <NewsCard key={index} title={item.headline?.main || "No Title"} description={item.abstract || "No description available"} source={getSource(item)} url={item.web_url || "#"} imageUrl={imageUrl} onSave={() => onSave(item)} isSaved={savedNews.some((saved) => saved.web_url === item.web_url)} />;
      })}
    </div>
  );
};

export default NewsGrid;
