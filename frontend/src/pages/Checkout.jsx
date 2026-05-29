import "./Checkout.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Store } from "lucide-react";
import { useCart } from "../context/CartContext";
import BlurText from "../components/BlurText";

const API_URL = "https://carre-chicken-api.onrender.com";

function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");

  const confirmOrder = async () => {
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
      alert("Erreur lors de la création de la commande.");
    }
  };

  return (
    <main className="checkout-page page">
      <section className="checkout-shell">
        <header className="checkout-header">
          <p>Paiement au comptoir</p>
          <BlurText text="Finaliser la commande" className="checkout-title" delay={90} direction="top" />
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

              <div className="payment-btn selected">
                <Store size={22} />
                Paiement au comptoir
              </div>
            </section>

            <section className="checkout-card">
              <h2>Résumé</h2>

              <div className="checkout-items">
                {cart.map((item) => (
                  <div key={item.cartKey || item.id} className="checkout-item">
                    <span>
                      {item.quantity}x {item.name}
                      {item.spiceChoice && ` • ${item.spiceChoice}`}
                    </span>
                    <strong>{(item.price * item.quantity).toFixed(2)} €</strong>
                  </div>
                ))}
              </div>

              <div className="checkout-total">
                <span>Total à payer au comptoir</span>
                <strong>{total.toFixed(2)} €</strong>
              </div>

              <button className="confirm-order-btn" onClick={confirmOrder}>
                Confirmer la commande
              </button>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}

export default Checkout;
