import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlist: [],
  loading: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },

    setWishlist(state, action) {
      state.wishlist = action.payload || [];
    },

    addItem(state, action) {
      state.wishlist.push(action.payload);
    },

    removeItem(state, action) {
      state.wishlist = state.wishlist.filter(
        (item) => item._id !== action.payload
      );
    },

    clearWishlist(state) {
      state.wishlist = [];
    },
  },
});

export const {
  setLoading,
  setWishlist,
  addItem,
  removeItem,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;