import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              NewsApp
            </Link>
            <ul className="flex items-center space-x-6">
              <li>
                <Link to="/" className={`text-sm font-medium transition-colors duration-200 ${location.pathname === "/" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}>
                  Indonesia
                </Link>
              </li>
              <li>
                <Link to="/programming" className={`text-sm font-medium transition-colors duration-200 ${location.pathname === "/programming" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}>
                  Programming
                </Link>
              </li>
              <li>
                <Link to="/saved" className={`text-sm font-medium transition-colors duration-200 ${location.pathname === "/saved" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}>
                  Saved
                </Link>
              </li>
            </ul>
          </div>

          <form onSubmit={handleSearch} className="relative w-full md:w-auto">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search news..." className="w-full md:w-64 px-4 py-2 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200" />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
};

export default Header;
