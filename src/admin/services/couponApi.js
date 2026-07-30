import api from "../../api/axios";


// ================= GET ALL COUPONS =================


export const getCoupons = () => {
  return api.get("/coupons");
};

// ================= GET SINGLE COUPON =================

export const getCoupon = (id) => {
  return api.get(`/coupons/${id}`);
};

// ================= CREATE COUPON =================

export const createCoupon = (data) => {
  return api.post("/coupons", data);
};

// ================= UPDATE COUPON =================

export const updateCoupon = (id, data) => {
  return api.put(`/coupons/${id}`, data);
};

// ================= DELETE COUPON =================

export const deleteCoupon = (id) => {
  return api.delete(`/coupons/${id}`);
};