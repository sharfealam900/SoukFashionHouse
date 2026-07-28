import axios from "axios";
import api from "../../api/axios";

const adminApi = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

/* =========================
   Dashboard
========================= */

export const getDashboardStats = () =>
  adminApi.get("/admin/dashboard");

/* =========================
   Products
========================= */

export const getProducts = () =>
  adminApi.get("/products");

export const getProduct = (id) =>
  adminApi.get(`/products/${id}`);

export const createProduct = (formData) =>
  api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateProduct = (id, formData) =>
  api.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);

export const deleteProductImage = (id, imageId) =>
  api.delete(
    `/products/${id}/images/${encodeURIComponent(imageId)}`
  );

/* =========================
   Categories
========================= */

export const getCategories = () =>
  api.get("/categories");

export const createCategory = (data) =>
  api.post("/categories", data);

export const updateCategory = (id, data) =>
  api.put(`/categories/${id}`, data);

export const deleteCategory = (id) =>
  api.delete(`/categories/${id}`);

/* =========================
   Export
========================= */

export default adminApi;