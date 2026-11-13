async function request(path, token, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) }
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.message || "Request failed.");
  return data;
}
export const createAccount = payload => request("/api/auth/signup", null, { method: "POST", body: JSON.stringify(payload) });
export const loginAccount = payload => request("/api/auth/login", null, { method: "POST", body: JSON.stringify(payload) });
export const logoutAccount = token => request("/api/auth/logout", token, { method: "POST" });
export const fetchCart = token => request("/api/cart", token);
export const addCartProduct = (token, productId) => request("/api/cart", token, { method: "POST", body: JSON.stringify({ productId, quantity: 1 }) });
export const changeCartQuantity = (token, productId, quantity) => request(`/api/cart/${encodeURIComponent(productId)}`, token, { method: "PATCH", body: JSON.stringify({ quantity }) });
export const removeCartProduct = (token, productId) => request(`/api/cart/${encodeURIComponent(productId)}`, token, { method: "DELETE" });
