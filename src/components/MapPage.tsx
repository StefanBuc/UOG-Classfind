import RouteBar from "./RouteBar";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";

interface Coordinate {
  lat: number;
  lng: number;
}

const ChangeMapView = ({ coords }: { coords: Coordinate }) => {
  const map = useMap();
  map.setView([coords.lat, coords.lng], 16);
  return null;
};

const MapPage = () => {
  const [fromCoords, setFromCoords] = useState<Coordinate | null>(null);
  const [userCoords, setUserCoords] = useState<Coordinate | null>(null);
  const [useLiveLocation, setUseLiveLocation] = useState(false);

  const handleRouteChange = (from: string, to: string) => {
    const match = from.match(/Latitude: ([\d.-]+), Longitude: ([\d.-]+)/);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      setFromCoords({ lat, lng });
    } else {
      alert(
        "Invalid coordinates format. Please use 'Latitude: x, Longitude: y'."
      );
    }
  };


  const handleLiveLocation = () => {
    setUseLiveLocation(true);
  };

  useEffect(() => {
    if (!useLiveLocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
      },
      (error) => {
        alert("Error tracking location: " + error.message);
      },
      {
        enableHighAccuracy: true,
      }
    );
       return () => navigator.geolocation.clearWatch(watchId);
  }, [useLiveLocation]);

  const activeCoords = useLiveLocation ? userCoords : fromCoords;

  return (
    <main className="flex items-center justify-center p-4 mt-12">
      <RouteBar
        onRouteChange={handleRouteChange}
        onLiveLocation={handleLiveLocation}
      />

      <div className="w-full max-w-[1000px] h-[70vh] rounded-lg shadow-lg overflow-hidden border">
        <MapContainer
          center={
            activeCoords ? [activeCoords.lat, activeCoords.lng] : [43.531, -80.226]
          }
          zoom={16}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {activeCoords && <Marker position={[activeCoords.lat, activeCoords.lng]} />}
          {activeCoords && <ChangeMapView coords={activeCoords} />}
        </MapContainer>
      </div>
    </main>
  );
};

export default MapPage;
