import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">EnergiaSolar</Link>
        <div className="space-x-4">
          {!user ? (
            <>
              <Link to="/" className="hover:text-yellow-200">Login</Link>
              <Link to="/register" className="hover:text-yellow-200">Registro</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:text-yellow-200">Panel</Link>
              <button onClick={logout} className="ml-2 bg-yellow-400 text-black px-3 py-1 rounded">Salir</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
