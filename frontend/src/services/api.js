import axios from "axios";

const normalizeApiBaseUrl = (value) => {
  if (!value) return "/api";

  const cleaned = value.trim().replace(/\/+$/, "");
  if (!cleaned) return "/api";

  if (/^https?:\/\//i.test(cleaned)) {
    const url = new URL(cleaned);
    const pathname = url.pathname.replace(/\/+$/, "");

    if (!pathname || pathname === "/") {
      url.pathname = "/api";
      return url.toString().replace(/\/+$/, "");
    }

    return cleaned;
  }

  return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
};

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

const apiOrigin = (() => {
  const explicitOrigin = import.meta.env.VITE_API_ORIGIN?.trim().replace(
    /\/+$/,
    "",
  );
  if (explicitOrigin) return explicitOrigin;

  if (/^https?:\/\//i.test(API_BASE_URL)) {
    return new URL(API_BASE_URL).origin;
  }

  return "";
})();

export const getAssetUrl = (assetPath) => {
  if (!assetPath) return "";
  if (/^(https?:|data:|blob:)/i.test(assetPath)) return assetPath;

  const normalizedPath = assetPath.startsWith("/")
    ? assetPath
    : `/${assetPath}`;
  return apiOrigin ? `${apiOrigin}${normalizedPath}` : normalizedPath;
};

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to admin requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ki_gostoso_token");

  if (token && config.url?.startsWith("/admin")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Public endpoints
export const getCategories = () => api.get("/categories");
export const getProducts = (params) => api.get("/products", { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const createOrder = (data) => api.post("/orders", data);
export const getOrderById = (id) => api.get(`/orders/${id}`);

// Admin endpoints
export const adminLogin = (data) => api.post("/admin/login", data);
export const adminGetProducts = (params) =>
  api.get("/admin/products", { params });

export const adminCreateProduct = (formData) =>
  api.post("/admin/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const adminUpdateProduct = (id, formData) =>
  api.put(`/admin/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const adminDeleteProduct = (id) => api.delete(`/admin/products/${id}`);
export const adminGetOrders = (params) => api.get("/admin/orders", { params });
export const adminUpdateOrderStatus = (id, status) =>
  api.patch(`/admin/orders/${id}/status`, { status });

export const adminGetCategories = () => api.get("/admin/categories");

// ViaCEP
export const fetchCep = (cep) =>
  axios.get(`https://viacep.com.br/ws/${cep.replace(/\D/g, "")}/json/`);

export default api;
