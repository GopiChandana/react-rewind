// packages/bhojanalaya/src/components/BottomNav.js
import React from "react";

export default function BottomNav() {
  return (
    <nav className={styles.mobileWrapper}>
      <a href="#restaurants" className={styles.navItem}>
        <span className="text-xl">🍽️</span>
        <span>Feeds</span>
      </a>
      <a href="#history" className={styles.navItem}>
        <span className="text-xl">⏳</span>
        <span>Rewind</span>
      </a>
    </nav>
  );
}

const styles = {
  mobileWrapper:
    "md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-6 py-3 flex items-center justify-around z-50",
  navItem:
    "flex flex-col items-center gap-1 text-xs text-zinc-400 hover:text-orange-500",
};
