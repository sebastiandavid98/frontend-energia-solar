import { useEffect, useState } from "react";
import { getUsers } from "../api/api";

export default function Dashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      }
    }
    loadUsers();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Dashboard</h1>
      <h2>Usuarios desde el backend Java 🚀</h2>

      {users.length === 0 ? (
        <p>Cargando usuarios...</p>
      ) : (
        <pre
          style={{
            background: "#222",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            marginTop: "20px",
            overflowX: "auto",
          }}
        >
          {JSON.stringify(users, null, 2)}
        </pre>
      )}
    </div>
  );
}
