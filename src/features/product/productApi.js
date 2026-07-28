import api from "../../api/axios";

// Get all products
export const getProducts = (params = {}) => {
  return api.get("/products", { params });
};

// Get single product
export const getProduct = (id) => {
  return api.get(`/products/${id}`);
};

// Create product
export const createProduct = (formData) => {
  return api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Update product
export const updateProduct = (id, formData) => {
  return api.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Delete product
export const deleteProduct = (id) => {
  return api.delete(`/products/${id}`);
};

// Get related products
export const getRelatedProducts = (categoryId, productId) => {
  return api.get(
    `/products/related/${categoryId}/${productId}`
  );
};