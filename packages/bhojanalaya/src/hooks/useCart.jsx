import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

const addItemToCart = (currentCart, itemToAdd) => {
  const existingItem = currentCart.find((item) => item.id === itemToAdd.id);

  if (existingItem) {
    return currentCart.map((item) =>
      item.id === itemToAdd.id
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    );
  }
  return [...currentCart, { ...itemToAdd, quantity: 1 }];
};

const removeItemFromCart = (currentCart, itemToRemove) => {
  const updatedCart = currentCart.map((item) =>
    item.id === itemToRemove.id
      ? { ...item, quantity: item.quantity - 1 }
      : item,
  );
  return updatedCart.filter((item) => item.quantity > 0);
};
export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("bhojan_cart_items");
    return saved ? JSON.parse(saved) : [];
  });
  console.log(cart, "cart");

    useEffect(() => {
    const syncCartDataAcrossTabs = (e) => {
      if (e.key === "bhojan_cart_items") {
        const updatedData = e.newValue ? JSON.parse(e.newValue) : [];
        setCart(updatedData);
      }
    };
    window.addEventListener("storage", syncCartDataAcrossTabs);
    return () => window.removeEventListener("storage", syncCartDataAcrossTabs);
  }, []);

  useEffect(() => {
    localStorage.setItem("bhojan_cart_items", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (dish) => {
    const nextCartState = addItemToCart(cart, dish);
    setCart(nextCartState);
  };

  const removeFromCart = (dish) => {
    const nextCartState = removeItemFromCart(cart, dish);
    setCart(nextCartState);
  };

  let totalItems = 0;
  let subtotalPrice = 0;

  cart.forEach((item) => {
    totalItems = totalItems + item.quantity;
    subtotalPrice = subtotalPrice + item.price * item.quantity;
  });

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("bhojan_cart_items");
  };

  const gstFee = Math.round(subtotalPrice * 0.05);

  const deliveryFee = subtotalPrice >= 500 || subtotalPrice === 0 ? 0 : 40;

  const platformFee = subtotalPrice === 0 ? 0 : 10;

  const totalPrice = subtotalPrice + gstFee + deliveryFee + platformFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        totalItems,
        totalPrice,
        clearCart,
        gstFee,
        deliveryFee,
        platformFee,
        subtotalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  return useContext(CartContext);
}
