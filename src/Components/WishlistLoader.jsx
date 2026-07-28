import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getWishlist } from "../features/wishlist/wishlistApi";
import {
  setWishlist,
  setLoading,
} from "../features/wishlist/wishlistSlice";

export default function WishlistLoader() {
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) {
        dispatch(setWishlist([]));
        return;
      }

      try {
        dispatch(setLoading(true));

        const { data } = await getWishlist();

        dispatch(
          setWishlist(data.wishlist?.products || [])
        );
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchWishlist();
  }, [dispatch, isAuthenticated]);

  return null;
}