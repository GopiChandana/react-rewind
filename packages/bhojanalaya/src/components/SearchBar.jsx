import React, { useEffect, useState } from "react";
import { restaurants } from "../restaurantData";
import { useDebounce } from "../hooks/useDebounce";
import { useTabSync } from "../hooks/useTabSync";
import { fuzzyMatch } from "../utils/fuzzyMatch";

const SearchBar = ({ setResults }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isPureVegFilter, setIsPureVegFilter] = useState(false);

  useDebounce(query, setDebouncedQuery);
  useTabSync("current_query", setQuery);
  useTabSync("veg_filter_active", (val) => setIsPureVegFilter(val === "true"));

  useEffect(() => {
    const searchQuery = debouncedQuery.trim();

    console.log(CUISINES, "cuisinmes");

    const scoredMatches = CUISINES.map((item) => {
      const nameMatch = fuzzyMatch(item.name || "", searchQuery);
      const dishMatch = fuzzyMatch(item.featuredDish || "", searchQuery);

      // cuisine's logic 
      const cuisineTags = (item.cuisine || "").split(",").map(tag => tag.trim());
      const tagMatches = cuisineTags.map(tag => fuzzyMatch(tag, searchQuery));
      const anyTagMatched = tagMatches.some(match => match.matches);

      const validTagScores = tagMatches.filter(m => m.matches).map(m => m.score);
      const bestCuisineScore = validTagScores.length > 0 ? Math.min(...validTagScores) : Infinity;

      const isMatched =
        nameMatch.matches || anyTagMatched || dishMatch.matches;

      const validScores = [];
      if (nameMatch.matches) validScores.push(nameMatch.score);
      if (anyTagMatched) validScores.push(bestCuisineScore);
      if (dishMatch.matches) validScores.push(dishMatch.score);

      const bestScore = validScores.length > 0 ? Math.min(...validScores) : Infinity;

      return { item, isMatched: bestScore !== Infinity, score: bestScore };
    });

    console.log(scoredMatches, "scoredMatches");

    const filteredAndSorted = scoredMatches
      .filter((match) => {
        if (!match.isMatched) return false;
        if (isPureVegFilter && !match.item.isPureVeg) return false;
        return true;
      })
      .sort((a, b) => a.score - b.score) // Closest character strings jump to index position 0
      .map((match) => match.item);
    console.log(filteredAndSorted, "filteredAndSorted");
    setResults(filteredAndSorted);
  }, [debouncedQuery, isPureVegFilter]);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className={styles.rowLayout}>
        <div className={styles.searchWrapper}>
          <div className={styles.searchIcon}>🔎</div>
          <input
            type="text"
            placeholder="Search for biryani, idli, south Indian...."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              localStorage.setItem("current_query", e.target.value);
            }}
            className={styles.searchInput}
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                localStorage.setItem("current_query", "");
              }}
              className={styles.clearButton}
            >
              X
            </button>
          )}
        </div>

        <div
          className={styles.switchWrapper}
          onClick={() => {
            setIsPureVegFilter(!isPureVegFilter);
            localStorage.setItem("veg_filter_active", String(!isPureVegFilter));
          }}
        >
          <span className={styles.switchLabel}>Veg Only</span>
          <div
            className={`${styles.switchBg} ${isPureVegFilter ? styles.switchBgActive : styles.switchBgInactive}`}
          >
            <div
              className={`${styles.switchDot} ${isPureVegFilter ? styles.switchDotActive : ""}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

const CUISINES = restaurants.map((restaurant) => ({
  id: restaurant.id,
  name: restaurant.name,
  cuisine: restaurant.cuisine,
  rating: restaurant.rating,
  deliveryTime: restaurant.deliveryTime,
  costForTwo: restaurant.costForTwo,
  image: restaurant.image,
  isPureVeg: restaurant.isPureVeg,
  featuredDish: restaurant.featuredDish,
}));

const styles = {
  rowLayout: "flex items-center gap-3 w-full max-w-lg mx-auto",

  searchWrapper: "relative w-full max-w-md mx-auto",
  searchInput:
    "w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 pl-11 pr-10 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500",
  searchIcon: "absolute left-4 top-3.5 text-zinc-500 pointer-events-none",
  clearButton:
    "absolute right-4 top-3.5 text-zinc-500 hover:text-zinc-300 transition text-sm cursor-pointer",

  switchWrapper:
    "flex items-center gap-2 select-none cursor-pointer shrink-0 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-3",
  switchLabel: "text-xs font-semibold tracking-wide text-zinc-400 uppercase",
  switchBg:
    "w-9 h-5 rounded-full relative transition-colors duration-200 ease-in-out",
  switchBgInactive: "bg-zinc-700",
  switchBgActive: "bg-green-600",
  switchDot:
    "w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-200 ease-in-out shadow-md",
  switchDotActive: "transform translate-x-4",
};
