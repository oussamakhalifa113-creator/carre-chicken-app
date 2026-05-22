import { useEffect, useState } from "react";
import "./EmployeeDashboard.css";

function EmployeeDashboard() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch("https://carre-chicken-api.onrender.com/api/orders")
            .then((res) => res.json())
            .then((data) => setOrders(data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <main className="employee-page">
            <div className="employee-header">
                <p>CUISINE • COMMANDES LIVE</p>
                <h1>Dashboard Carré Chicken</h1>
            </div>

            <div className="orders-grid">
                {orders.map((order) => (
                    <article key={order._id} className="order-card">

                        <div className="order-top">
                            <h2>{order.orderNumber}</h2>

                            <div className="order-badges">

                                <span
                                    className={
                                        order.paymentStatus === "Payée"
                                            ? "paid-badge"
                                            : "counter-badge"
                                    }
                                >
                                    {order.paymentStatus === "Payée"
                                        ? "PAYÉE"
                                        : "COMPTOIR"}
                                </span>

                                <span className="status-badge">
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

                                    <strong>
                                        {(item.price * item.quantity).toFixed(2)} €
                                    </strong>
                                </div>
                            ))}
                        </div>

                        <div className="order-total">
                            <span>Total</span>
                            <strong>{order.total.toFixed(2)} €</strong>
                        </div>

                        <small>
                            {new Date(order.createdAt).toLocaleString("fr-FR")}
                        </small>

                    </article>
                ))}
            </div>
        </main>
    );
}

export default EmployeeDashboard;
