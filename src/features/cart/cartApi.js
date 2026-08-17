import api from "../../api/axios";

export const addToCart = (
    productId,
    quantity = 1,
    size = "",
    color = ""
) =>
    api.post("/cart", {
        productId,
        quantity,
        size,
        color,
    });



export const getCart = () =>
  api.get("/cart");



export const updateCart = (
  productId,
  quantity,
  size,
  color = ""
) =>
  api.put("/cart", { productId, quantity, size, color,});


export const removeCartItem = (
  productId,
  size,
  color = ""
) =>
  api.delete("/cart", { data: { productId,size,color,},});

export const clearCart = () =>
  api.delete("/cart/clear");