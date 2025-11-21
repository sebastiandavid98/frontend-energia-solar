import { useState } from "react";
import { registerUser } from "../api/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await registerUser(form);
    setMsg("Usuario registrado correctamente");
  };

  return (
    <div>
      <h1>Registro</h1>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Nombre" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} />

        <button type="submit">Registrar</button>
      </form>

      {msg && <p>{msg}</p>}
    </div>
  );
}
