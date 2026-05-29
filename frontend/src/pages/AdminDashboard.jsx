import "./AdminDashboard.css";
import { useEffect, useState } from "react";

const API_URL = "https://carre-chicken-api.onrender.com";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  const total = orders.reduce((sum, order) => sum + order.total, 0);
  const paid = orders.filter((order) => order.paymentStatus === "Payée");
  const counter = orders.filter((order) => order.paymentMode === "comptoir");

  useEffect(() => {
    fetch(`${API_URL}/api/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="admin-page page">
      <section className="admin-shell">
        <h1>Dashboard Admin</h1>

        <div className="admin-grid">
          <div className="admin-card">
            <span>Commandes</span>
            <strong>{orders.length}</strong>
          </div>

          <div className="admin-card">
            <span>Chiffre d'affaires</span>
            <strong>{total.toFixed(2)} €</strong>
          </div>

          <div className="admin-card">
            <span>Payées en ligne</span>
            <strong>{paid.length}</strong>
          </div>

          <div className="admin-card">
            <span>Comptoir</span>
            <strong>{counter.length}</strong>
          </div>
        </div>

        <div className="admin-orders">
          {orders.map((order) => (
            <article key={order._id} className="admin-order-card">
              <div>
                <h2>{order.orderNumber}</h2>
                <p>Client : {order.customerName}</p>
                <p>Paiement : {order.paymentStatus}</p>
              </div>

              <div>
                {order.items.map((item, index) => (
                  <p key={index}>
                    {item.quantity}x {item.name}
                    {item.spiceChoice && ` • ${item.spiceChoice}`}
                  </p>
                ))}
              </div>

              <strong>{order.total.toFixed(2)} €</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;