import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md flex items-center justify-between top-0">
      <h1 className="text-xl font-semibold"> UOG Classfind</h1>
      <ul className="flex gap-4">
        <li>
          <a href="#" className="hover:bg-gray-700 px-1.5 py-1 rounded-md">
            Home
          </a>
        </li>
        <li>
          <a href="#" className="hover:bg-gray-700 px-1.5 py-1 rounded-md">
            Map
          </a>
        </li>
        <li>
          <a href="#" className="hover:bg-gray-700 px-1.5 py-1 rounded-md">
            Floor Plans
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
