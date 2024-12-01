import PropTypes from "prop-types";

const NewsCard = ({ title, description, source, onSave, isSaved, url }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">{source}</span>
              <button onClick={onSave} className={`p-2 rounded-full transition-colors duration-200 ${isSaved ? "text-red-500 hover:bg-red-50" : "text-gray-400 hover:bg-gray-50"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            <a href={url} target="_blank" rel="noopener noreferrer" className="block group">
              <h2 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-200">{title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
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
};

export default NewsCard;
