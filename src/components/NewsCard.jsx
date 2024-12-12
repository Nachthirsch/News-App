import PropTypes from "prop-types";

const NewsCard = ({ title, description, source, onSave, isSaved, url, imageUrl }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
      <div className="relative">
        <img src={imageUrl} alt={title} className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105" />
        <span className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">{source}</span>
      </div>
      <div className="p-5">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <a href={url} target="_blank" rel="noopener noreferrer" className="block group">
              <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">{title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{description}</p>
            </a>
          </div>
          <div className="flex items-center justify-between mt-4">
            <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors duration-200">
              Read More
            </a>
            <button onClick={onSave} className={`p-2 rounded-full transition-colors duration-200 ${isSaved ? "text-red-500 hover:bg-red-50" : "text-gray-400 hover:bg-gray-50"}`} aria-label={isSaved ? "Unsave article" : "Save article"}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
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
