import React, { useEffect, useRef, useState } from "react";
import { useCart } from "../hooks/useCart";
import { useTabSync } from "../hooks/useTabSync";
import RewindHistory from "./RewindHistory";

const ShoppingCart = ({
  onSuccessfulOrder,
  onPlacingOrder,
  minimumOrderPlaced,
}) => {
  const {
    cart,
    addToCart,
    removeFromCart,
    totalPrice,
    clearCart,
    subtotalPrice,
    gstFee,
    deliveryFee,
    platformFee,
    totalItems,
  } = useCart();

  const [checkoutStatus, setCheckoutStatus] = useState("idle");
  const listBottomRef = useRef(null);
  useTabSync("bhojan_checkout_status", (newStatus) => {
    if (newStatus) setCheckoutStatus(newStatus);
  });
  console.log(cart, checkoutStatus, "cart in shopping");
  useEffect(() => {
    if (listBottomRef.current) {
      listBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [cart.length]);

  const handleCheckout = () => {
    console.log("Processing Cart Request...");
    if (totalPrice < 250) {
      setCheckoutStatus("error");
      minimumOrderPlaced(true);
      localStorage.setItem("bhojan_checkout_status", "error");
    } else {
      setCheckoutStatus("success");
      onPlacingOrder(true);
      minimumOrderPlaced(false);
      localStorage.setItem("bhojan_checkout_status", "success");
    }
  };

  const handleSuccessDone = () => {
    setCheckoutStatus("idle");
    localStorage.setItem("bhojan_checkout_status", "idle");
    clearCart();
    onSuccessfulOrder();
    onPlacingOrder(false);
  };

  const handleRetry = () => {
    setCheckoutStatus("idle");
    minimumOrderPlaced(false);
    localStorage.setItem("bhojan_checkout_status", "idle");
  };

  if (cart.length === 0) {
    return (
    
      <div className={styles.outerContainer}>
        <RewindHistory isCartEmpty={cart?.length || 0}/>
        <div className={styles.emptyState}>
          Your cart is completely empty.
        </div>
      </div>
      
    );
  }

  return (
    <div className={styles.outerContainer}>
      <RewindHistory />
      <div
        className={styles.innerContainer}
      >
        {checkoutStatus === "error" && (
          <div className={styles.errorCard}>
            <div className={styles.errorIcon}>✕</div>
            <h3 className={styles.errorTitle}>Transaction Declined</h3>
            <p className={styles.errorMessage}>
              Your order could not be processed. Minimum order value for
              delivery is ₹250.
            </p>
            <button onClick={handleRetry} className={styles.retryButton}>
              Go Back & Fix Order
            </button>
          </div>
        )}

        {checkoutStatus === "success" && (
          <div className={styles.receiptCard}>
       
            <div className={styles.successIcon}>✓</div>
            <h5 className={styles.receiptTitle}>Order Placed!</h5>
            <h6 className={styles.receiptMessage}>
              REQUEST SENT TO KITCHEN
            </h6>
            <div className={styles.scrollList}>
              <div className={styles.receiptSummary}>
                {cart.map((item) => (
                  <div key={item.id} className={styles.receiptItem}>
                    <div className={styles.receiptItemWrapper}>
                      <span className={styles.receiptItemName}>
                        {item.featuredDish}
                      </span>
                      <span className={styles.receiptItemQuantity}>
                        × {item.quantity}
                      </span>
                    </div>
                    <span className={styles.receiptItemPrice}>
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
                <div className={styles.receiptDivider} />
                <div className={styles.receiptItem}>
                  <span className="text-zinc-500 shrink-0 font-medium pr-2">
                    Paid Via
                  </span>
                  <span className="text-zinc-300 font-medium">
                    Pay on Delivery (Cash/UPI)
                  </span>
                </div>
                <div className={styles.receiptTotalRow}>
                  <span>Amount Due On Delivery :</span>
                  <span className="text-emerald-400">₹{totalPrice}</span>
                </div>
              </div>
            </div>
            <button onClick={handleSuccessDone} className={styles.doneButton}>
              Done
            </button>
          </div>
        )}

        {checkoutStatus === "idle" && cart.length > 0 && (
          <>
            <div className={styles.scrollList}>
              {cart.map((item) => (
                <div key={item.id} className={styles.dishRow}>
                  <div className={styles.dishDetails}>
                    <span className={styles.dishName}>{item.featuredDish}</span>
                    <span className={styles.dishPrice}>₹{item.price} each</span>
                  </div>
                  <div className={styles.quantityContainer}>
                    <button
                      onClick={() => removeFromCart(item)}
                      className={styles.quantityButton}
                    >
                      -
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className={styles.quantityButton}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              <div ref={listBottomRef} />
            </div>

            <div className={styles.breakdownBox}>
              <div className={styles.breakdownRow}>
                <span>Item Subtotal:</span>
                <span>₹{subtotalPrice}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Govt Taxes & GST (5%):</span>
                <span>₹{gstFee}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Platform Delivery Fee:</span>
                <span
                  className={
                    deliveryFee === 0 ? "text-emerald-500 font-medium" : ""
                  }
                >
                  {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                </span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Platform Convenience Fee:</span>
                <span>₹{platformFee}</span>
              </div>
            </div>

            <div className={styles.footer}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total Amount Payable:</span>
                <span className={styles.totalAmount}>₹{totalPrice}</span>
              </div>
              <button
                className={styles.checkoutButton}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;

const styles = {
  outerContainer: "flex flex-col h-full min-h-0 w-full",

  innerContainer: "flex flex-col flex-1 min-h-0 w-full relative",

  emptyState: "block text-center py-8 text-zinc-500 text-sm bg-zinc-900/30 border border-zinc-800/80 rounded-2xl w-full",

  dishWrapper: "flex flex-col gap-4 w-full",

  scrollList: "flex flex-col gap-3 max-h-[138px] overflow-y-auto pr-1 ",

  dishRow:
    "flex items-center justify-between text-sm py-1 border-b border-zinc-800/50 pb-2",
  dishDetails: "flex flex-col",
  dishName: "font-medium text-zinc-200",
  dishPrice: "text-xs text-zinc-500",

  quantityContainer:
    "flex items-center gap-2 bg-zinc-800/80 border border-zinc-700/50 rounded-lg px-2 py-1",
  quantityButton: "text-zinc-400 hover:text-white px-1 font-bold",
  quantity: "text-xs font-semibold text-zinc-200 w-4 text-center",

  footer: "border-t border-zinc-800 pt-4 mt-2 flex flex-col gap-3",
  totalRow: "flex justify-between items-center text-sm",
  totalLabel: "text-zinc-400",
  totalAmount: "text-lg font-bold text-emerald-400",
  checkoutButton:
    "w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition-all text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-950/20 cursor-pointer",

  errorCard:
    "bg-zinc-900/50 border border-red-900/50 p-5 rounded-2xl flex flex-col items-center text-center gap-2",
  errorIcon:
    "text-red-400 bg-red-950/40 border border-red-800/50 w-12 h-12 flex items-center justify-center rounded-full text-sm font-bold mb-1",
  errorTitle: "text-base font-bold text-red-400",
  errorMessage: "text-xs text-zinc-400 max-w-[210px] leading-relaxed",
  retryButton:
    "w-full mt-2 py-2 bg-red-950/30 hover:bg-red-950/50 border border-red-900/50 rounded-xl text-xs font-semibold text-red-200 transition-all cursor-pointer",

  receiptCard:
    "bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex flex-col items-center text-center gap-2",
  successIcon:
    "text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 w-7 h-7 flex items-center justify-center rounded-full text-md font-bold mb-1",
  receiptTitle: "text-base font-bold text-zinc-100",
  receiptMessage: "text-xs text-zinc-500 max-w-[200px] leading-relaxed font-bold",
  receiptSummary:
    "w-full border-t border-b border-zinc-800/80 my-2 py-3 flex flex-col gap-2 text-xs text-zinc-400",
  receiptItem: "flex justify-between items-center w-full",
  receiptItemWrapper: "flex items-center gap-1.5 min-w-0 flex-1 pr-2",
  receiptItemName: "truncate",
  receiptItemQuantity: "text-neutral-400 shrink-0",
  receiptItemPrice: "font-bold shrink-0 text-right",
  receiptTotalRow:
    "flex justify-between items-center font-bold text-zinc-200 border-t border-zinc-800/50 pt-2 mt-1",
  doneButton:
    "w-full py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-semibold text-zinc-200 transition-all cursor-pointer",

  breakdownBox:
    "flex flex-col gap-2 bg-zinc-950/40 border border-zinc-900 rounded-xl p-3 text-xs text-zinc-400",
  breakdownRow: "flex justify-between items-center",
};
