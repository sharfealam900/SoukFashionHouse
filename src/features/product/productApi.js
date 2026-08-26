import api from "../../api/axios";

let homeSectionsRequest = null;

export const getProducts = (params = {}) => {
  return api.get("/products", {
    params,
  });
};

export const getProduct = (id) => {
  return api.get(`/products/${id}`);
};

export const getHomeSections = () => {
  if (!homeSectionsRequest) {
    homeSectionsRequest = api
      .get("/products/home-sections")
      .catch((error) => {
        homeSectionsRequest = null;
        throw error;
      });
  }

  return homeSectionsRequest;
};

export const createProduct = (formData) => {
  return api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateProduct = (id, formData) => {
  return api.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProduct = (id) => {
  return api.delete(`/products/${id}`);
};

export const getRelatedProducts = (
  categoryId,
  productId
) => {
  return api.get(
    `/products/related/${categoryId}/${productId}`
  );
};