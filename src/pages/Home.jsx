import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIndonesiaNews, saveNews, unsaveNews } from '../store/slices/newsSlice';
import NewsGrid from '../components/NewsGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const dispatch = useDispatch();
  const { indonesiaNews, savedNews, loading, error } = useSelector((state) => state.news);

  useEffect(() => {
    dispatch(fetchIndonesiaNews());
  }, [dispatch]);

  const handleSave = (article) => {
    const isAlreadySaved = savedNews.some(
      saved => saved.headline.main === article.headline.main
    );
    
    if (isAlreadySaved) {
      dispatch(unsaveNews(article));
    } else {
      dispatch(saveNews(article));
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-2">Berita Indonesia Terkini</h1>
      <p className="text-gray-600 mb-6">
        Kumpulan berita terbaru dari berbagai sumber terpercaya
      </p>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <NewsGrid 
          news={indonesiaNews} 
          onSave={handleSave}
          savedNews={savedNews}
        />
      )}
    </div>
  );
};

export default Home;