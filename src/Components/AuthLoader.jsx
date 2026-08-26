import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { getProfile } from "../features/auth/authApi";
import { setLoading, setUser } from "../features/auth/authSlice";

const PUBLIC_AUTH_ROUTES = new Set([
    "/login",
    "/register",
    "/verify-otp",
    "/forgot-password",
    "/verify-reset-otp",
    "/reset-password",
]);

export default function AuthLoader() {
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        let cancelled = false;

        if (PUBLIC_AUTH_ROUTES.has(location.pathname)) {
            dispatch(setUser(null));
            dispatch(setLoading(false));
            return;
        }

        const loadUser = async () => {
            dispatch(setLoading(true));

            try {
                const { data } = await getProfile();

                if (!cancelled) {
                    dispatch(setUser(data?.user || null));
                }
            } catch {
                if (!cancelled) {
                    dispatch(setUser(null));
                }
            } finally {
                if (!cancelled) {
                    dispatch(setLoading(false));
                }
            }
        };

        loadUser();

        return () => {
            cancelled = true;
        };
    }, [dispatch, location.pathname]);

    return null;
}