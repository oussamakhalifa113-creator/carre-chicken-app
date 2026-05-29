import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

function ProductCard({ item, available = true }) {
  const { addToCart } = useCart();
  const [showChoice, setShowChoice] = useState(false);
  const [choiceType, setChoiceType] = useState(null);
  const [pendingSpice, setPendingSpice] = useState(null);
  const [bouncing, setBouncing] = useState(false);

  const drinkPrices = {
    "Sans boisson": 0,
    Eau: 1.5,
    Boisson: 2.5,
  };

  const triggerBounce = () => {
    setBouncing(true);
    setTimeout(() => setBouncing(false), 360);
  };

  const finalAdd = ({ spiceChoice = null, drinkChoice = "Sans boisson" } = {}) => {
    const drinkExtra = drinkPrices[drinkChoice] || 0;

    addToCart({
      ...item,
      basePrice: item.price,
      price: item.price + drinkExtra,
      spiceChoice,
      drinkChoice,
      drinkExtra,
      cartKey: `${item.id}-${spiceChoice || "no-spice"}-${drinkChoice}`,
    });

    triggerBounce();
    toast.success(`${item.name} ajouté !`);
    setShowChoice(false);
    setChoiceType(null);
    setPendingSpice(null);
  };

  const handleSpiceChoice = (choice) => {
    if (item.allowDrinkChoice) {
      setPendingSpice(choice);
      setChoiceType("drink");
      return;
    }

    finalAdd({ spiceChoice: choice });
  };

  const handleDrinkChoice = (drink) => {
    finalAdd({
      spiceChoice: pendingSpice,
      drinkChoice: drink,
    });
  };

  const handleAdd = () => {
    if (!available) {
      toast.error("Disponible tous les midis du lundi au samedi");
      return;
    }

    if (item.requireSpiceChoice) {
      setChoiceType("spice");
      setShowChoice(true);
      return;
    }

    if (item.allowDrinkChoice) {
      setChoiceType("drink");
      setShowChoice(true);
      return;
    }

    finalAdd();
  };

  return (
    <>
      <motion.article
        className={`product-card ${!available ? "product-unavailable" : ""}`}
        animate={bouncing ? { scale: [1, 1.035, 1] } : { scale: 1 }}
        transition={{ duration: 0.35 }}
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <img
          src={item.image}
          alt={item.name}
          className="product-img"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/400x400/ff7a1a/ffffff?text=Carr%C3%A9+Chicken";
          }}
        />

        <div className="product-info">
          <div className="product-title-row">
            <h3>{item.name}</h3>
            {!available && (
              <span className="availability-badge">
                Disponible tous les midis
              </span>
            )}
          </div>

          <p>{item.description}</p>

          <div className="product-bottom">
            <strong>{item.price.toFixed(2)} €</strong>

            <motion.button
              disabled={!available}
              whileTap={available ? { scale: 0.86 } : {}}
              whileHover={available ? { scale: 1.06, y: -2 } : {}}
              onClick={handleAdd}
            >
              {available ? "Ajouter" : "Indisponible"}
            </motion.button>
          </div>
        </div>
      </motion.article>

      <AnimatePresence>
        {showChoice && (
          <motion.div
            className="choice-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowChoice(false)}
          >
            <motion.div
              className="choice-modal"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p>Choix obligatoire</p>
              <h2>{item.name}</h2>

              {choiceType === "spice" && (
                <>
                  <span>Choisis la version.</span>

                  <div className="choice-actions">
                    <button onClick={() => handleSpiceChoice("Nature")}>
                      Nature
                    </button>

                    <button onClick={() => handleSpiceChoice("Épicé")}>
                      Épicé
                    </button>
                  </div>
                </>
              )}

              {choiceType === "drink" && (
                <>
                  <span>Choisis une boisson pour ton menu.</span>

                  <div className="choice-actions drink-choice-actions">
                    <button onClick={() => handleDrinkChoice("Sans boisson")}>
                      Sans boisson
                    </button>

                    <button onClick={() => handleDrinkChoice("Eau")}>
                      Eau +1,50 €
                    </button>

                    <button onClick={() => handleDrinkChoice("Boisson")}>
                      Boisson +2,50 €
                    </button>
                  </div>
                </>
              )}

              <button
                className="choice-cancel"
                onClick={() => {
                  setShowChoice(false);
                  setChoiceType(null);
                  setPendingSpice(null);
                }}
              >
                Annuler
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ProductCard;
