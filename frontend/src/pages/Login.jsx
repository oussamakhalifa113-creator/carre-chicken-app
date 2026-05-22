import "./Login.css";

function Login() {
  return (
    <main className="login-page page">
      <form className="login-card">
        <h1>Connexion</h1>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Mot de passe" />
        <button type="button">Se connecter</button>
      </form>
    </main>
  );
}

export default Login;
