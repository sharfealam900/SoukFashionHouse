import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getProfile } from "../features/auth/authApi";
import { setLoading, setUser } from "../features/auth/authSlice";

export default function AuthLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      dispatch(setLoading(true));

      try {
        const { data } = await getProfile();
        dispatch(setUser(data.user));
      } catch (error) {
        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadUser();
  }, [dispatch]);

  return null;
}