import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { CartProvider } from "./hooks/useCart";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import SearchBar from "./components/SearchBar";
import DishGrid from "./components/DishGrid";
import ShoppingCart from "./components/ShoppingCart";

const styles = {
  appWrapper:
    "min-h-screen w-full max-w-full overflow-x-hidden bg-zinc-950 text-zinc-100 antialiased",
};

function App() {
  const [results, setResults] = useState([]);
  return (
     <CartProvider>
      <div className={styles.appWrapper}>
        <Header />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start w-full">
          <main className="p-4 md:p-8 w-full max-w-full flex flex-col">
            <SearchBar setResults={setResults} />
            <DishGrid results={results} />
          </main>
          <aside className="w-full lg:w-80 lg:shrink-0 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 sticky top-24 shadow-2xl backdrop-blur-md">
            <h3 className="text-sm font-bold tracking-wider text-zinc-400 uppercase mb-4 text-center">
              Your Cart
            </h3>
            <ShoppingCart />
          </aside>
        </div>
        <BottomNav />
      </div>
    </CartProvider>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
