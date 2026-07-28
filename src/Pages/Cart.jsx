import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

import CartItem from "../Components/Cart/CartItem";
import EmptyCart from "../Components/Cart/EmptyCart";
import CartSummary from "../Components/Cart/CartSummary";

import { useDispatch } from "react-redux";

import { getCart, updateCart, removeCartItem, } from "../features/cart/cartApi";

import {
    setCart,
    updateItemQuantity,
    removeItem,
} from "../features/cart/cartSlice";

import { toast } from "react-hot-toast";



export default function Cart() {

    const { items, cart } = useSelector((state) => state.cart);
    const dispatch = useDispatch();


    const handleIncrease = async (item) => {
        dispatch(
            updateItemQuantity({
                productId: item.product._id,
                quantity: item.quantity + 1,
            })
        );

        try {
            await updateCart(item.product._id, item.quantity + 1);
        } catch (error) {
            console.error(error);

            dispatch(
                updateItemQuantity({
                    productId: item.product._id,
                    quantity: item.quantity,
                })
            );

            toast.error("Unable to update quantity");
        }
    };

    const handleDecrease = async (item) => {
        if (item.quantity <= 1) return;

        dispatch(
            updateItemQuantity({
                productId: item.product._id,
                quantity: item.quantity - 1,
            })
        );

        try {
            await updateCart(item.product._id, item.quantity - 1);
        } catch (error) {
            console.error(error);

            dispatch(
                updateItemQuantity({
                    productId: item.product._id,
                    quantity: item.quantity,
                })
            );

            toast.error("Unable to update quantity");
        }
    };


   const handleRemove = async (item) => {
    // Save the complete cart
    const previousCart = cart;

    // Remove instantly
    dispatch(removeItem(item.product._id));

    try {
        await removeCartItem(item.product._id);

        toast.success("Item removed from cart");
    } catch (error) {
        console.error(error);

        // Restore complete cart
        dispatch(setCart(previousCart));

        toast.error("Unable to remove item");
    }
};

    return (
        <>
            <Navbar />

            <section className="cart-page container py-5">
                <h1 className="mb-4">
                    Shopping Bag ({items.length})
                </h1>

                {items.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <div className="cart-layout">
                        <div className="cart-items">
                            {items.map((item) => (
                                <CartItem
                                    key={item.product._id}
                                    item={item}
                                    onIncrease={handleIncrease}
                                    onDecrease={handleDecrease}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </div>

                        <CartSummary items={items} />
                    </div>
                )}
            </section>

            <Footer />
        </>
    );
}