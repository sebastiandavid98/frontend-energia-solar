import axios from "axios";

// URL DEL BACKEND LOCAL
const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 Enviar token automáticamente
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ========================== */
/*  🔐 AUTH                   */
/* ========================== */
export const loginUser = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  return res.data;
};

export const registerUser = async (formData) => {
  const res = await API.post("/auth/register", formData);
  return res.data;
};

/* ========================== */
/*  👤 USERS                  */
/* ========================== */
export const getUsers = async () => {
  const res = await API.get("/users");
  return res.data;
};

/* ========================== */
/*  ⚡ ENERGY                 */
/* ========================== */
export const getEnergy = async () => {
  const res = await API.get("/energy");
  return res.data;
};

export const createEnergy = async (data) => {
  const res = await API.post("/energy", data);
  return res.data;
};

/* ========================== */
/*  💸 TRANSACTIONS          */
/* ========================== */
export const getTransactions = async () => {
  const res = await API.get("/transactions");
  return res.data;
};

export const createTransaction = async (data) => {
  const res = await API.post("/transactions", data);
  return res.data;
};

export default API;
