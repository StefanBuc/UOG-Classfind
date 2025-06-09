import RouteBar from "./RouteBar";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet-routing-machine";
import L from "leaflet";
import { useLocation } from "react-router-dom";

interface Coordinate {
  lat: number;
  lng: number;
}

const buildingCoordinates: Record<string, { lat: number; lng: number }> = {
  MCKN: { lat: 43.532677, lng: -80.227345 },
  ROZH: { lat: 43.53213354061019, lng: -80.22600666737355 },
  UC: { lat: 43.530392, lng: -80.226548 },
  THRN: { lat: 43.530619, lng: -80.225271 },
  RICHARDS: { lat: 43.531485, lng: -80.225411 },
  LIBRARY: { lat: 43.531401, lng: -80.227811 },
  SUMMERLEE: { lat: 43.530232, lng: -80.228482 },
  ALEX: { lat: 43.529194, lng: -80.227793 },
  LANG: { lat: 43.53411897187291, lng: -80.23088320113261 },
  LA: { lat: 43.535102086689584, lng: -80.23151100732953 },
  LAMBTON: { lat: 43.535294998650464, lng: -80.23018765672704 },
  MACDONALD: { lat: 43.53418741122162, lng: -80.23210598005609 },
  WARMEM: { lat: 43.532543530441025, lng: -80.2312910963297 },
  MILLS: { lat: 43.53327126392963, lng: -80.23041598068967 },
  CREELMAN: { lat: 43.53394647495128, lng: -80.22936668909834 },
  JOHNSTONHALL: { lat: 43.53296905204246, lng: -80.22867990731886 },
  REYNOLDS: { lat: 43.5307586268127, lng: -80.22908753004775 },
  MACLACHLAN: { lat: 43.53121399864506, lng: -80.22867838426788 },
  CRSC: { lat: 43.53177612740283, lng: -80.22471624071926 },
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
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchTerm = params.get("search");

  useEffect(() => {
    if (searchTerm) {
      const building = searchTerm.toUpperCase();
      if (building in buildingCoordinates) {
        setToCoords(buildingCoordinates[building]);
      } else {
        alert(`Invalid building name: ${building}`);
      }
    }
  }, []);

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
          {Object.entries(buildingCoordinates).map(([name, coords]) => (
            <Marker
              key={name}
              position={[coords.lat, coords.lng]}
              title={name}
              opacity={0.8}
            >
              <Popup>
                <strong>{name}</strong>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </main>
  );
};

export default MapPage;
