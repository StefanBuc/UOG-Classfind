const MapPage = () => {
  return (
    <main className="flex items-center justify-center p-4 mt-12">
      <iframe
        title="OpenStreetMap"
        src="https://www.openstreetmap.org/export/embed.html?bbox=-80.23696303367616%2C43.5264597644908%2C-80.2159345149994%2C43.53632274434707&layer=mapnik"
        className="w-full max-w-[1000px] h-[70vh] rounded-lg shadow-lg border"
      ></iframe>
    </main>
  );
};

export default MapPage;