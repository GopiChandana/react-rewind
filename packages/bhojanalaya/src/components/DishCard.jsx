import React from "react";
import { useCart } from "../hooks/useCart";

const DishCard = ({ dish, successfulOrderPlaced }) => {
  console.log(successfulOrderPlaced, "orderStatus");
  const {
    id,
    name,
    cuisine,
    rating,
    deliveryTime,
    costForTwo,
    isPureVeg,
    featuredDish,
  } = dish;
  const { addToCart } = useCart();
  return (
    <div className={styles.dishCard}>
      <div className={styles.titleRow}>
        <div>
          <h3 className={styles.title}>{name}</h3>
          <p className={styles.cuisine}>{cuisine}</p>
        </div>

        {isPureVeg ? (
          <div className={styles.vegDotBox} title="Pure Veg">
            <div className={styles.vegDot} />
          </div>
        ) : (
          <div className={styles.nonVegDotBox} title="Non Veg">
            <div className={styles.nonVegDot} />
          </div>
        )}
      </div>
      <div className={styles.specialDish}>
        <strong>★ Must Try:</strong> {featuredDish}
      </div>
      <div className={styles.footerRow}>
        <div className="flex items-center justify-around gap-2 text-[10px] sm:text-xs text-zinc-500 font-medium font-mono">
          <span className={styles.rating}>
            <span>⭐</span> {rating}
          </span>
          <span className="bg-zinc-950/40 px-1.5 py-0.5 rounded border border-zinc-800/30">
            {deliveryTime}
          </span>
          <span className="text-zinc-400 font-bold">{costForTwo} for two</span>
        </div>
        <button
          onClick={() => {
            if (!successfulOrderPlaced) {
              addToCart({
                id: id,
                featuredDish: featuredDish,
                name: name,
                price: Math.floor(parseInt(costForTwo) / 2) || 150,
              });
            }
          }}
          className={`${!successfulOrderPlaced ? "cursor-pointer" : "cursor-none pointer-events-none"} px-1.5 lg:px-3.5 py-1.5 bg-orange-600/10 hover:bg-orange-600 text-orange-500 hover:text-white border border-orange-600/30 hover:border-orange-600 text-xs font-bold rounded-lg transition-all duration-200 active:scale-95 flex justify-center items-center gap-1 shadow-sm`}
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
};

export default DishCard;

const styles = {
  dishCard:
    "bg-zinc-900 border border-zinc-800 rounded-3xl p-3.5 sm:p-5 flex flex-col gap-3 shadow-lg shadow-black/40 hover:border-zinc-700/50 hover:shadow-xl hover:shadow-black/60 hover:scale-[1.02] transition-all duration-300 ease-out hover:-translate-y-1.5",

  titleRow: "flex justify-between items-start",
  title: "text-zinc-100 font-bold text-base sm:text-lg capitalize truncate",
  cuisine: "text-zinc-400 text-xs",

  specialDish:
    "bg-zinc-950 p-2.5 rounded-xl text-xs text-orange-400 border border-zinc-800/40",

  footerRow:
    "flex flex-col gap-2.5 w-full items-stretch pt-2.5 border-t border-zinc-800/60 w-full sm:flex-row sm:justify-between sm:items-center sm:gap-2 mt-1",

  rating: "text-emerald-400 font-bold mx-1 flex items-center gap-2",

  vegDotBox:
    "w-4 h-4 border-2 border-green-600 flex items-center justify-center p-0.5 mt-2 rounded-sm bg-zinc-950",
  vegDot: "w-1.5 h-1.5 rounded-full bg-green-600",
  nonVegDotBox:
    "w-4 h-4 border-2 border-red-600 flex items-center justify-center p-0.5 mt-2 rounded-sm bg-zinc-950",
  nonVegDot: "w-1.5 h-1.5 rounded-full bg-red-600",
};
