import { useCart } from "../hooks/useCart";

interface HeaderProps {
  onCartClick: () => void;
}

const Header = ({ onCartClick }: HeaderProps) => {
  const { totalItems }: { totalItems: number } = useCart();
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.brandLogo}>
        <span className="font-black tracking-widest uppercase">
          <span className="text-zinc-300">GOPI'S</span> BHOJANALAYA
        </span>
        <span className="text-xl sm:text-2xl pl-1 pb-1 shrink-0">🍛</span>
      </div>

      <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800/80 rounded-full select-none shadow-lg shadow-black/40 self-center">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-pulse" />
        <span className="text-[9px] tracking-[0.24em] font-sans font-black text-zinc-300 uppercase">
          BHOJAN LIVE KITCHENS
        </span>
      </div>

      <button className={styles.cartCounter} onClick={onCartClick}>
        <span>🛒</span>
        <span className="hidden sm:inline">Cart</span>
        <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-md font-mono font-black ml-0.5 text-[10px] sm:text-xs">
          {totalItems}
        </span>
      </button>
    </div>
  );
};

export default Header;

const styles = {
  headerWrapper:
    "w-full px-3 py-2.5 sm:px-6 sm:py-4 sticky top-0 z-50 flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md",

  brandLogo:
    "text-sm sm:text-lg tracking-wider text-orange-500 font-black cursor-pointer flex items-center shrink-0",

  navMenu:
    "hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400",
  activeLink: "text-zinc-100 transition hover:text-orange-500 text-lg",

  cartCounter:
    "flex items-center gap-1 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-zinc-900 border border-zinc-800/60 text-zinc-300 hover:text-white font-bold text-[10px] sm:text-xs transition cursor-pointer lg:cursor-default lg:pointer-events-none shrink-0 shadow-sm shadow-black/10",
};
