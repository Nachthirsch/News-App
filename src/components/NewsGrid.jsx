/* eslint-disable react/prop-types */
import NewsCard from "./NewsCard";

const NewsGrid = ({ news, onSave, savedNews }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-16 sm:mt-24 px-4">
      {news.map((item, index) => (
        <NewsCard key={index} title={item.headline.main} description={item.abstract} source={item.source} url={item.web_url} imageUrl={item.image_url} onSave={() => onSave(item)} isSaved={savedNews.some((saved) => saved.headline.main === item.headline.main)} />
      ))}
    </div>
  );
};

export default NewsGrid;
