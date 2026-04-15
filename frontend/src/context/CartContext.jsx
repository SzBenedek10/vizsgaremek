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

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = sessionStorage.getItem("boraszat_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (err) {
      console.error("SessionStorage hiba:", err);
      return [];
    }
  });

  const isHydrated = useRef(false);

  useLayoutEffect(() => {
    if (!isHydrated.current) {
      isHydrated.current = true;
      return;
    }
    sessionStorage.setItem("boraszat_cart", JSON.stringify(cartItems));
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
    sessionStorage.removeItem("boraszat_cart");
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
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};