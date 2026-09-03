import React, { lazy, Suspense, useState } from "react";
import { createRoot } from "react-dom/client";
import { CartProvider } from "./hooks/useCart";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import DishGrid from "./components/DishGrid";
import { Restaurant } from "./restaurantData";

const ShoppingCart = lazy(() => import("./components/ShoppingCart"));

const styles = {
  appWrapper:
    "h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 antialiased flex flex-col",

  layoutContainer:
    "max-w-7xl mx-auto flex flex-col md:flex-row gap-6 lg:gap-8 items-start w-full flex-1 min-h-0 px-4 md:px-8 py-4",

  mainComponent: (isMobileCartOpen: boolean) =>
    `w-full max-w-full flex flex-col h-full min-h-0 overflow-y-auto custom-scrollbar ${
      isMobileCartOpen ? "hidden lg:flex" : "flex"
    }`,

  sidebar: (isMobileCartOpen: boolean) => `
    ${isMobileCartOpen ? "flex flex-col w-full max-w-full sm:max-w-md min-h-[calc(100vh-100px)] overflow-y-auto" : "hidden"} 
    md:flex md:flex-col md:w-72 md:shrink-0 lg:w-85 md:h-[calc(100vh-120px)] bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 min-h-0 md:overflow-y-auto overflow-x-hidden
  `,
};

function App() {
  const [results, setResults] = useState<Restaurant[]>([]);

  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [successfulOrderPlaced, setSuccessfulOrderPlaced] = useState(false);
  const [minimumOrderPlaced, setMinimumOrderPlaced] = useState(false);

  const [successView, setSuccessView] = useState<"receipt" | "split">(
    "receipt",
  );

  return (
    <CartProvider>
      <div className={styles.appWrapper}>
        <Header onCartClick={() => setIsMobileCartOpen(true)} />

        <div className={styles.layoutContainer}>
          <main className={styles.mainComponent(isMobileCartOpen)}>
            <SearchBar setResults={setResults} />
            <DishGrid
              results={results}
              successfulOrderPlaced={successfulOrderPlaced}
            />
          </main>

          <aside className={styles.sidebar(isMobileCartOpen)}>
            {!minimumOrderPlaced && successView !== "split" && (
              <button
                onClick={() => setIsMobileCartOpen(false)}
                className="md:hidden mb-4 text-sm font-medium text-zinc-400 hover:text-white flex items-center gap-1.5 whitespace-nowrap self-start cursor-pointer"
              >
                <span className="inline-block text-[9px] leading-none">◀</span>{" "}
                Back to Restaurants
              </button>
            )}

            {/* <h1 className="text-sm font-bold tracking-wider text-zinc-400 uppercase mb-4 text-center shrink-0">
              Your Cart
            </h1>  */}
            <Suspense
              fallback={
                <div className="text-zinc-500 text-xs p-4 text-center">
                  Loading Cart...
                </div>
              }
            >
              <ShoppingCart
                onSuccessfulOrder={() => setIsMobileCartOpen(false)}
                onPlacingOrder={(val: boolean) => setSuccessfulOrderPlaced(val)}
                minimumOrderPlaced={(val: boolean) =>
                  setMinimumOrderPlaced(val)
                }
                successView={successView}
                setSuccessView={setSuccessView}
              />
            </Suspense>
          </aside>
        </div>
      </div>
    </CartProvider>
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);
root.render(<App />);
