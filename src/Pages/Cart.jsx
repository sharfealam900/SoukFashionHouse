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
import SEO from "../Components/SEO";

export default function Cart() {
  const { items, cart } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  // =====================================================
  // REMOVE DELETED / INVALID PRODUCTS
  // =====================================================

  const validItems = items.filter(
    (item) => item?.product
  );

  // =====================================================
  // GET AVAILABLE STOCK
  // =====================================================

  const getAvailableStock = (item) => {
    const product = item?.product;

    if (!product) {
      return 0;
    }

    /*
    -------------------------------------------------------
    PRODUCTS WITH SIZE

    Example:

    sizes: [
      { size: 38, stock: 5 },
      { size: 40, stock: 1 },
      { size: 42, stock: 3 }
    ]

    If cart item has size 40:

    availableStock = 1
    -------------------------------------------------------
    */

    if (
      Array.isArray(product.sizes) &&
      product.sizes.length > 0 &&
      item.size !== undefined &&
      item.size !== null &&
      item.size !== ""
    ) {
      const selectedSize = product.sizes.find(
        (sizeItem) =>
          Number(sizeItem.size) === Number(item.size)
      );

      if (!selectedSize) {
        return 0;
      }

      return Math.max(
        0,
        Number(selectedSize.stock || 0)
      );
    }

    /*
    -------------------------------------------------------
    PRODUCTS WITHOUT SIZE
    -------------------------------------------------------
    */

    return Math.max(
      0,
      Number(product.stock || 0)
    );
  };

  // =====================================================
  // GET STOCK MESSAGE
  // =====================================================

  const getStockMessage = (item) => {
    const availableStock =
      getAvailableStock(item);

    if (availableStock <= 0) {
      return "This item is currently unavailable";
    }

    /*
    Show message only when quantity
    has reached the available stock.
    */

    if (item.quantity >= availableStock) {
      if (
        item.size !== undefined &&
        item.size !== null &&
        item.size !== ""
      ) {
        return `Only ${availableStock} ${
          availableStock === 1
            ? "item"
            : "items"
        } available in size ${item.size}`;
      }

      return `Only ${availableStock} ${
        availableStock === 1
          ? "item"
          : "items"
      } available`;
    }

    return "";
  };

  // =====================================================
  // INCREASE QUANTITY
  // =====================================================

  const handleIncrease = async (item) => {
    const availableStock =
      getAvailableStock(item);

    /*
    -------------------------------------------------------
    IMPORTANT

    Do NOT call the API if the user has already
    reached the maximum available stock.

    This prevents unnecessary 400 errors.
    -------------------------------------------------------
    */

    if (
      availableStock <= 0
    ) {
      return;
    }

    if (
      item.quantity >= availableStock
    ) {
      return;
    }

    const newQuantity =
      item.quantity + 1;

    /*
    -------------------------------------------------------
    OPTIMISTIC UPDATE
    -------------------------------------------------------
    */

    dispatch(
      updateItemQuantity({
        productId:
          item.product._id,

        size:
          item.size || "",

        color:
          item.color || "",

        quantity:
          newQuantity,
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
      /*
      -----------------------------------------------------
      ROLLBACK IF API FAILS
      -----------------------------------------------------
      */

      dispatch(
        updateItemQuantity({
          productId:
            item.product._id,

          size:
            item.size || "",

          color:
            item.color || "",

          quantity:
            item.quantity,
        })
      );

      const backendMessage =
        error.response?.data?.message;

      toast.error(
        backendMessage ||
          "Unable to update quantity"
      );
    }
  };

  // =====================================================
  // DECREASE QUANTITY
  // =====================================================

  const handleDecrease = async (item) => {
    if (
      item.quantity <= 1
    ) {
      return;
    }

    const newQuantity =
      item.quantity - 1;

    /*
    -------------------------------------------------------
    OPTIMISTIC UPDATE
    -------------------------------------------------------
    */

    dispatch(
      updateItemQuantity({
        productId:
          item.product._id,

        size:
          item.size || "",

        color:
          item.color || "",

        quantity:
          newQuantity,
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
      /*
      -----------------------------------------------------
      ROLLBACK
      -----------------------------------------------------
      */

      dispatch(
        updateItemQuantity({
          productId:
            item.product._id,

          size:
            item.size || "",

          color:
            item.color || "",

          quantity:
            item.quantity,
        })
      );

      const backendMessage =
        error.response?.data?.message;

      toast.error(
        backendMessage ||
          "Unable to update quantity"
      );
    }
  };

  // =====================================================
  // REMOVE ITEM
  // =====================================================

  const handleRemove = async (item) => {
    const previousCart = cart;

    /*
    -------------------------------------------------------
    REMOVE FROM REDUX FIRST
    -------------------------------------------------------
    */

    dispatch(
      removeItem({
        productId:
          item.product._id,

        size:
          item.size || "",

        color:
          item.color || "",
      })
    );

    try {
      await removeCartItem(
        item.product._id,
        item.size || "",
        item.color || ""
      );

      toast.success(
        "Item removed from cart"
      );
    } catch (error) {
      /*
      -----------------------------------------------------
      RESTORE CART IF API FAILS
      -----------------------------------------------------
      */

      dispatch(
        setCart(previousCart)
      );

      toast.error(
        "Unable to remove item"
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
    <SEO
    title="Shopping Cart | Souk Fashion House"
    noIndex
/>
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

              {validItems.map((item) => {

                const availableStock =
                  getAvailableStock(item);

                const stockMessage =
                  getStockMessage(item);

                return (
                  <CartItem
                    key={`
                      ${item.product._id}-
                      ${item.size || "no-size"}-
                      ${item.color || "no-color"}
                    `}
                    item={item}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    onRemove={handleRemove}
                    availableStock={
                      availableStock
                    }
                    stockMessage={
                      stockMessage
                    }
                  />
                );
              })}

            </div>

            <CartSummary
              items={validItems}
            />

          </div>
        )}

      </section>

      <Footer />
    </>
  );
}