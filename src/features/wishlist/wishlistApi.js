import api from "../../api/axios";

export const getWishlist = () => api.get("/wishlist");

export const addToWishlist = (productId) =>
  api.post("/wishlist", { productId });

export const removeWishlistItem = (productId) =>
  api.delete(`/wishlist/${productId}`);

export const clearWishlist = () =>
  api.delete("/wishlist");