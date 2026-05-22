import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <main className="admin-page page">
      <h1>Dashboard Admin</h1>
      <div className="admin-grid">
        <div>Produits</div>
        <div>Commandes</div>
        <div>Utilisateurs</div>
      </div>
    </main>
  );
}

export default AdminDashboard;
