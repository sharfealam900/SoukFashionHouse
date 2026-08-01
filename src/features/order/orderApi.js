import api from "../../api/axios";

// ==========================
// USER
// ==========================

export const placeOrder = (orderData) =>
  api.post("/orders", orderData);

export const getMyOrders = () =>
  api.get("/orders/my-orders");

export const getOrderDetails = (orderId) =>
  api.get(`/orders/details/${orderId}`);

export const cancelOrder = (orderId) =>
  api.put(`/orders/cancel/${orderId}`);

// ==========================
// ADMIN
// ==========================

export const getAllOrders = () =>
  api.get("/admin/orders");

export const updateOrderStatus = (orderId, orderStatus) =>
  api.put(`/admin/orders/${orderId}`, {
    orderStatus,
  });



  export const exportOrdersExcel = () =>
  api.get(
    "/orders/admin/export/excel",
    {
      responseType: "blob",
    }
  );