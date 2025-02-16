import PropTypes from "prop-types";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const NewsCard = ({ title, description, source, onSave, isSaved, url, imageUrl }) => {
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white dark:bg-gray-800 rounded-xl 
                 shadow-sm hover:shadow-md transition-all duration-300 
                 overflow-hidden border border-gray-200 dark:border-gray-700
                 flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <motion.img src={imageUrl} alt={title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" onError={(e) => (e.target.src = "/fallback-image.jpg")} layoutId={`image-${url}`} />

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSpeak}
            className="p-2 rounded-full bg-white/90 hover:bg-white shadow-sm
                     transition-all duration-200 backdrop-blur-sm"
            title={isPlaying ? "Stop speaking" : "Listen to article"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isPlaying ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0-12L8 8m4-2l4 2m-4 12l-4-2m4 2l4-2" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8L12 12l-5.25 4V8z" />}
            </svg>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="p-2 rounded-full bg-white/90 hover:bg-white shadow-sm
                     transition-all duration-200 backdrop-blur-sm"
            title="Share article"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700 group-hover:text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onSave}
            className="p-2 rounded-full bg-white/90 hover:bg-white shadow-sm
                     transition-all duration-200 backdrop-blur-sm"
            title={isSaved ? "Remove from saved" : "Save article"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-700 group-hover:text-red-500 ${isSaved ? "text-red-500" : "text-gray-700 group-hover:text-red-500"}`} fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </motion.button>
        </div>
      </div>

      <div className="flex flex-col flex-grow p-4 gap-3">
        <div className="flex items-center justify-between">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-2.5 py-1 text-xs font-medium text-blue-600 
                     bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 
                     rounded-full"
          >
            {source}
          </motion.span>

          <span className="text-xs text-gray-500 dark:text-gray-400">{Math.ceil(description.length / 200)} min read</span>
        </div>

        <motion.a href={url} target="_blank" rel="noopener noreferrer" className="flex-grow">
          <h2
            className="text-lg font-semibold text-gray-900 dark:text-white 
                       group-hover:text-blue-600 dark:group-hover:text-blue-400 
                       transition-colors duration-200 line-clamp-2 mb-2"
          >
            {title}
          </h2>
          <p
            className="text-sm text-gray-600 dark:text-gray-300 
                      leading-relaxed line-clamp-3"
          >
            {description}
          </p>
        </motion.a>

        <div
          className="flex items-center justify-end pt-3 mt-auto
                      border-t border-gray-100 dark:border-gray-700"
        >
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-blue-600 dark:text-blue-400
                      hover:underline"
          >
            Read more →
          </a>
        </div>
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
};

export default NewsCard;
