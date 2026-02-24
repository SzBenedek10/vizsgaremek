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
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("boraszat_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (err) {
      console.error("LocalStorage hiba:", err);
      return [];
    }
  });

  const isHydrated = useRef(false);

  useLayoutEffect(() => {
    if (!isHydrated.current) {
      isHydrated.current = true;
      return;
    }
    localStorage.setItem("boraszat_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, amount) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find(
        (i) => i.id === product.id && i.kiszereles_id === product.kiszereles_id
      );

      if (existing) {
        const newAmount = existing.amount + amount;
        if (newAmount > product.keszlet) {
          alert("Nincs ennyi készleten!");
          return prevItems;
        }
        return prevItems.map((item) =>
          item.id === product.id && item.kiszereles_id === product.kiszereles_id
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
  const removeFromCart = (id, kiszereles_id) => {
    setCartItems((prev) => 
      prev.filter((item) => !(item.id === id && item.kiszereles_id === kiszereles_id))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("boraszat_cart");
  };

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