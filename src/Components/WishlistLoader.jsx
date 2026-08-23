import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getWishlist } from "../features/wishlist/wishlistApi";
import {
  setWishlist,
  setLoading,
} from "../features/wishlist/wishlistSlice";

export default function WishlistLoader() {
  const dispatch = useDispatch();

  const { isAuthenticated, loading: authLoading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (authLoading) return;

    const fetchWishlist = async () => {
      if (!isAuthenticated) {
        dispatch(setWishlist([]));
        dispatch(setLoading(false));
        return;
      }

      try {
        dispatch(setLoading(true));

        const { data } = await getWishlist();

        dispatch(
          setWishlist(data.wishlist?.products || [])
        );
      } catch (error) {
        console.error("Failed to load wishlist:", error);
        dispatch(setWishlist([]));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchWishlist();
  }, [dispatch, isAuthenticated, authLoading]);

  return null;
}