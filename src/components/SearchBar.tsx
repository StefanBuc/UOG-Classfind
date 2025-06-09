import { useState, useEffect } from "react";
import { loadRooms as loadRooms } from "./Classrooms.ts";
import { Navigate, useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState<string[]>([]);
  const [clickedRoom, setClickedRoom] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadRooms().then(setRooms);
  });

  const filteredRooms = rooms.filter(
    (room) =>
      room.toLowerCase().includes(searchTerm.toLowerCase()) &&
      clickedRoom !== room
  );

  return (
    <div className="w-full max-w-xl mx-auto mt-50 px-4 text-gray-600">
      <div className="relative">
        <input
          type="search"
          name="search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setClickedRoom("");
          }}
          placeholder="Search for a class, building or floor plan..."
          className="bg-white h-10 px-5 pr-24 w-full rounded-full text-sm focus:outline-none"
        />
        <button
          onClick={() =>
            navigate(`/map?search=${encodeURIComponent(searchTerm)}`)
          }
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {searchTerm && (
        <ul className="relative left-0 right-0 mt-2 bg-white rounded-md max-h-60 overflow-y-auto z-10">
          {filteredRooms.length > 0
            ? filteredRooms.map((room, index) => (
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  key={index}
                  onClick={() => {
                    setSearchTerm(room);
                    setClickedRoom(room);
                  }}
                >
                  {room}
                </li>
              ))
            : searchTerm !== clickedRoom && (
                <li className="px-4 py-2 text-gray-500">No results found</li>
              )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
