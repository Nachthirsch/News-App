import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Header from "./components/Header";
import Home from "./pages/Home";
import Indonesia from "./pages/Indonesia";
import Programming from "./pages/Programming";
import Saved from "./pages/Saved";
import Search from "./pages/Search";
import Footer from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 transition-colors duration-500">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Indonesia" element={<Indonesia />} />
                <Route path="/programming" element={<Programming />} />
                <Route path="/saved" element={<Saved />} />
                <Route path="/search" element={<Search />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
