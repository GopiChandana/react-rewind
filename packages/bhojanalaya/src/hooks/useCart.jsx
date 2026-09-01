import { createContext, useContext, useEffect, useState, useTransition } from "react";

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
  const [isTimelinePending, startTransition] = useTransition();

  // Reset the history stack if the user makes a new move while undoing
  const [timeline, setTimeline] = useState(() => {
    const saved = localStorage.getItem("bhojan_cart_items");
    const initialCart = saved ? JSON.parse(saved) : [];
    const initialLabel = initialCart.length > 0 
      ? `Restored Active Cart (${initialCart.length} items)` 
      : "Session started";
    return [{ cart: initialCart, actionLabel: initialLabel }];
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const cart = timeline[currentIndex]?.cart || [];
  console.log(cart, "cart");

  // Full session history—never cleared, tracks everything in order
  const [auditStream, setAuditStream] = useState(() => {
    const saved = localStorage.getItem("bhojan_cart_items");
    const initialCart = saved ? JSON.parse(saved) : [];
    
    const initialLogText = initialCart.length > 0
      ? `Session restored with ${initialCart.length} items from previous visit`
      : "Session initialized";

    return [{ timestamp: new Date().toLocaleTimeString(), text: initialLogText }];
  });

  useEffect(() => {
    const syncCartDataAcrossTabs = (e) => {
      // if (e.key === "bhojan_cart_items") {
      //   const updatedCart = e.newValue ? JSON.parse(e.newValue) : [];
      //   setTimeline([{ cart: updatedCart, actionLabel: "Tabs Synchronized" }]);
      //   setCurrentIndex(0);
      //   setAuditStream(prev => [
      //     ...prev,
      //     { timestamp: new Date().toLocaleTimeString(), text: "Cart synced across browser tabs" }
      //   ]);
      // }

      if (e.key === "bhojan_cart_sync_packet" && e.newValue) {
        const packet = JSON.parse(e.newValue);
        
        // 1. Slice past timeline and append the EXACT action label from the other tab
        const cleanTimeline = timeline.slice(0, currentIndex + 1);
        setTimeline([...cleanTimeline, { cart: packet.cart, actionLabel: packet.actionLabel }]);
        setCurrentIndex(cleanTimeline.length);
        
        // 2. Append the EXACT audit ledger log text sent from the other tab
        setAuditStream(prev => [
          ...prev,
          { timestamp: packet.timestamp, text: packet.auditText }
        ]);
      }

      if (e.key === "bhojan_session_reset_trigger") {
        setTimeline([{ cart: [], actionLabel: "Session started" }]);
        setCurrentIndex(0);
        setAuditStream([
          { 
            timestamp: new Date().toLocaleTimeString(), 
            text: "Session reset via alternate tab broadcast" 
          }
        ]);
      }
    };
    window.addEventListener("storage", syncCartDataAcrossTabs);
    return () => window.removeEventListener("storage", syncCartDataAcrossTabs);
  }, [timeline,currentIndex]);

  useEffect(() => {
    localStorage.setItem("bhojan_cart_items", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (dish) => {
    // startTransition(() => {
      const cleanTimeline = timeline.slice(0, currentIndex + 1);
      const nextCartState = addItemToCart(cart, dish);

      setTimeline([...cleanTimeline, { cart: nextCartState, actionLabel: `Added ${dish.name}` }]);
      setCurrentIndex(cleanTimeline.length);
      
      // Append permanently to absolute audit ledger
      setAuditStream(prev => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), text: `➕ Added ${dish.name} to cart` }
      ]);

      localStorage.setItem("bhojan_cart_sync_packet", JSON.stringify({
      cart: nextCartState,
      actionLabel: `Added ${dish.name}`,
      auditText: `➕ Added ${dish.name} to cart`,
      timestamp: new Date().toLocaleTimeString()
    }));
    // });
  };


  const removeFromCart = (dish) => {
    // startTransition(() => {
      const cleanTimeline = timeline.slice(0, currentIndex + 1);
      const nextCartState = removeItemFromCart(cart, dish);

      setTimeline([...cleanTimeline, { cart: nextCartState, actionLabel: `Removed ${dish.name}` }]);
      setCurrentIndex(cleanTimeline.length);
      
      setAuditStream(prev => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), text: `➖ Removed ${dish.name} from cart` }
      ]);

      localStorage.setItem("bhojan_cart_sync_packet", JSON.stringify({
      cart: nextCartState,
      actionLabel: `Removed ${dish.name}`,
      auditText: `➖ Removed ${dish.name} from cart`,
      timestamp: new Date().toLocaleTimeString()
    }));
    // });
  };


  const clearCart = () => {
    startTransition(() => {
      const cleanTimeline = timeline.slice(0, currentIndex + 1);
      setTimeline([...cleanTimeline, { cart: [], actionLabel: "Cleared Whole Cart" }]);
      setCurrentIndex(cleanTimeline.length);
      
      setAuditStream(prev => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), text: "🗑️ Cleared all items from cart" }
      ]);
      localStorage.setItem("bhojan_cart_sync_packet", JSON.stringify({
      cart: [],
      actionLabel: "Cart cleared",
      auditText: "🗑️ Cleared all items from cart" ,
      timestamp: new Date().toLocaleTimeString()
    }));
    });
  };

  const rewindStep = () => {
    if (currentIndex > 0) {
      startTransition(() => {
        setAuditStream(prev => [
          ...prev,
          { timestamp: new Date().toLocaleTimeString(), text: `⏪ Undo: Step ${currentIndex} → ${currentIndex - 1}` }
        ]);
        setCurrentIndex(currentIndex - 1);
      });
    }
  };

  const fastForwardStep = () => {
    if (currentIndex < timeline.length - 1) {
      startTransition(() => {
        setAuditStream(prev => [
          ...prev,
          { timestamp: new Date().toLocaleTimeString(), text: `⏩ Redo: Step ${currentIndex} → ${currentIndex + 1}` }
        ]);
        setCurrentIndex(currentIndex + 1);
      });
    }
  };

  const jumpToTimelineIndex = (index) => {
    startTransition(() => {
      setAuditStream(prev => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), text: `🔮 Restored: ${timeline[index]?.actionLabel}` }
      ]);
      setCurrentIndex(index);
    });
  };

  const resetSession = (statusTrigger,orderPlacedTrigger) => {
  
    localStorage.removeItem("bhojan_cart_items");
    localStorage.removeItem("bhojan_checkout_status");

    localStorage.setItem("bhojan_session_reset_trigger", Date.now().toString());

    if (typeof statusTrigger === "function") statusTrigger("idle");
    if (typeof orderPlacedTrigger === "function") orderPlacedTrigger(false);
    setTimeline([{ cart: [], actionLabel: "Session started" }]);
    setCurrentIndex(0);

    setAuditStream([
      { 
        timestamp: new Date().toLocaleTimeString(), 
        text: "Session reset: Wiped all local data" 
      }
    ]);
  };

  let totalItems = 0;
  let subtotalPrice = 0;

  cart.forEach((item) => {
    totalItems = totalItems + item.quantity;
    subtotalPrice = subtotalPrice + item.price * item.quantity;
  });

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
        subtotalPrice,

        resetSession,
        
        timeline,
        currentIndex,
        auditStream,
        rewindStep,
        fastForwardStep,
        jumpToTimelineIndex,
        isTimelinePending,
        canRewind: currentIndex > 0,
        canFastForward: currentIndex < timeline.length - 1
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  return useContext(CartContext);
}
