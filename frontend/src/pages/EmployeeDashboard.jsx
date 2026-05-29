import { useEffect, useState } from "react";
import { RefreshCw, Trash2, CheckCircle2, Clock } from "lucide-react";
import "./EmployeeDashboard.css";

const API_URL = "https://carre-chicken-api.onrender.com";

function EmployeeDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      alert("Erreur chargement commandes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 12000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const updatedOrder = await res.json();

      setOrders((prev) =>
        prev.map((order) => (order._id === id ? updatedOrder : order))
      );
    } catch (error) {
      console.error(error);
      alert("Erreur changement statut.");
    }
  };

  const deleteAllOrders = async () => {
    const confirmDelete = window.confirm(
      "Supprimer toutes les commandes précédentes ?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(`${API_URL}/api/orders`, {
        method: "DELETE",
      });

      setOrders([]);
    } catch (error) {
      console.error(error);
      alert("Erreur suppression commandes.");
    }
  };

  return (
    <main className="employee-page">
      <section className="employee-shell">
        <div className="employee-header">
          <div>
            <p>CUISINE • COMMANDES LIVE</p>
            <h1>Dashboard Carré Chicken</h1>
          </div>

          <div className="employee-actions">
            <button onClick={fetchOrders}>
              <RefreshCw size={18} />
              Actualiser
            </button>

            <button className="danger-action" onClick={deleteAllOrders}>
              <Trash2 size={18} />
              Supprimer tout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="employee-empty">
            <h2>Chargement...</h2>
          </div>
        ) : orders.length === 0 ? (
          <div className="employee-empty">
            <h2>Aucune commande</h2>
            <p>Les nouvelles commandes apparaîtront ici automatiquement.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => {
              const isReady = order.status === "Prête";

              return (
                <article
                  key={order._id}
                  className={`order-card ${isReady ? "order-ready" : ""}`}
                >
                  <div className="order-top">
                    <h2 className="order-number">{order.orderNumber}</h2>

                    <div className="order-badges">
                      <span
                        className={
                          order.paymentStatus === "Payée"
                            ? "paid-badge"
                            : "counter-badge"
                        }
                      >
                        {order.paymentStatus === "Payée" ? "PAYÉE" : "COMPTOIR"}
                      </span>

                      <span className={isReady ? "status-ready" : "status-waiting"}>
                        {order.status || "En attente"}
                      </span>
                    </div>
                  </div>

                  <div className="client-box">
                    <span>CLIENT</span>
                    <strong>{order.customerName}</strong>
                  </div>

                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span>
                          {item.quantity}x {item.name}
                          {item.spiceChoice && ` • ${item.spiceChoice}`}
                        </span>

                        <strong>{(item.price * item.quantity).toFixed(2)} €</strong>
                      </div>
                    ))}
                  </div>

                  <div className="order-total">
                    <span>Total</span>
                    <strong>{order.total.toFixed(2)} €</strong>
                  </div>

                  <div className="order-footer">
                    <small>{new Date(order.createdAt).toLocaleString("fr-FR")}</small>

                    <div className="order-status-actions">
                      <button
                        className={!isReady ? "active-waiting" : ""}
                        onClick={() => updateStatus(order._id, "En attente")}
                      >
                        <Clock size={17} />
                        En attente
                      </button>

                      <button
                        className={isReady ? "active-ready" : ""}
                        onClick={() => updateStatus(order._id, "Prête")}
                      >
                        <CheckCircle2 size={17} />
                        Prête
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default EmployeeDashboard;
