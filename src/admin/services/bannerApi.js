import api from "../../api/axios";


export const getBanners = () => {
  return api.get("/banners/all");
};

export const getBanner = (id) => {
  return api.get(`/banners/${id}`);
};

export const createBanner = (formData) => {
  return api.post("/banners", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateBanner = (id, formData) => {
  return api.put(`/banners/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteBanner = (id) => {
  return api.delete(`/banners/${id}`);
};

export const getActiveBanners = () => {
  return api.get("/banners");
};