import PropTypes from "prop-types";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const NewsCard = ({ title, description, source, url, imageUrl, onSave, isSaved, variant = "regular", priority = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleSpeak = () => {
    if (!utterance) {
      const newUtterance = new SpeechSynthesisUtterance(`${title}. ${description}`);
      newUtterance.onend = () => setIsPlaying(false);
      setUtterance(newUtterance);
      setIsPlaying(true);
      window.speechSynthesis.speak(newUtterance);
    } else if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Configuration based on variant
  const getCardLayout = () => {
    switch (variant) {
      case "hero":
        return "flex flex-col";
      case "feature":
        return "flex flex-col";
      case "horizontal":
        return "flex flex-col";
      case "small":
        return "flex flex-col";
      case "text-only":
        return "flex flex-col";
      case "title-only":
        return "flex flex-col";
      case "thumbnail-square":
        return "flex flex-col h-full w-full"; // Add w-full to ensure proper sizing
      default:
        return "flex flex-col";
    }
  };

  const getImageContainerClass = () => {
    switch (variant) {
      case "hero":
        return "w-full h-52 md:h-[320px]"; // Reduced from h-64 md:h-[400px]
      case "feature":
        return "w-full h-40 md:h-48"; // Reduced from h-48 md:h-56
      case "horizontal":
        return "w-full h-40"; // Reduced from h-48
      case "small":
        return "w-full h-28"; // Reduced from h-32
      case "text-only":
        return "hidden"; // Hide image container for text-only variant
      case "title-only":
        return "hidden"; // Hide image container for title-only variant
      case "thumbnail-square":
        return "w-full aspect-square h-[100px]"; // Reduced from h-[120px]
      default:
        return "w-full h-40"; // Reduced from h-48
    }
  };

  const getContentContainerClass = () => {
    switch (variant) {
      case "hero":
        return "p-4 md:p-5 w-full"; // Reduced from p-5 md:p-6
      case "feature":
        return "p-4"; // Reduced from p-5
      case "horizontal":
        return "p-3 md:p-4 w-full"; // Reduced from p-4 md:p-5
      case "small":
        return "p-2"; // Reduced from p-3
      case "text-only":
        return "p-4 h-full flex flex-col"; // Reduced from p-5
      case "title-only":
        return "p-3 h-full flex flex-col"; // Reduced from p-4
      case "thumbnail-square":
        return "p-2 flex flex-col flex-grow";
      default:
        return "p-3"; // Reduced from p-4
    }
  };

  // Memperbarui kelas judul untuk memastikan teks tidak terpotong
  const getTitleClass = () => {
    switch (variant) {
      case "hero":
        return "text-lg md:text-xl lg:text-2xl line-clamp-none mb-2"; // Reduced sizes and spacing
      case "feature":
        return "text-base md:text-lg line-clamp-none mb-2"; // Reduced sizes and spacing
      case "horizontal":
        return "text-base line-clamp-none mb-2";
      case "small":
        return "text-sm line-clamp-none mb-1"; // Reduced size and spacing
      case "text-only":
        return "text-lg line-clamp-none mb-2"; // Reduced from text-xl and mb-3
      case "title-only":
        return "text-base font-bold line-clamp-3"; // Reduced from text-lg
      case "thumbnail-square":
        return "text-xs font-bold line-clamp-2 mt-1";
      default:
        return "text-base line-clamp-none mb-2"; // Reduced from text-lg
    }
  };

  // Memperbarui kelas deskripsi untuk memastikan teks tidak terpotong terlalu dini
  const getDescriptionClass = () => {
    switch (variant) {
      case "hero":
        return "max-h-[120px] md:max-h-[200px] overflow-y-auto"; // Reduced from max-h-[150px] md:max-h-[300px]
      case "feature":
        return "max-h-[100px] overflow-y-auto"; // Reduced from max-h-[130px]
      case "horizontal":
        return "max-h-[80px] md:max-h-[100px] overflow-y-auto"; // Reduced from max-h-[100px] md:max-h-[120px]
      case "small":
        return "max-h-[60px] overflow-y-auto"; // Reduced from max-h-[80px]
      case "text-only":
        return "flex-grow overflow-y-auto"; // Make description fill available space
      case "title-only":
        return "hidden"; // No description for title-only
      case "thumbnail-square":
        return "hidden"; // No description for thumbnail-square
      default:
        return "max-h-[100px] overflow-y-auto"; // Reduced from max-h-[120px]
    }
  };

  // Memastikan teks deskripsi tidak terlalu panjang tapi tetap bisa dibaca
  const formatDescription = (text) => {
    // Jika deskripsi terlalu panjang, tambahkan indikator baca selengkapnya
    const maxLength = variant === "hero" ? 250 : variant === "feature" ? 150 : variant === "horizontal" ? 130 : variant === "small" ? 80 : 120;

    if (text.length > maxLength) {
      return (
        <>
          {text.substring(0, maxLength)}
          <span className="text-blue-500 dark:text-blue-400 hover:underline cursor-pointer ml-1">...</span>
        </>
      );
    }
    return text;
  };

  // Loading priority
  const loadingPriority = priority ? "eager" : "lazy";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className={`group relative 
                 border-b border-neutral-200 dark:border-neutral-700
                 transition-all duration-300 
                 overflow-hidden
                 ${getCardLayout()} h-full
                 ${variant !== "thumbnail-square" ? "pb-3 mb-3" : ""}`} // Reduced from pb-4 mb-4
    >
      {variant !== "text-only" && variant !== "title-only" && (
        <div className={`relative overflow-hidden ${getImageContainerClass()}`}>
          <motion.img
            src={imageUrl}
            alt={title}
            loading={loadingPriority}
            className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 
                      ${variant === "thumbnail-square" ? "aspect-square object-cover" : ""}`}
            onError={(e) => (e.target.src = "/fallback-image.jpg")}
            layoutId={`image-${url}`}
          />

          {/* Category/source badge for hero and feature articles */}
          {(variant === "hero" || variant === "feature") && (
            <div
              className="absolute bottom-3 left-3 px-3 py-1.5 bg-white/90 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 
                          text-xs font-medium rounded-md shadow-sm backdrop-blur-sm"
            >
              {source}
            </div>
          )}

          {/* Control buttons */}
          {variant !== "thumbnail-square" && (
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSpeak}
                className="p-2 rounded-full bg-white/90 hover:bg-white dark:bg-neutral-800/90 dark:hover:bg-neutral-800 shadow-sm
                         transition-all duration-200 backdrop-blur-sm"
                title={isPlaying ? "Stop speaking" : "Listen to article"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isPlaying ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0-12L8 8m4-2l4 2m-4 12l-4-2m4 2l4-2" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8L12 12l-5.25 4V8z" />}
                </svg>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="p-2 rounded-full bg-white/90 hover:bg-white dark:bg-neutral-800/90 dark:hover:bg-neutral-800 shadow-sm
                         transition-all duration-200 backdrop-blur-sm"
                title="Share article"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onSave}
                className="p-2 rounded-full bg-white/90 hover:bg-white dark:bg-neutral-800/90 dark:hover:bg-neutral-800 shadow-sm
                         transition-all duration-200 backdrop-blur-sm"
                title={isSaved ? "Remove from saved" : "Save article"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isSaved ? "text-red-500" : "text-neutral-700 dark:text-neutral-300 group-hover:text-red-500"}`} fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </motion.button>
            </div>
          )}

          {/* Simplified controls for thumbnail-square variant */}
          {variant === "thumbnail-square" && (
            <div className="absolute top-2 right-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onSave}
                className="p-1.5 rounded-full bg-white/90 hover:bg-white dark:bg-neutral-800/90 dark:hover:bg-neutral-800 shadow-sm
                         transition-all duration-200 backdrop-blur-sm"
                title={isSaved ? "Remove from saved" : "Save article"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${isSaved ? "text-red-500" : "text-neutral-700 dark:text-neutral-400"}`} fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </motion.button>
            </div>
          )}
        </div>
      )}

      <div className={`flex flex-col ${variant === "text-only" || variant === "title-only" ? "flex-grow" : ""} ${getContentContainerClass()}`}>
        {/* Source indicator - show at top for text-only variant */}
        {(variant === "text-only" || variant === "title-only") && (
          <div className="flex items-center justify-between mb-2">
            {" "}
            {/* Reduced from mb-3 */}
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs font-medium text-neutral-600 
                       dark:text-neutral-400"
            >
              {source}
            </motion.span>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSpeak}
                className="p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700
                         transition-all duration-200"
                title={isPlaying ? "Stop speaking" : "Listen to article"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isPlaying ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0-12L8 8m4-2l4 2m-4 12l-4-2m4 2l4-2" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8L12 12l-5.25 4V8z" />}
                </svg>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onSave}
                className="p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700
                         transition-all duration-200"
                title={isSaved ? "Remove from saved" : "Save article"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${isSaved ? "text-red-500" : "text-neutral-700 dark:text-neutral-300"}`} fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </motion.button>
            </div>
          </div>
        )}

        {/* Only show this source indicator for variants other than hero/feature/text-only/title-only */}
        {!(variant === "hero" || variant === "feature" || variant === "text-only" || variant === "title-only" || variant === "thumbnail-square") && (
          <div className="flex items-center justify-between mb-1">
            {" "}
            {/* Reduced from mb-2 */}
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs font-medium text-neutral-600 
                       dark:text-neutral-400"
            >
              {source}
            </motion.span>
          </div>
        )}

        <motion.a href={url} target="_blank" rel="noopener noreferrer" className={variant === "text-only" || variant === "title-only" || variant === "thumbnail-square" ? "flex-grow" : ""}>
          <h2 className={`font-bold text-neutral-800 dark:text-neutral-100 ${getTitleClass()}`}>{title}</h2>
          {/* Deskripsi dengan format yang lebih baik */}
          <div className={`text-neutral-600 dark:text-neutral-300 mb-2 text-sm ${getDescriptionClass()} ${variant === "small" ? "hidden sm:block" : ""}`}>{formatDescription(description)}</div> {/* Added text-sm and reduced mb-3 to mb-2 */}
        </motion.a>
      </div>
    </motion.div>
  );
};

NewsCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  isSaved: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  isFeature: PropTypes.bool,
  variant: PropTypes.oneOf(["hero", "feature", "horizontal", "regular", "small", "text-only", "title-only", "thumbnail-square"]),
  priority: PropTypes.bool,
};

export default NewsCard;
