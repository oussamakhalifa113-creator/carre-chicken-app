import { NavLink, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Utensils, ShoppingBag, UserRound } from "lucide-react";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

function Navbar() {
  const { cartCount } = useCart();

  const links = [
    { to: "/", label: "Accueil", icon: <Home size={20} /> },
    { to: "/menu", label: "Menu", icon: <Utensils size={20} /> },
    {
      to: "/cart",
      label: "Panier",
      icon: (
        <div className="nav-cart-icon">
          <ShoppingBag size={20} />
          {cartCount > 0 && <em>{cartCount}</em>}
        </div>
      ),
    },
    { to: "/login", label: "Compte", icon: <UserRound size={20} /> },
  ];

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <span>C</span>
        <strong>Carré Chicken</strong>
      </Link>

      <nav className="navbar-links">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className="nav-link">
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    className="nav-active-bg"
                    layoutId="navbar-active-pill"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 32,
                    }}
                  />
                )}

                <motion.span
                  className="nav-icon"
                  whileHover={{ scale: 1.28, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 14 }}
                >
                  {link.icon}
                </motion.span>

                <span className="nav-text">{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
