import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./styles/global.css";
import { CartProvider } from "./context/CartContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CartProvider>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(20, 30, 50, 0.6)",
            backdropFilter: "blur(20px)",
            color: "#fff",
            borderRadius: "18px",
            padding: "14px 18px",
            fontWeight: "700",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          },
        }}
      />
    </CartProvider>
  </BrowserRouter>
);
