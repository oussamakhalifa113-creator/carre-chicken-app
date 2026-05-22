import "./Home.css";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, QrCode, Smartphone } from "lucide-react";
import BlurText from "../components/BlurText";
import RotatingText from "../components/RotatingText";

function Home() {
  return (
    <main className="home-page">
      <section className="hero-layout">
        <div className="hero-intro">
          <p className="hero-badge">Carré Chicken</p>

          <BlurText
            text="Commande rapide & Goût incroyable."
            className="hero-title"
            delay={140}
            direction="top"
          />

          <p className="hero-sub">
            Scanne, choisis ton menu et{" "}
            <RotatingText
              texts={[
                "récupère ta commande.",
                "paie en ligne.",
                "gagne du temps.",
                "profite du goût."
              ]}
            />
          </p>
        </div>

        <div className="hero-showcase">
          <div className="phone-card">
            <div className="phone-top">
              <span></span>
              <p>Commande #024</p>
            </div>

            <div className="qr-box">
              <QrCode size={92} />
            </div>

            <h2>Carré Chicken</h2>
            <p className="phone-text">Menu L • Dynamite Burger • Ziggy fries</p>

            <div className="status-list">
              <div>
                <Clock size={18} />
                <span>Préparation : 8 min</span>
              </div>
              <div>
                <Smartphone size={18} />
                <span>Paiement Apple Pay / Comptoir</span>
              </div>
            </div>

            <Link to="/menu" className="phone-btn">
              Commander maintenant <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
