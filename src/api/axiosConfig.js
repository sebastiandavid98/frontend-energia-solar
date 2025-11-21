import axios from "axios";

// Crear instancia de Axios apuntando al backend correcto
const API = axios.create({
  baseURL: "http://localhost:8080/api", // Cambiar si despliegas a la nube
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para enviar token JWT en cada request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // El token se guarda en login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
