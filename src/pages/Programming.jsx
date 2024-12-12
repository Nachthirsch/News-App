import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProgrammingNews, saveNews, unsaveNews } from "../store/slices/newsSlice";
import NewsGrid from "../components/NewsGrid";
import LoadingSpinner from "../components/LoadingSpinner";

const Programming = () => {
  const dispatch = useDispatch();
  const { programmingNews, savedNews, loading, error } = useSelector((state) => state.news);

  useEffect(() => {
    dispatch(fetchProgrammingNews());
  }, [dispatch]);

  const handleSave = (article) => {
    const isAlreadySaved = savedNews.some((saved) => saved.headline.main === article.headline.main);

    if (isAlreadySaved) {
      dispatch(unsaveNews(article));
    } else {
      dispatch(saveNews(article));
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Programming News</h1>
        <p className="text-gray-600">Latest programming and technology news from around the world</p>
      </div>

      {programmingNews.length === 0 ? <div className="text-center text-gray-600 py-8">No programming news available at the moment.</div> : <NewsGrid news={programmingNews} onSave={handleSave} savedNews={savedNews} />}
    </div>
  );
};

export default Programming;
