import React from "react";
import { useCart } from "../hooks/useCart";

const Header = () => {
  const {totalItems} = useCart()
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.brandLogo}>
        BHOJANALAYA<span className="text-zinc-100 text-3xl px-1">🍛</span>
      </div>
      <nav className={styles.navMenu}>
        <a href="#restaurants" className={styles.activeLink}>
          Restaurants
        </a>
        <a href="#history" className={styles.activeLink}>
          Rewind History
        </a>
      </nav>
      <button className={styles.cartCounter}>
        <span>🛒</span> Cart{" "}
        <span className="text-zinc-100 font-extrabold">({`${totalItems}`})</span>
      </button>
    </div>
  );
};

export default Header;

const styles = {
  headerWrapper:
    "w-full px-6 py-4 sticky top-0 z-50 flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md",
  brandLogo: "text-2xl tracking-tight text-orange-500 cursor-pointer",
  navMenu:
    "hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400",
  activeLink: "text-zinc-100 transition hover:text-orange-500",
  cartCounter:
    "flex items-center gap-2 rounded-xl bg-orange-500/10 px-4 py-2 border border-orange-500/20 text-orange-400 font-semibold text-sm transition hover:bg-orange-500/20",
};
