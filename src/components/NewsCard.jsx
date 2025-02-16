import PropTypes from "prop-types";
import { useState } from "react";

const NewsCard = ({ title, description, source, onSave, isSaved, url, imageUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState(null);

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 flex space-x-1 sm:space-x-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button onClick={handleSpeak} className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200" title={isPlaying ? "Stop speaking" : "Listen to article"}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isPlaying ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />}
          </svg>
        </button>
        <button onClick={handleShare} className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200" title="Share article">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
        <button
          onClick={onSave}
          className={`p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm transition-colors duration-200 
            ${isSaved ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30" : "text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div>
        <div className="relative">
          <img src={imageUrl} alt={title} className="w-full h-36 sm:h-48 object-cover" onError={(e) => (e.target.src = "/fallback-image.jpg")} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        </div>

        <div className="p-3 sm:p-4">
          <div className="flex flex-col gap-2">
            <span className="px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full w-fit">{source}</span>

            <a href={url} target="_blank" rel="noopener noreferrer" className="group space-y-2">
              <h2 className="text-base sm:text-lg font-semibold line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{description}</p>
            </a>
          </div>
        </div>
      </div>
    </div>
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
