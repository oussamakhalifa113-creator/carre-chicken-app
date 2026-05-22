import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("carre-chicken-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("carre-chicken-cart", JSON.stringify(cart));
  }, [cart]);

  const getKey = (item) => item.cartKey || `${item.id}`;

  const addToCart = (item) => {
    setCart((prev) => {
      const itemKey = getKey(item);
      const existingItem = prev.find((cartItem) => getKey(cartItem) === itemKey);

      if (existingItem) {
        return prev.map((cartItem) =>
          getKey(cartItem) === itemKey
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (key) => {
    setCart((prev) => prev.filter((item) => getKey(item) !== `${key}`));
  };

  const increaseQuantity = (key) => {
    setCart((prev) =>
      prev.map((item) =>
        getKey(item) === `${key}` ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (key) => {
    setCart((prev) =>
      prev
        .map((item) =>
          getKey(item) === `${key}` ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      cartCount,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
