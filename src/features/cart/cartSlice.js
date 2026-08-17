import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: null,
    items: [],
    totalItems: 0,
    loading: false,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },

        setCart(state, action) {
            state.cart = action.payload;

            // Remove deleted products
            state.items = (action.payload?.items || []).filter(
                (item) => item.product
            );

            state.totalItems = state.items.reduce(
                (total, item) => total + item.quantity,
                0
            );
        },

        updateItemQuantity(state, action) {
            const {
                productId,
                size,
                color,
                quantity,
            } = action.payload;

            const item = state.items.find(
                (item) =>
                    item.product?._id === productId &&
                    Number(item.size) === Number(size) &&
                    (item.color || "") === (color || "")
            );

            if (item) {
                item.quantity = quantity;
            }

            state.totalItems = state.items.reduce(
                (total, item) => total + item.quantity,
                0
            );
        },

        removeItem(state, action) {
            const {
                productId,
                size,
                color,
            } = action.payload;

            state.items = state.items.filter(
                (item) =>
                    !(
                        item.product?._id === productId &&
                        Number(item.size) === Number(size) &&
                        (item.color || "") === (color || "")
                    )
            );

            state.totalItems = state.items.reduce(
                (total, item) => total + item.quantity,
                0
            );
        },

        addItem(state, action) {
            state.items.push(action.payload);

            state.totalItems = state.items.reduce(
                (total, item) => total + item.quantity,
                0
            );
        },

        clearCart(state) {
            state.cart = null;
            state.items = [];
            state.totalItems = 0;
        },
    },
});

export const {
    setLoading,
    setCart,
    updateItemQuantity,
    removeItem,
    addItem,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;