import { useCart } from "../hooks/useCart";
import { Restaurant } from "../restaurantData";

interface DishCardProps {
  dish: Restaurant;
  successfulOrderPlaced: boolean;
}
const DishCard = ({ dish, successfulOrderPlaced }: DishCardProps) => {
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
        <div className={styles.minuteDetailsWrapper}>
          <span className={styles.rating}>
            <span className="mr-1">⭐</span> {rating}
          </span>
          <span className="bg-zinc-950/40 py-0.5 px-0.5 rounded border border-zinc-800/30">
            <span className="text-yellow-400 pr-1 font-bold">•</span>
            {deliveryTime}
          </span>
          <span className="text-zinc-400 font-bold">
            <span className="text-yellow-400 pr-1">•</span>
            {costForTwo} for two
          </span>
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
          className={`${!successfulOrderPlaced ? "cursor-pointer" : "cursor-none pointer-events-none"} px-3 ml-2 py-1.5 lg:py-2 bg-orange-600/10 hover:bg-orange-600 text-orange-500 hover:text-white border border-orange-600/30 hover:border-orange-600 text-xs font-bold rounded-lg transition-all duration-200 active:scale-95 flex justify-center items-center gap-1 shadow-sm shrink-0 h-fit self-end`}
        >
          <span className="lg:hidden">Add</span>

          <span className="hidden lg:inline">Add To Cart</span>
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
  title:
    "flex flex-wrap text-zinc-100 font-semibold text-base sm:text-lg capitalize truncate",
  cuisine: "text-zinc-400 text-xs",

  specialDish:
    "bg-zinc-950 p-2.5 rounded-xl text-xs text-orange-400 border border-zinc-800/40",

  footerRow:
    "flex flex-row items-center justify-between w-full pt-2.5 border-t border-zinc-800/60 mt-1",

  minuteDetailsWrapper:
    "flex flex-wrap  xl:flex-nowrap whitespace-nowrap items-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs text-zinc-400 max-w-[70%] sm:max-w-none font-medium font-mono",
  rating: "text-emerald-400 font-bold mx-1 flex items-center gap-1",

  vegDotBox:
    "w-4 h-4 border-2 border-green-600 flex items-center justify-center p-0.5 mt-1 rounded-sm bg-zinc-950",
  vegDot: "w-1.5 h-1.5 rounded-full bg-green-600",
  nonVegDotBox:
    "w-4 h-4 border-2 border-red-600 flex items-center justify-center p-0.5 mt-1 rounded-sm bg-zinc-950",
  nonVegDot: "w-1.5 h-1.5 rounded-full bg-red-600",
};
