import "./Cart.css";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import BlurText from "../components/BlurText";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    total,
  } = useCart();

  return (
    <main className="cart-page page">
      <section className="cart-shell">
        <div className="cart-header">
          <div>
            <p>Commande</p>
            <BlurText text="Ton panier" className="cart-title" delay={120} direction="top" />
          </div>

          {cart.length > 0 && (
            <button className="clear-btn" onClick={clearCart}>Vider</button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <h2>Ton panier est vide</h2>
            <p>Ajoute un burger, un wrap ou un menu pour commencer.</p>
            <Link to="/menu">Voir le menu</Link>
          </div>
        ) : (
          <>
            <div className="cart-list">
              <AnimatePresence>
                {cart.map((item) => {
                  const key = item.cartKey || `${item.id}`;

                  return (
                    <motion.article
                      key={key}
                      className="cart-item"
                      initial={{ opacity: 0, scale: 0.92, y: 18 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: 80 }}
                      transition={{ type: "spring", stiffness: 320, damping: 24 }}
                      layout
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/300x300/ff7a1a/ffffff?text=Carr%C3%A9+Chicken";
                        }}
                      />

                      <div className="cart-info">
                        <h3>{item.name}</h3>
                        <p>
                          {item.price.toFixed(2)} €
                          {item.spiceChoice && ` • ${item.spiceChoice}`}
                        </p>

                        <div className="quantity-controls">
                          <motion.button
                            whileTap={{ scale: 0.82 }}
                            whileHover={{ scale: 1.12 }}
                            onClick={() => decreaseQuantity(key)}
                          >
                            -
                          </motion.button>

                          <motion.span
                            key={item.quantity}
                            initial={{ scale: 1.4, color: "#ff7a1a" }}
                            animate={{ scale: 1, color: "#ffffff" }}
                            transition={{ type: "spring", stiffness: 450, damping: 18 }}
                          >
                            {item.quantity}
                          </motion.span>

                          <motion.button
                            whileTap={{ scale: 0.82 }}
                            whileHover={{ scale: 1.12 }}
                            onClick={() => increaseQuantity(key)}
                          >
                            +
                          </motion.button>
                        </div>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        whileHover={{ scale: 1.1, rotate: 8 }}
                        className="remove-btn"
                        onClick={() => removeFromCart(key)}
                      >
                        ×
                      </motion.button>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>

            <motion.div
              className="cart-total"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
            >
              <div>
                <span>Total</span>
                <AnimatePresence mode="wait">
                  <motion.strong
                    key={total.toFixed(2)}
                    initial={{ y: 16, opacity: 0, filter: "blur(8px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -16, opacity: 0, filter: "blur(8px)" }}
                    transition={{ duration: 0.22 }}
                  >
                    {total.toFixed(2)} €
                  </motion.strong>
                </AnimatePresence>
              </div>

              <Link to="/checkout" className="checkout-btn">Continuer</Link>
            </motion.div>
          </>
        )}
      </section>
    </main>
  );
}

export default Cart;
