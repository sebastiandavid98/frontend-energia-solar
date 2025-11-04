import React, { useState, useContext } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser({ id: res.data.user.id, nombre: res.data.user.nombre });
      toast.success("Bienvenido");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>
        <input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Correo" className="w-full mb-2 p-2 border rounded"/>
        <input required type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Contraseña" className="w-full mb-4 p-2 border rounded"/>
        <button className="w-full bg-blue-600 text-white p-2 rounded">Entrar</button>
      </form>
    </div>
  );
}
