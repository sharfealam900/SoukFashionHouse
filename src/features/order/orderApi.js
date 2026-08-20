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
// RAZORPAY
// ==========================

export const createRazorpayOrder = async ({
  shippingAddress,
  couponCode,
}) => {
  const { data } = await api.post(
    "/payment/create-order",
    {
      shippingAddress,
      couponCode,
    }
  );

  return data;
};


export const verifyRazorpayPayment = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  shippingAddress,
  couponCode,
}) => {
  const { data } = await api.post(
    "/payment/verify",
    {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingAddress,
      couponCode,
    }
  );

  return data;
};


// ==========================
// ADMIN
// ==========================

export const getAllOrders = () =>
  api.get("/admin/orders");

export const updateOrderStatus = (
  orderId,
  orderStatus
) =>
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