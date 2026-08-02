

/* =========================
   Dashboard
========================= */

import api from "../../api/axios";

export const getDashboardStats = () =>
  api.get("/admin/dashboard");

/* =========================
   Products
========================= */

export const getProducts = () =>
  api.get("/products");

export const getProduct = (id) =>
  api.get(`/products/${id}`);

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
   Orders
========================= */

export const getOrders = () =>
  api.get("/orders/admin");

export const updateOrderStatus = (id, status) =>
  api.put(`/orders/${id}/status`, { status });

/* =========================
   Coupons
========================= */

export const getCoupons = () =>
  api.get("/coupons");

export const createCoupon = (data) =>
  api.post("/coupons", data);

export const updateCoupon = (id, data) =>
  api.put(`/coupons/${id}`, data);

export const deleteCoupon = (id) =>
  api.delete(`/coupons/${id}`);

/* =========================
   Banner
========================= */

export const getBanners = () =>
  api.get("/banners");

export const createBanner = (formData) =>
  api.post("/banners", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateBanner = (id, formData) =>
  api.put(`/banners/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteBanner = (id) =>
  api.delete(`/banners/${id}`);

export default api;