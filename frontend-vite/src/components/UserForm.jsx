import { useState } from "react";
import { API_URL } from "../api";

export default function UserForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Enviando...");

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Error response:", res.status, text);
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setMessage(`Usuario creado con id: ${data.id}`);
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 p-4 bg-slate-800 rounded"
    >
      <h2 className="text-lg font-bold mb-2">Crear usuario</h2>

      <input
        name="name"
        placeholder="Nombre"
        value={form.name}
        onChange={handleChange}
        className="border px-2 py-1 w-full text-black"
      />

      <input
        name="email"
        type="email"
        placeholder="Correo"
        value={form.email}
        onChange={handleChange}
        className="border px-2 py-1 w-full text-black"
      />

      <input
        name="password"
        type="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={handleChange}
        className="border px-2 py-1 w-full text-black"
      />

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="border px-2 py-1 w-full text-black"
      >
        <option value="USER">USUARIO</option>
        <option value="ADMIN">ADMIN</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-1 rounded mt-2"
      >
        Guardar usuario
      </button>

      {message && <p className="mt-2 text-sm">{message}</p>}
    </form>
  );
}
