import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./components/Homepage";
import MapPage from "./components/MapPage";

function App() {
  return (
    <Router>
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url(/images/mainBackground.webp)" }}
      >
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
        <div className="relative z-10">
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
