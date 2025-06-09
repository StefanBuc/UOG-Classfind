import React, { useState } from "react";
import { LocateIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

interface RouteBarProps {
  onRouteChange: (from: string, to: string) => void;
  onLiveLocation: () => void;
}

const RouteBar = ({ onRouteChange, onLiveLocation }: RouteBarProps) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchTerm = params.get("search");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchTerm = params.get("search");
    if (searchTerm) {
      setTo(searchTerm);
    }
  }, []);

  const handleRoute = () => {
    if (from && to) {
      onRouteChange(from, to);
    }
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setFrom(`Current Location`);
      onLiveLocation();
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-2xl">
      <div className="flex flex-col gap-4 text-gray-600">
        <div className="relative">
          <input
            type="text"
            placeholder="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleMyLocation}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
            title="Use my location"
          >
            <LocateIcon size={20} />
          </button>
        </div>

        <input
          type="text"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleRoute}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
        >
          Go
        </button>
      </div>
    </div>
  );
};

export default RouteBar;
