import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { CartProvider } from "./hooks/useCart";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import DishGrid from "./components/DishGrid";
import ShoppingCart from "./components/ShoppingCart";

const styles = {
  appWrapper:
    "h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 antialiased flex flex-col",

  layoutContainer: 
    "max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start w-full flex-1 min-h-0 px-4 md:px-8 py-4",

  mainComponent: (isMobileCartOpen) => 
    `w-full max-w-full flex flex-col h-full min-h-0 overflow-y-auto custom-scrollbar ${
      isMobileCartOpen ? "hidden lg:flex" : "flex"
    }`,
  
  sidebar: (isMobileCartOpen) => `
    ${isMobileCartOpen ? "flex flex-col" : "hidden"} 
    lg:flex lg:flex-col w-full lg:w-85 lg:shrink-0 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 h-full min-h-0
  `
};

function App() {
  const [results, setResults] = useState([]);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [successfulOrderPlaced, setSuccessfulOrderPlaced] = useState(false);
  const [minimumOrderPlaced, setMinimumOrderPlaced] = useState(false);
  const [successView, setSuccessView] = useState("receipt"); // "receipt" /"split"

  return (
    <CartProvider>
      <div className={styles.appWrapper}>
        <Header onCartClick={() => setIsMobileCartOpen(true)} />

        <div className={styles.layoutContainer}>
          <main className={styles.mainComponent(isMobileCartOpen)}>
            <SearchBar setResults={setResults} />
            <DishGrid results={results} successfulOrderPlaced={successfulOrderPlaced} />
          </main>

          <aside className={styles.sidebar(isMobileCartOpen)}>
            {!minimumOrderPlaced && successView !== "split" && (
              <button
                onClick={() => setIsMobileCartOpen(false)}
                className="lg:hidden mb-4 text-md text-zinc-500 hover:text-white self-start cursor-pointer"
              >
                ← Back to Restaurants
              </button>
            )}

            <h3 className="text-sm font-bold tracking-wider text-zinc-400 uppercase mb-4 text-center shrink-0">
              Your Cart
            </h3>

            <ShoppingCart
              onSuccessfulOrder={() => setIsMobileCartOpen(false)}
              onPlacingOrder={(val) => setSuccessfulOrderPlaced(val)}
              minimumOrderPlaced={(val) => setMinimumOrderPlaced(val)}
              successView={successView}
              setSuccessView={(val)=>setSuccessView(val)}
            />
          </aside>
        </div>
      </div>
    </CartProvider>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
