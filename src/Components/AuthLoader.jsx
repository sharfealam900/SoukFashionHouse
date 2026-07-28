import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getProfile } from "../features/auth/authApi";
import { setUser } from "../features/auth/authSlice";

export default function AuthLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await getProfile();

        dispatch(setUser(data.user));
      } catch (error) {
        console.log("User not logged in");
      }
    };

    loadUser();
  }, [dispatch]);

  return null;
}