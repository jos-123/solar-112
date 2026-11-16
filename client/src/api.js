
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function getToken() {
  return localStorage.getItem("hm_admin_token");
}

async function request(path, options = {}, token = null) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

// Existing admin and public API requests
export function api(path, options = {}) {
  return request(path, options, getToken());
}

// Customer-authenticated API requests
export function customerApi(path, options = {}) {
  const token = localStorage.getItem("hm_customer_token");
  return request(path, options, token);
}
