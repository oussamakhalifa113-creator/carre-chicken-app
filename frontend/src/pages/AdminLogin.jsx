import "./AdminLogin.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (e) => {
    e.preventDefault();

    if (
      email === "admin@carrechicken.fr" &&
      password === "CarreChicken2026!"
    ) {
      localStorage.setItem("admin-auth", "true");
      navigate("/admin");
    } else {
      alert("Email ou mot de passe incorrect.");
    }
  };

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={login}>
        <p>Admin Carré Chicken</p>
        <h1>Connexion</h1>

        <input
          type="email"
          placeholder="Email admin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Se connecter</button>
      </form>
    </main>
  );
}

export default AdminLogin;