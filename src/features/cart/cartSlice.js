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
            state.items = action.payload?.items || [];

            state.totalItems = state.items.reduce(
                (total, item) => total + item.quantity,
                0
            );
        },

        updateItemQuantity(state, action) {
            const { productId, quantity } = action.payload;

            const item = state.items.find(
                (item) => item.product._id === productId
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
            state.items = state.items.filter(
                (item) => item.product._id !== action.payload
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