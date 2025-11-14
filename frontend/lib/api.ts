export const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9001";

export async function api(path: string, init: RequestInit = {}) {
  const config: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    ...init,
  };

  const res = await fetch(`${API}${path}`, config);

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw {
      status: res.status,
      data,
    };
  }

  return data;
}
