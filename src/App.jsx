import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Header from "./components/Header";
import Home from "./pages/Home";
import Programming from "./pages/Programming";
import Saved from "./pages/Saved";
import Search from "./pages/Search";
import Footer from "./components/Footer";
function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/programming" element={<Programming />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
