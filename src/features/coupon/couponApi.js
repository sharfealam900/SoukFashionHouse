import api from "../../api/axios";



export const applyCoupon = async (data) => {
  const response = await api.post("/coupons/apply", data);

  return response.data;
};