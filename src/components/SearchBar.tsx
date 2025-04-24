import React, { useState } from "react";

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="w-full max-w-xl mx-auto mt-50 px-4 text-gray-600">
      <input
        type="search"
        name="search"
        placeholder="Search for a class, building or floor plan..."
        className="bg-white h-10 px-5 pr-10 w-full rounded-full text-sm focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;
