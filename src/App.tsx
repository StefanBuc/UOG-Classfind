import NavBar from "./components/NavBar";
import Search from "./components/SearchBar";

function App() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url(/images/mainBackground.webp)" }}
    >
      <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
      <div className="relative z-10">
        <NavBar />
        <main>
          <Search />
        </main>
      </div>
    </div>
  );
}

export default App;
