import "./Checkout.css";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Store } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  ExpressCheckoutElement,
  useStripe,
} from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext";
import BlurText from "../components/BlurText";

const API_URL = "https://carre-chicken-api.onrender.com";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function ExpressPayBox({ customerName, cart, total, clearCart }) {
  const stripe = useStripe();
  const navigate = useNavigate();

  const handleConfirm = async (event) => {
    if (!stripe) return;

    if (!customerName.trim()) {
      alert("Entre ton nom avant de payer.");
      return;
    }

    try {
      const { error } = await stripe.confirmPayment({
        clientSecret: event.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/stripe-success`,
        },
        redirect: "if_required",
      });

      if (error) {
        alert(error.message);
        return;
      }

      const orderData = {
        customerName: customerName.trim(),
        paymentMode: "apple-pay",
        paymentStatus: "Payee",
        items: cart,
        total,
      };

      const response = await axios.post(`${API_URL}/api/orders`, orderData);
      localStorage.setItem("last-carre-chicken-order", JSON.stringify(response.data));

      clearCart();
      navigate("/confirmation");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la validation du paiement.");
    }
  };

  return (
    <div className="express-pay-box">
      <ExpressCheckoutElement
        onConfirm={handleConfirm}
        options={{
          buttonType: {
            applePay: "buy",
          },
          buttonTheme: {
            applePay: "black",
          },
          buttonHeight: 56,
        }}
      />
    </div>
  );
}

function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [paymentMode, setPaymentMode] = useState("apple-pay");
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (cart.length === 0) return;

      try {
        const response = await axios.post(
          `${API_URL}/api/stripe/create-payment-intent`,
          { items: cart }
        );

        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error(error);
      }
    };

    createPaymentIntent();
  }, [cart]);

  const confirmCounterOrder = async () => {
    if (!customerName.trim()) {
      alert("Entre ton nom.");
      return;
    }

    try {
      const orderData = {
        customerName: customerName.trim(),
        paymentMode: "comptoir",
        paymentStatus: "À payer au comptoir",
        items: cart,
        total,
      };

      const response = await axios.post(`${API_URL}/api/orders`, orderData);

      localStorage.setItem("last-carre-chicken-order", JSON.stringify(response.data));

      clearCart();
      navigate("/confirmation");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la creation de la commande.");
    }
  };

  return (
    <main className="checkout-page page">
      <section className="checkout-shell">
        <header className="checkout-header">
          <p>Paiement</p>
          <BlurText
            text="Finaliser la commande"
            className="checkout-title"
            delay={90}
            direction="top"
          />
        </header>

        {cart.length === 0 ? (
          <div className="checkout-empty">
            <h2>Ton panier est vide</h2>
            <Link to="/menu">Retour au menu</Link>
          </div>
        ) : (
          <div className="checkout-grid">
            <section className="checkout-card">
              <h2>Informations client</h2>

              <label className="checkout-label">Nom du client</label>
              <input
                className="checkout-input"
                type="text"
                placeholder="Ex : Oussama"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />

              <h2>Mode de paiement</h2>

              <button
                className={`payment-btn ${paymentMode === "apple-pay" ? "selected" : ""}`}
                onClick={() => setPaymentMode("apple-pay")}
              >
                Apple Pay / Carte
              </button>

              <button
                className={`payment-btn ${paymentMode === "comptoir" ? "selected" : ""}`}
                onClick={() => setPaymentMode("comptoir")}
              >
                <Store size={22} />
                Paiement au comptoir
              </button>
              {paymentMode === "apple-pay" && clientSecret && (
                <>
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "night",
                      },
                    }}
                  >
                    <ExpressPayBox
                      customerName={customerName}
                      cart={cart}
                      total={total}
                      clearCart={clearCart}
                    />
                  </Elements>

                  <button
                    className="confirm-order-btn"
                    onClick={confirmCounterOrder}
                    style={{ marginTop: "16px" }}
                  >
                    Tester en paiement comptoir
                  </button>
                </>
              )}

              {paymentMode === "apple-pay" && !clientSecret && (
                <p className="payment-help">
                  Chargement du paiement...
                </p>
              )}
            </section>

            <section className="checkout-card">
              <h2>Resume</h2>

              <div className="checkout-items">
                {cart.map((item) => (
                  <div key={item.cartKey || item.id} className="checkout-item">
                    <span>
                      {item.quantity}x {item.name}
                      {item.spiceChoice && ` - ${item.spiceChoice}`}
                    </span>
                    <strong>{(item.price * item.quantity).toFixed(2)} €</strong>
                  </div>
                ))}
              </div>

              <div className="checkout-total">
                <span>Total</span>
                <strong>{total.toFixed(2)} €</strong>
              </div>

              {paymentMode === "comptoir" && (
                <button className="confirm-order-btn" onClick={confirmCounterOrder}>
                  Confirmer la commande
                </button>
              )}
            </section>
          </div>
        )}
      </section>
    </main>
  );
}

export default Checkout;
