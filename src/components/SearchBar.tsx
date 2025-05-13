import { useState, useEffect } from "react";
import { loadRooms as loadRooms } from "./Classrooms.ts";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState<string[]>([]);
  const [clickedRoom, setClickedRoom] = useState("");

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
      <input
        type="search"
        name="search"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setClickedRoom("");
        }}
        placeholder="Search for a class, building or floor plan..."
        className="bg-white h-10 px-5 pr-10 w-full rounded-full text-sm focus:outline-none"
      />

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
