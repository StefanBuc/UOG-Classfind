import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md flex items-center justify-between top-0">
      <Link to="/" className="rounded-md px-0.5 text-xl font-semibold">
        UOG Classfind
      </Link>
      <ul className="flex gap-4">
        <li>
          <Link to="/" className="hover:bg-gray-700 px-1.5 py-1 rounded-md">
            Home
          </Link>
        </li>
        <li>
          <Link to="/map" className="hover:bg-gray-700 px-1.5 py-1 rounded-md">
            Map
          </Link>
        </li>
        <li>
          <Link to="#" className="hover:bg-gray-700 px-1.5 py-1 rounded-md">
            Floor Plans
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
