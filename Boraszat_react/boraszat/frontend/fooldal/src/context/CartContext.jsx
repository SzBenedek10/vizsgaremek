import {
  createContext,
  useState,
  useContext,
  useLayoutEffect,
  useRef,
} from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // 🔹 1. Betöltés localStorage-ból (EGYSZER)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("boraszat_cart");
      console.log("LocalStorage betöltése:", savedCart);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (err) {
      console.error("LocalStorage hiba:", err);
      return [];
    }
  });

  // 🔹 2. StrictMode-biztos mentés
  const isHydrated = useRef(false);

  useLayoutEffect(() => {
    if (!isHydrated.current) {
      isHydrated.current = true;
      return;
    }
    localStorage.setItem("boraszat_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // 🔹 3. Kosárba adás
  const addToCart = (product, amount) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === product.id);

      if (existing) {
        const newAmount = existing.amount + amount;
        if (newAmount > product.keszlet) {
          alert("Nincs ennyi készleten!");
          return prevItems;
        }
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, amount: newAmount }
            : item
        );
      }

      if (amount > product.keszlet) {
        alert("Nincs ennyi készleten!");
        return prevItems;
      }

      return [...prevItems, { ...product, amount }];
    });
  };

  // 🔹 4. Törlés
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 🔹 5. Kosár ürítés
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("boraszat_cart");
  };

  // 🔹 6. Összeg
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.ar * item.amount,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
