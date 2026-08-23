import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import App from "./App.jsx";
import { store } from "./store/store";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        containerStyle={{
          top: 90,
          right: 24,
          zIndex: 999999,
        }}
        toastOptions={{
          duration: 3500,
          className: "souk-toast",
          style: {
            minWidth: "320px",
            maxWidth: "390px",
            padding: "15px 18px",
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.97)",
            color: "#171717",
            border: "1px solid rgba(212, 175, 55, 0.28)",
            boxShadow:
              "0 15px 45px rgba(0, 0, 0, 0.14), 0 4px 15px rgba(0, 0, 0, 0.06)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            fontSize: "14px",
            fontWeight: "500",
            zIndex: 999999,
          },
          success: {
            iconTheme: {
              primary: "#198754",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#dc3545",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <App />
    </Provider>
  </StrictMode>
);