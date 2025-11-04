import React, { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await API.get("/users"); // ✅ ruta correcta
        setUsuarios(res.data);
      } catch (err) {
        console.error("❌ Error al obtener usuarios:", err);
        toast.error("Error al cargar los usuarios");
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6 text-center">
        ⚡ Panel de Energía Solar ⚡
      </h1>

      <p className="text-xl text-center mb-8">
        Bienvenido, <span className="font-semibold">{user?.nombre}</span>
      </p>

      <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Usuarios registrados
        </h2>

        {usuarios.length > 0 ? (
          <ul className="space-y-2">
            {usuarios.map((u) => (
              <li key={u._id} className="p-2 border rounded">
                {u.nombre} — {u.email}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center">
            No hay usuarios registrados todavía.
          </p>
        )}
      </div>
    </div>
  );
}
