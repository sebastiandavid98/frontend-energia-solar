import { useState } from "react";
import { API_URL } from "../api";

export default function TransactionForm() {
  const [form, setForm] = useState({
    fromUserId: "",
    toUserId: "",
    amountKwh: "",
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
      const res = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amountKwh: Number(form.amountKwh),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Error response:", res.status, text);
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setMessage(`Transacción creada con id: ${data.id}`);
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-4 bg-slate-800 rounded">
      <h2 className="text-lg font-bold mb-2">Transacción de energía</h2>

      <input
        name="fromUserId"
        placeholder="Desde ID de usuario"
        value={form.fromUserId}
        onChange={handleChange}
        className="border px-2 py-1 w-full text-black"
      />
      <input
        name="toUserId"
        placeholder="Para ID de usuario"
        value={form.toUserId}
        onChange={handleChange}
        className="border px-2 py-1 w-full text-black"
      />
      <input
        name="amountKwh"
        placeholder="kWh"
        value={form.amountKwh}
        onChange={handleChange}
        className="border px-2 py-1 w-full text-black"
      />

      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-1 rounded mt-2"
      >
        Guardar transacción
      </button>

      {message && <p className="mt-2 text-sm">{message}</p>}
    </form>
  );
}
