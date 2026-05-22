import "./Confirmation.css";
import { Link } from "react-router-dom";

function Confirmation() {
  const order = JSON.parse(localStorage.getItem("last-carre-chicken-order"));

  if (!order) {
    return (
      <main className="confirmation-page page">
        <div className="ticket">
          <h1>Aucune commande</h1>
          <Link to="/menu">Retour au menu</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="confirmation-page page">
      <section className="ticket">
        <p className="ticket-brand">Carré Chicken</p>
        <h1>Commande confirmée</h1>

        <div className="order-number">{order.orderNumber}</div>

        <div className="ticket-row">
          <span>Client</span>
          <strong>{order.customerName}</strong>
        </div>

        <div className="ticket-row">
          <span>Date</span>
          <strong>{order.createdAt}</strong>
        </div>

        <div className="ticket-row">
          <span>Paiement</span>
          <strong>{order.paymentStatus}</strong>
        </div>

        <div className="ticket-items">
          {order.items.map((item) => (
            <div key={item.cartKey || item.id}>
              <span>
                {item.quantity}x {item.name}
                {item.spiceChoice && ` • ${item.spiceChoice}`}
              </span>
              <strong>{(item.price * item.quantity).toFixed(2)} €</strong>
            </div>
          ))}
        </div>

        <div className="ticket-total">
          <span>Total</span>
          <strong>{order.total.toFixed(2)} €</strong>
        </div>

        <Link to="/menu" className="new-order-btn">
          Nouvelle commande
        </Link>
      </section>
    </main>
  );
}

export default Confirmation;
