import RouteBar from "./RouteBar";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet-routing-machine";
import L from "leaflet";

interface Coordinate {
  lat: number;
  lng: number;
}

const buildingCoordinates: Record<string, { lat: number; lng: number }> = {
  MCKN: { lat: 43.532677, lng: -80.227345 },
  ROZH: { lat: 43.53189, lng: -80.227614 },
  UC: { lat: 43.530392, lng: -80.226548 },
  THRN: { lat: 43.530619, lng: -80.225271 },
  RICHARDS: { lat: 43.531485, lng: -80.225411 },
  LIBRARY: { lat: 43.531401, lng: -80.227811 },
  SUMMERLEE: { lat: 43.530232, lng: -80.228482 },
  ALEX: { lat: 43.529194, lng: -80.227793 },
};

const ChangeMapView = ({ coords }: { coords: Coordinate }) => {
  const map = useMap();
  map.setView([coords.lat, coords.lng], 16);
  return null;
};

const RouteControl = ({ from, to }: { from: Coordinate; to: Coordinate }) => {
  const map = useMap();

  useEffect(() => {
    if (!from || !to) return;

    const fetchRoute = async () => {
      const accessToken = import.meta.env.VITE_MAPBOX_API_KEY;
      const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${from.lng},${from.lat};${to.lng},${to.lat}?geometries=geojson&access_token=${accessToken}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        const coords = data.routes[0].geometry.coordinates;
        const latlngs = coords.map(([lng, lat]: [number, number]) =>
          L.latLng(lat, lng)
        );

        const polyline = L.polyline(latlngs, { color: "blue" }).addTo(map);
        map.fitBounds(polyline.getBounds());

        return () => {
          map.removeLayer(polyline);
        };
      } catch (err) {
        console.error("Mapbox route error:", err);
        alert("Error fetching route.");
      }
    };

    const cleanup = fetchRoute();

    return () => {
      cleanup.then((remove) => remove && remove());
    };
  }, [from, to, map]);

  return null;
};

const MapPage = () => {
  const [fromCoords, setFromCoords] = useState<Coordinate | null>(null);
  const [userCoords, setUserCoords] = useState<Coordinate | null>(null);
  const [toCoords, setToCoords] = useState<Coordinate | null>(null);
  const [useLiveLocation, setUseLiveLocation] = useState(false);

  const handleRouteChange = (from: string, to: string) => {
    if (from.toLowerCase() === "current location") {
      setUseLiveLocation(true);
    } else {
      const fromCoords = buildingCoordinates[from.toUpperCase()];
      if (!fromCoords) {
        alert(`Invalid "from" building: ${from}`);
        return;
      }
      setFromCoords(fromCoords);
      setUseLiveLocation(false);
    }

    const toCoords = buildingCoordinates[to.toUpperCase()];
    if (!toCoords) {
      alert(`Invalid "to" building: ${to}`);
      return;
    }
    setToCoords(toCoords);
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
            activeCoords
              ? [activeCoords.lat, activeCoords.lng]
              : [43.531, -80.226]
          }
          zoom={16}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {useLiveLocation && userCoords && toCoords && (
            <RouteControl from={userCoords} to={toCoords} />
          )}
          {!useLiveLocation && fromCoords && toCoords && (
            <RouteControl from={fromCoords} to={toCoords} />
          )}
          {activeCoords && (
            <Marker position={[activeCoords.lat, activeCoords.lng]} />
          )}
          {toCoords && <Marker position={[toCoords.lat, toCoords.lng]} />}
          {activeCoords && <ChangeMapView coords={activeCoords} />}
        </MapContainer>
      </div>
    </main>
  );
};

export default MapPage;
