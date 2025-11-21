import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Cargar el usuario si ya hay token guardado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = jwtDecode(token);
        setUser({ id: payload.id, nombre: payload.nombre });
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  // 🔹 FUNCIÓN LOGIN (ESTO FALTABA)
  const login = async (email) => {
    try {
      const response = await axios.post(
        "https://backend-energia-solar.onrender.com/api/users/login",
        { email }
      );

      const { token } = response.data;

      localStorage.setItem("token", token);

      const payload = jwtDecode(token);
      setUser({ id: payload.id, nombre: payload.nombre });

      return true;
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
