import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="bg-white/80 dark:bg-neutral-900/90 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <nav className="container mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
              <span className="text-neutral-600 dark:text-neutral-400">N</span>ewsApp
            </Link>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 sm:hidden">
              <button onClick={toggleDarkMode} className="p-2">
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-neutral-600 dark:text-neutral-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-4 flex-1 justify-between ml-8">
              <ul className="flex items-center gap-4">
                {[
                  { path: "/", label: "Home" },
                  { path: "/Indonesia", label: "Indonesia" },
                  { path: "/programming", label: "Programming" },
                  { path: "/saved", label: "Saved" },
                ].map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`text-sm font-medium px-3 py-1.5 rounded-full whitespace-nowrap
                        ${location.pathname === item.path ? "text-neutral-800 bg-neutral-200 dark:text-neutral-100 dark:bg-neutral-800" : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80"}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-4">
                <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  {darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
                <form onSubmit={handleSearch} className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search news..."
                    className="w-full sm:w-64 px-4 py-2 pr-10 text-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full
                      focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700 focus:border-neutral-400 
                      transition-all duration-200 group-hover:bg-neutral-200/50 dark:group-hover:bg-neutral-700/80
                      dark:text-neutral-300 dark:placeholder-neutral-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 
                  hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="flex flex-col gap-4 py-4">
              <ul className="flex flex-col gap-2">
                {[
                  { path: "/", label: "Home" },
                  { path: "/Indonesia", label: "Indonesia" },
                  { path: "/programming", label: "Programming" },
                  { path: "/saved", label: "Saved" },
                ].map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-3 py-2 rounded-lg text-sm font-medium
                        ${location.pathname === item.path ? "text-neutral-800 bg-neutral-200 dark:text-neutral-100 dark:bg-neutral-800" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/80"}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search news..."
                  className="w-full px-4 py-2 text-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 
                    dark:border-neutral-700 rounded-lg dark:text-neutral-300 dark:placeholder-neutral-500"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 
                  hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
