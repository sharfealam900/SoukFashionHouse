import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import CartItem from "../Components/Cart/CartItem";
import EmptyCart from "../Components/Cart/EmptyCart";
import CartSummary from "../Components/Cart/CartSummary";

import {
  updateCart,
  removeCartItem,
} from "../features/cart/cartApi";

import {
  setCart,
  updateItemQuantity,
  removeItem,
} from "../features/cart/cartSlice";

import { toast } from "react-hot-toast";

export default function Cart() {
  const { items, cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Remove deleted products
  const validItems = items.filter((item) => item.product);

  const handleIncrease = async (item) => {
    const newQuantity = item.quantity + 1;

    dispatch(
      updateItemQuantity({
        productId: item.product._id,
        size: item.size || "",
        color: item.color || "",
        quantity: newQuantity,
      })
    );

    try {
      await updateCart(
        item.product._id,
        newQuantity,
        item.size || "",
        item.color || ""
      );
    } catch (error) {
      dispatch(
        updateItemQuantity({
          productId: item.product._id,
          size: item.size || "",
          color: item.color || "",
          quantity: item.quantity,
        })
      );

      toast.error("Unable to update quantity");
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) return;

    const newQuantity = item.quantity - 1;

    dispatch(
      updateItemQuantity({
        productId: item.product._id,
        size: item.size || "",
        color: item.color || "",
        quantity: newQuantity,
      })
    );

    try {
      await updateCart(
        item.product._id,
        newQuantity,
        item.size || "",
        item.color || ""
      );
    } catch (error) {
      dispatch(
        updateItemQuantity({
          productId: item.product._id,
          size: item.size || "",
          color: item.color || "",
          quantity: item.quantity,
        })
      );

      toast.error("Unable to update quantity");
    }
  };

  const handleRemove = async (item) => {
    const previousCart = cart;

    dispatch(
      removeItem({
        productId: item.product._id,
        size: item.size || "",
        color: item.color || "",
      })
    );

    try {
      await removeCartItem(
        item.product._id,
        item.size || "",
        item.color || ""
      );

      toast.success("Item removed from cart");
    } catch (error) {
      dispatch(setCart(previousCart));

      toast.error("Unable to remove item");
    }
  };

  return (
    <>
      <Navbar />

      <section className="cart-page container py-5">
        <h1 className="mb-4">
          Shopping Bag ({validItems.length})
        </h1>

        {validItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {validItems.map((item) => (
                <CartItem
                  key={`${item.product._id}-${item.size || "no-size"}-${
                    item.color || "no-color"
                  }`}
                  item={item}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            <CartSummary items={validItems} />
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}