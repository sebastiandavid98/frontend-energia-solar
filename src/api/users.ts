const API_URL = "https://backend-energia-solar.onrender.com/api/users";

export async function getUsers() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function createUser(user: any) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });
  return res.json();
}
