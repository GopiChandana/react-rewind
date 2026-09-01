import React, { useState } from "react";

export default function BillSplitter({
  receiptSnapshot,
  receiptTotalSnapshot,
  onBack,
  onDone,
  gstFee,
  deliveryFee,
  subtotalPrice,
  platformFee,
 
}) {

  const [friendsList, setFriendsList] = useState([
    { id: 1, name: "Me", items: [] },
  ]);
  const [activeFriendId, setActiveFriendId] = useState(1);
  const [friendInput, setFriendInput] = useState("");
  const [paymentTarget, setPaymentTarget] = useState("");
  const [validationError, setValidationError] = useState("");


  const handleAddNewFriend = () => {
    if (!friendInput.trim()) return;
    const newFriend = { id: Date.now(), name: friendInput.trim(), items: [] };
    setFriendsList([...friendsList, newFriend]);
    setActiveFriendId(newFriend.id);
    setFriendInput("");
  };

  // Delete Friend (Keeps at least one user)
  const handleDeleteFriend = (id, e) => {
    e.stopPropagation();
    if (friendsList.length <= 1) return;
    const filtered = friendsList.filter((f) => f.id !== id);
    setFriendsList(filtered);
    if (activeFriendId === id) {
      setActiveFriendId(filtered[0].id);
    }
  };


  const handleAdjustPortion = (itemId, change) => {
    setFriendsList(
      friendsList.map((f) => {
        if (f.id === activeFriendId) {
          const existingAssignment = f.items.find((i) => i.itemId === itemId);
          const targetItem = receiptSnapshot.find((i) => i.id === itemId);
          const totalAvailableQty = targetItem ? targetItem.quantity : 0;

          if (existingAssignment) {
            const nextQty = existingAssignment.qty + change;
            if (nextQty <= 0) {
              return {
                ...f,
                items: f.items.filter((i) => i.itemId !== itemId),
              };
            }
            if (nextQty > totalAvailableQty) return f;
            return {
              ...f,
              items: f.items.map((i) =>
                i.itemId === itemId ? { ...i, qty: nextQty } : i,
              ),
            };
          } else if (change > 0) {
            return { ...f, items: [...f.items, { itemId, qty: 1 }] };
          }
        }
        return f;
      }),
    );
  };

  const getPortionsClaimedCount = (itemId) => {
    return friendsList.reduce((sum, f) => {
      const match = f.items.find((i) => i.itemId === itemId);
      return sum + (match ? match.qty : 0);
    }, 0);
  };


  const calculateSingleFriendBill = (friend) => {

    const friendFoodSubtotal = friend.items.reduce((sum, assignment) => {
      const targetItem = receiptSnapshot.find((i) => String(i.id) === String(assignment.itemId));
      if (!targetItem) return sum;
      return sum + (assignment.qty * targetItem.price);
    }, 0);

    if (friendFoodSubtotal === 0 || !receiptTotalSnapshot) return 0;

    // 2. Re-calculate total raw food cost of the entire receipt snapshot
    const totalRawFoodCost = receiptSnapshot.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (totalRawFoodCost === 0) return 0;

    // 3. Proportional Multiplier directly against overall total price(Includes all fixed taxes/fees)
    const friendRatio = friendFoodSubtotal / totalRawFoodCost;
    return Math.round(receiptTotalSnapshot * friendRatio);

  };


  const validatePaymentInput = (value) => {
    const trimmed = value.trim();
    
   
    if (!trimmed) {
      setValidationError("Please enter a valid 10-digit mobile number");
      return false;
    }

    // 2. Regex for Indian Phone Numbers: exactly 10 digits
    const phoneRegex = /^[6-9]\d{9}$/;

    if (phoneRegex.test(trimmed)) {
      setValidationError(""); 
      return true;
    } else {
      setValidationError("Please enter a valid 10-digit mobile number");
      return false;
    }
  };


  const handleLaunchWhatsAppWebSync = () => {
    if (!validatePaymentInput(paymentTarget)) {
      return; 
    }

    let text = `BHOJANALAYA ITEMISED BILL SPLIT:\n`;
    text += `================================\n\n`;

    friendsList.forEach((f) => {
      const shareValue = Math.round(calculateSingleFriendBill(f));

      const itemsBulletListText = f.items
        .map((assignment) => {
          const dish = receiptSnapshot.find((i) => String(i.id) === String(assignment.itemId));
          return dish ? `  - ${dish.featuredDish} (x ${assignment.qty})` : "";
        })
        .filter(Boolean)
        .join("\n"); 

      if (shareValue > 0) {
        text += `${f.name.toUpperCase()} --> INR ${shareValue}\n\n`;
        text += `${itemsBulletListText || "  - No items assigned"}\n\n`;
        text += `-----------------------------------\n\n`;
      }
    });

    text += `Grand Total Invoice: INR ${receiptTotalSnapshot}\n`;
    text += `(Note: Proportional GST, delivery fee, and platform charges are fully included in the individual totals above.)\n`;


   
    text += `\n Settle up directly to this number: ${paymentTarget.trim()}\n`;
    

    text += `\nPlease settle up soon. Thank you!`;

    const whatsappBaseUrl = "https://wa.me";


    const cleanPayload = encodeURIComponent(text);
    const cleanNumber = paymentTarget.trim().replace(/\D/g, ""); 
   
   window.open(`${whatsappBaseUrl}/91${cleanNumber}?text=${cleanPayload}`, "_blank");

  };


  const currentlyFocusedFriend = friendsList.find(
    (f) => f.id === activeFriendId,
  );

  return (
 
  <div className={styles.container}>

    <div className={styles.headerSection}>
      <span className={styles.headerLabel}>
        👥 Add Friends to Bill Splitter
      </span>
      <div className={styles.inputRow}>
        <input
          type="text"
          placeholder="Enter friend name..."
          value={friendInput}
          onChange={(e) => setFriendInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddNewFriend()}
          className={styles.friendInput}
        />
        <button onClick={handleAddNewFriend} className={styles.addButton}>
          Add
        </button>
      </div>
    </div>


    <div className={styles.friendsScrollContainer}>
      {friendsList.map((f) => {
        const isSelected = f.id === activeFriendId;
        const cost = Math.round(calculateSingleFriendBill(f));

        return (
          <button
            key={f.id}
            onClick={() => setActiveFriendId(f.id)}
            className={`${styles.friendTabBase} ${
              isSelected ? styles.friendTabActive : styles.friendTabInactive
            }`}
          >
            <span>{`${f.name} (₹${cost})`}</span>
            {friendsList.length > 1 && (
              <span
                onClick={(e) => handleDeleteFriend(f.id, e)}
                className={styles.deleteFriendIcon}
                title="Delete Diner"
              >
                ✕
              </span>
            )}
          </button>
        );
      })}
    </div>


    <div className={styles.allocationList}>
      <p className={styles.allocationInstruction}>
        Allocate portions eaten by{" "}
        <span className={styles.activeFriendHighlight}>
          {currentlyFocusedFriend?.name}
        </span>
        :
      </p>

      {receiptSnapshot.map((item) => {
        const claim = currentlyFocusedFriend?.items.find(
          (i) => i.itemId === item.id,
        );
        const claimedQty = claim ? claim.qty : 0;
        const totalGroupClaims = getPortionsClaimedCount(item.id);
        const poolRemaining = item.quantity - totalGroupClaims;

        return (
          <div
            key={item.id}
            className={`${styles.itemCardBase} ${
              claimedQty > 0 ? styles.itemCardClaimed : styles.itemCardUnclaimed
            }`}
          >
            <div className={styles.itemInfoContainer}>
              <span
                className={
                  claimedQty > 0
                    ? styles.itemNameClaimed
                    : styles.itemNameUnclaimed
                }
              >
                {item.featuredDish}
              </span>
              <div className={styles.itemPriceMeta}>
                <span>
                  Max Order Qty: {item.quantity} × ₹{item.price}
                </span>
                {poolRemaining > 0 && (
                  <span className={styles.portionsLeftBadge}>
                    ({poolRemaining} left)
                  </span>
                )}
              </div>
            </div>

      
            <div className={styles.stepperContainer}>
              <button
                onClick={() => handleAdjustPortion(item.id, -1)}
                className={styles.stepperBtnMinus}
              >
                -
              </button>
              <span className={styles.stepperValueDisplay}>
                {claimedQty}
              </span>
              <button
                onClick={() => handleAdjustPortion(item.id, 1)}
                disabled={poolRemaining <= 0}
                className={`${styles.stepperBtnPlusBase} ${
                  poolRemaining > 0
                    ? styles.stepperBtnPlusAvailable
                    : styles.stepperBtnPlusDisabled
                }`}
              >
                +
              </button>
            </div>
          </div>
        );
      })}
    </div>


    <div className={styles.footerPanel}>
      <div className={styles.paymentInputContainer}>
        <label className={styles.paymentLabel}>
          Your Payment Handle (Settle-Up Destination):
        </label>
        <input
          type="text"
          placeholder="e.g. 9876543210"
          value={paymentTarget}
          onChange={(e) => {
            setPaymentTarget(e.target.value);
            if (validationError) setValidationError("");
          }}
          className={`${styles.paymentInputBase} ${
            validationError
              ? styles.paymentInputError
              : styles.paymentInputValid
          }`}
        />
        {validationError && (
          <span className={styles.validationErrorMessage}>
            {validationError}
          </span>
        )}
      </div>

      <div className={styles.grandTotalRow}>
        <span className={styles.grandTotalLabel}>Grand Bill Due:</span>
        <span className={styles.grandTotalValue}>
          ₹{receiptTotalSnapshot}
        </span>
      </div>

      <button
        onClick={handleLaunchWhatsAppWebSync}
        className={styles.whatsappShareBtn}
      >
        💬 Share Group Split via WhatsApp
      </button>

      <button onClick={onBack} className={styles.backNavBtn}>
        ← Back to original receipt
      </button>
    </div>
  </div>
);

  
}


const styles = {
  container: "flex flex-col h-full min-h-0 justify-between w-full relative text-zinc-100",

  headerSection: "flex flex-col gap-1.5 pb-2.5 border-b border-zinc-800 shrink-0 w-full",
  headerLabel: "text-[10px] uppercase font-black text-orange-400 tracking-wider",

  inputRow: "flex gap-2 w-full mt-0.5",
  friendInput: "bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs flex-1 text-zinc-200 focus:outline-none focus:border-zinc-700 font-sans",
  addButton: "bg-zinc-800 hover:bg-zinc-700 px-3 rounded-xl text-xs font-bold transition cursor-pointer text-zinc-300",

  friendsScrollContainer: "flex gap-1.5 overflow-x-auto py-2.5 border-b border-zinc-800/40 shrink-0 custom-scrollbar max-w-full items-center",
  friendTabBase: "px-2.5 py-1 rounded-xl text-[10px] font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 border group",
  friendTabActive: "bg-orange-500/10 border-orange-500 text-orange-400",
  friendTabInactive: "bg-zinc-950/40 border-zinc-800/60 text-zinc-500 hover:text-zinc-400",
  deleteFriendIcon: "text-[9px] text-zinc-600 hover:text-red-400 transition font-mono px-0.5",


  allocationList: "flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col gap-2 py-3 pr-1",
  allocationInstruction: "text-[9px] uppercase tracking-wider text-zinc-500 font-bold mb-1",
  activeFriendHighlight: "text-orange-400 font-black",

  itemCardBase: "flex items-center justify-between p-2.5 rounded-xl border text-left transition",
  itemCardClaimed: "bg-zinc-800/80 border-zinc-700 text-orange-400 shadow-sm",
  itemCardUnclaimed: "bg-zinc-950/10 border-zinc-800/30 text-zinc-500 opacity-70",
  itemInfoContainer: "flex flex-col gap-0.5 truncate pr-2",
  itemNameClaimed: "text-xs font-semibold truncate text-zinc-200",
  itemNameUnclaimed: "text-xs font-semibold truncate text-zinc-400",
  itemPriceMeta: "flex items-center gap-1.5 text-[9px] text-zinc-500 font-mono",
  portionsLeftBadge: "text-emerald-500 font-sans font-bold",


  stepperContainer: "flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1 shrink-0",
  stepperBtnMinus: "w-5 h-5 rounded bg-zinc-800 text-zinc-400 hover:text-white font-bold transition flex items-center justify-center text-xs cursor-pointer select-none",
  stepperValueDisplay: "font-mono font-bold text-xs text-zinc-200 w-4 text-center select-none",
  stepperBtnPlusBase: "w-5 h-5 rounded font-bold transition flex items-center justify-center text-xs select-none",
  stepperBtnPlusAvailable: "bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer",
  stepperBtnPlusDisabled: "bg-zinc-950/20 text-zinc-700 cursor-not-allowed",


  footerPanel: "shrink-0 pt-3 border-t border-zinc-800 flex flex-col gap-2.5 mt-auto w-full",

  paymentInputContainer: "flex flex-col gap-1 w-full px-0.5",
  paymentLabel: "text-[9px] uppercase tracking-wider text-zinc-500 font-bold",
  paymentInputBase: "bg-zinc-950 border rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none w-full placeholder:text-zinc-700 font-mono transition duration-150",
  paymentInputValid: "border-zinc-800 focus:border-zinc-700",
  paymentInputError: "border-red-500/80 focus:border-red-500",

  validationErrorMessage: "text-[9px] text-red-400 font-medium px-1 mt-0.5 animate-in fade-in duration-100",
  grandTotalRow: "flex justify-between items-center text-xs px-0.5 mt-0.5",
  grandTotalLabel: "text-zinc-400 font-medium",
  grandTotalValue: "font-mono font-bold text-emerald-400 text-base",

  whatsappShareBtn: "w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs font-bold transition text-center cursor-pointer shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-1.5",
  
  backNavBtn: "text-[10px] text-zinc-500 hover:text-zinc-300 font-bold uppercase tracking-wider transition text-center cursor-pointer py-0.5"
};
