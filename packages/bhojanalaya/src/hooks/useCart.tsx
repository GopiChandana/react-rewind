import {
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
  ReactNode,
} from "react";

export type CartItem = {
  featuredDish: string;
  id: string;
  name: string;
  price: number;
  quantity: number;
};
export type Dish = Omit<CartItem, "quantity">;

export type TimelineItem = {
  cart: CartItem[];
  actionLabel: string;
};

export type AuditItem = {
  timestamp: string;
  text: string;
};

export type CartContextType = {
  // Cart
  cart: CartItem[];

  // Cart actions
  addToCart: (dish: Dish) => void;
  removeFromCart: (dish: CartItem) => void;
  clearCart: () => void;

  // Prices
  totalItems: number;
  totalPrice: number;
  subtotalPrice: number;
  gstFee: number;
  deliveryFee: number;
  platformFee: number;

  // Session
  resetSession: (
    statusTrigger?: (status: string) => void,
    orderPlacedTrigger?: (value: boolean) => void,
  ) => void;

  // Timeline
  timeline: TimelineItem[];
  currentIndex: number;

  rewindStep: () => void;
  fastForwardStep: () => void;
  jumpToTimelineIndex: (index: number) => void;

  // Audit
  auditStream: AuditItem[];

  // Transition state
  isTimelinePending: boolean;

  // Navigation state
  canRewind: boolean;
  canFastForward: boolean;
};
const CartContext = createContext<CartContextType | null>(null);

const addItemToCart = (currentCart: CartItem[], itemToAdd: Dish) => {
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

const removeItemFromCart = (
  currentCart: CartItem[],
  itemToRemove: CartItem,
) => {
  console.log(currentCart, itemToRemove, "addItemToRemove");
  const updatedCart = currentCart.map((item) =>
    item.id === itemToRemove.id
      ? { ...item, quantity: item.quantity - 1 }
      : item,
  );
  return updatedCart.filter((item) => item.quantity > 0);
};
export function CartProvider({ children }: { children: ReactNode }) {
  const [isTimelinePending, startTransition] = useTransition();

  // Reset the history stack if the user makes a new move while undoing
  const [timeline, setTimeline] = useState(() => {
    const saved = localStorage.getItem("bhojan_cart_items");
    const initialCart = saved ? JSON.parse(saved) : [];
    const initialLabel =
      initialCart.length > 0
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

    const initialLogText =
      initialCart.length > 0
        ? `Session restored with ${initialCart.length} items from previous visit`
        : "Session initialized";

    return [
      { timestamp: new Date().toLocaleTimeString(), text: initialLogText },
    ];
  });

  useEffect(() => {
    const syncCartDataAcrossTabs = (e: StorageEvent) => {
      if (e.key === "bhojan_cart_sync_packet" && e.newValue) {
        const packet = JSON.parse(e.newValue);

        // 1. Slice past timeline and append the EXACT action label from the other tab
        const cleanTimeline = timeline.slice(0, currentIndex + 1);
        setTimeline([
          ...cleanTimeline,
          { cart: packet.cart, actionLabel: packet.actionLabel },
        ]);
        setCurrentIndex(cleanTimeline.length);

        // 2. Append the EXACT audit ledger log text sent from the other tab
        setAuditStream((prev) => [
          ...prev,
          { timestamp: packet.timestamp, text: packet.auditText },
        ]);
      }

      if (e.key === "bhojan_session_reset_trigger") {
        setTimeline([{ cart: [], actionLabel: "Session started" }]);
        setCurrentIndex(0);
        setAuditStream([
          {
            timestamp: new Date().toLocaleTimeString(),
            text: "Session reset via alternate tab broadcast",
          },
        ]);
      }
    };
    window.addEventListener("storage", syncCartDataAcrossTabs);
    return () => window.removeEventListener("storage", syncCartDataAcrossTabs);
  }, [timeline, currentIndex]);

  useEffect(() => {
    localStorage.setItem("bhojan_cart_items", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (dish: Dish) => {
    // startTransition(() => {
    const cleanTimeline = timeline.slice(0, currentIndex + 1);
    const nextCartState = addItemToCart(cart, dish);

    setTimeline([
      ...cleanTimeline,
      { cart: nextCartState, actionLabel: `Added ${dish.featuredDish}` },
    ]);
    setCurrentIndex(cleanTimeline.length);

    // Append permanently to absolute audit ledger
    setAuditStream((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        text: `➕ Added ${dish.featuredDish} to cart`,
      },
    ]);

    localStorage.setItem(
      "bhojan_cart_sync_packet",
      JSON.stringify({
        cart: nextCartState,
        actionLabel: `Added ${dish.featuredDish}`,
        auditText: `➕ Added ${dish.featuredDish} to cart`,
        timestamp: new Date().toLocaleTimeString(),
      }),
    );
    // });
  };

  const removeFromCart = (dish: CartItem) => {
    // startTransition(() => {
    const cleanTimeline = timeline.slice(0, currentIndex + 1);
    const nextCartState = removeItemFromCart(cart, dish);

    setTimeline([
      ...cleanTimeline,
      { cart: nextCartState, actionLabel: `Removed ${dish.featuredDish}` },
    ]);
    setCurrentIndex(cleanTimeline.length);

    setAuditStream((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        text: `➖ Removed ${dish.featuredDish} from cart`,
      },
    ]);

    localStorage.setItem(
      "bhojan_cart_sync_packet",
      JSON.stringify({
        cart: nextCartState,
        actionLabel: `Removed ${dish.featuredDish}`,
        auditText: `➖ Removed ${dish.featuredDish} from cart`,
        timestamp: new Date().toLocaleTimeString(),
      }),
    );
    // });
  };

  const clearCart = () => {
    startTransition(() => {
      const cleanTimeline = timeline.slice(0, currentIndex + 1);
      setTimeline([
        ...cleanTimeline,
        { cart: [], actionLabel: "Cleared Whole Cart" },
      ]);
      setCurrentIndex(cleanTimeline.length);

      setAuditStream((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          text: "🗑️ Cleared all items from cart",
        },
      ]);
      localStorage.setItem(
        "bhojan_cart_sync_packet",
        JSON.stringify({
          cart: [],
          actionLabel: "Cart cleared",
          auditText: "🗑️ Cleared all items from cart",
          timestamp: new Date().toLocaleTimeString(),
        }),
      );
    });
  };

  const rewindStep = () => {
    if (currentIndex > 0) {
      startTransition(() => {
        setAuditStream((prev) => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            text: `⏪ Undo: Step ${currentIndex} → ${currentIndex - 1}`,
          },
        ]);
        setCurrentIndex(currentIndex - 1);
      });
    }
  };

  const fastForwardStep = () => {
    if (currentIndex < timeline.length - 1) {
      startTransition(() => {
        setAuditStream((prev) => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            text: `⏩ Redo: Step ${currentIndex} → ${currentIndex + 1}`,
          },
        ]);
        setCurrentIndex(currentIndex + 1);
      });
    }
  };

  const jumpToTimelineIndex = (index: number) => {
    startTransition(() => {
      setAuditStream((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          text: `🔮 Restored: ${timeline[index]?.actionLabel}`,
        },
      ]);
      setCurrentIndex(index);
    });
  };

  const resetSession = (
    statusTrigger?: (status: string) => void,
    orderPlacedTrigger?: (value: boolean) => void,
  ) => {
    console.log(statusTrigger, orderPlacedTrigger, "line196useCart");
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
        text: "Session reset: Wiped all local data",
      },
    ]);
  };

  let totalItems = 0;
  let subtotalPrice = 0;

  cart.forEach((item: CartItem) => {
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
        canFastForward: currentIndex < timeline.length - 1,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};
