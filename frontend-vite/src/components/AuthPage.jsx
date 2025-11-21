import { useState } from "react";
import { Sun } from "lucide-react";
import { API_URL } from "../api/api";

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
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
    setMessage("Procesando...");

    try {
      const url =
        mode === "register"
          ? `${API_URL}/auth/register`
          : `${API_URL}/auth/login`;

      const body =
        mode === "register"
          ? {
              name: form.name,
              email: form.email,
              password: form.password,
            }
          : {
              email: form.email,
              password: form.password,
            };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Correo o contraseña inválidos");
        const text = await res.text();
        console.error("Error auth:", res.status, text);
        throw new Error("No se pudo obtener respuesta del servidor");
      }

      const data = await res.json();
      const user = data.user || data; // según devuelva el backend
      onLogin(user);
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/30 overflow-hidden">
          <div className="p-8">
            {/* LOGO + TÍTULO */}
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2.5 rounded-xl mr-3">
                <Sun className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  Solsex
                </h1>
                <p className="text-xs text-slate-400">
                  Plataforma de Intercambio de Energía Solar
                </p>
              </div>
            </div>

            {/* TABS LOGIN / REGISTRO */}
            <div className="flex justify-center gap-6 text-sm mb-6">
              <button
                className={
                  mode === "login"
                    ? "text-purple-400 font-semibold underline"
                    : "text-slate-400 hover:text-white"
                }
                onClick={() => {
                  setMode("login");
                  setMessage("");
                }}
              >
                Iniciar sesión
              </button>
              <button
                className={
                  mode === "register"
                    ? "text-purple-400 font-semibold underline"
                    : "text-slate-400 hover:text-white"
                }
                onClick={() => {
                  setMode("register");
                  setMessage("");
                }}
              >
                Registro
              </button>
            </div>

            {/* FORMULARIO */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === "register" && (
                <input
                  name="name"
                  placeholder="Nombre"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              )}

              <input
                name="email"
                type="email"
                placeholder="Correo"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />

              <input
                name="password"
                type="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-sm shadow-lg transition transform hover:scale-[1.01]"
              >
                {mode === "register" ? "Crear cuenta" : "Entrar"}
              </button>

              {message && (
                <p className="text-xs text-slate-300 mt-2">{message}</p>
              )}
            </form>
          </div>
        </div>

        <p className="text-[11px] text-center text-slate-500 mt-4">
          Proyecto académico · Simulación de trading de energía solar
        </p>
      </div>
    </div>
  );
}
