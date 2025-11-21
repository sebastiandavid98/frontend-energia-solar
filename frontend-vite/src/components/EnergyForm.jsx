import { useState } from "react";
import { API_URL } from "../api";

export default function EnergyForm() {
  const [form, setForm] = useState({
    userId: "",
    productionKwh: "",
    consumptionKwh: "",
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
    setMessage("Envío...");

    try {
      const res = await fetch(`${API_URL}/energy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          productionKwh: Number(form.productionKwh),
          consumptionKwh: Number(form.consumptionKwh),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Error response:", res.status, text);
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setMessage(`Registro de energía creado con id: ${data.id}`);
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-4 bg-slate-800 rounded">
      <h2 className="text-lg font-bold mb-2">Récord energético</h2>

      <input
        name="userId"
        placeholder="ID de usuario"
        value={form.userId}
        onChange={handleChange}
        className="border px-2 py-1 w-full text-black"
      />
      <input
        name="productionKwh"
        placeholder="Producción kWh"
        value={form.productionKwh}
        onChange={handleChange}
        className="border px-2 py-1 w-full text-black"
      />
      <input
        name="consumptionKwh"
        placeholder="Consumo kWh"
        value={form.consumptionKwh}
        onChange={handleChange}
        className="border px-2 py-1 w-full text-black"
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-1 rounded mt-2"
      >
        Ahorra energía
      </button>

      {message && <p className="mt-2 text-sm">{message}</p>}
    </form>
  );
}
