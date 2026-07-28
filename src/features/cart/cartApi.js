import api from "../../api/axios";

export const addToCart = (productId, quantity = 1) =>
  api.post("/cart", { productId, quantity });

export const getCart = () =>
  api.get("/cart");

export const updateCart = (productId, quantity) =>
  api.put("/cart", {
    productId,
    quantity,
  });

export const removeCartItem = (productId) =>
  api.delete("/cart", {
    data: { productId },
  });

export const clearCart = () =>
  api.delete("/cart/clear");