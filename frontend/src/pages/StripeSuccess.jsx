import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

function StripeSuccess() {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    const saveOrder = async () => {
      const pendingOrder = JSON.parse(localStorage.getItem("pending-stripe-order"));

      if (!pendingOrder) {
        navigate("/confirmation");
        return;
      }

      const response = await axios.post("https://carre-chicken-api.onrender.com/api/orders", {
        ...pendingOrder,
        paymentMode: "apple-pay",
        paymentStatus: "Payée",
      });

      localStorage.setItem("last-carre-chicken-order", JSON.stringify(response.data));
      localStorage.removeItem("pending-stripe-order");

      clearCart();
      navigate("/confirmation");
    };

    saveOrder();
  }, [navigate, clearCart]);

  return <div style={{ color: "white", padding: 40 }}>Validation du paiement...</div>;
}

export default StripeSuccess;
