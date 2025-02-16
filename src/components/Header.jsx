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
    <header className="bg-white/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="border-b border-gray-100">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                <span className="text-blue-600">N</span>
                <span>ewsApp</span>
              </Link>

              <ul className="flex items-center space-x-6">
                {[
                  { path: "/", label: "Indonesia" },
                  { path: "/programming", label: "Programming" },
                  { path: "/saved", label: "Saved" },
                ].map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`text-sm font-medium transition-all duration-200 px-2 py-1 rounded-full
                        ${location.pathname === item.path ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={handleSearch} className="relative w-full md:w-auto group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news..."
                className="w-full md:w-64 px-4 py-2 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-full
                  focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 
                  transition-all duration-200 group-hover:bg-gray-100"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                hover:text-blue-500 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
