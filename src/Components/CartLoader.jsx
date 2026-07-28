import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getCart } from "../features/cart/cartApi";
import {
  setCart,
  setLoading,
} from "../features/cart/cartSlice";

export default function CartLoader() {
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated) return;

      try {
        dispatch(setLoading(true));

        const { data } = await getCart();

        dispatch(setCart(data.cart));
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadCart();
  }, [dispatch, isAuthenticated]);

  return null;
}