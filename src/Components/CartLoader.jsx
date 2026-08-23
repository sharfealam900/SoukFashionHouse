import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getCart } from "../features/cart/cartApi";
import {
  setCart,
  setLoading,
} from "../features/cart/cartSlice";

export default function CartLoader() {
  const dispatch = useDispatch();

  const { isAuthenticated, loading: authLoading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (authLoading) return;

    const loadCart = async () => {
      if (!isAuthenticated) {
        dispatch(setCart(null));
        dispatch(setLoading(false));
        return;
      }

      try {
        dispatch(setLoading(true));

        const { data } = await getCart();

        dispatch(setCart(data.cart));
      } catch (error) {
        console.error("Failed to load cart:", error);
        dispatch(setCart(null));
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadCart();
  }, [dispatch, isAuthenticated, authLoading]);

  return null;
}