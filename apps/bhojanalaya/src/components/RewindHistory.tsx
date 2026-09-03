import { useEffect, useRef, useState } from "react";
import { useCart } from "../hooks/useCart";

interface RewindHistoryProps {
  isCartEmpty?: boolean;
  setCheckoutStatus?: (status: string) => void;
  onPlacingOrder?: (value: boolean) => void;
}

export default function RewindHistory({
  isCartEmpty,
  setCheckoutStatus,
  onPlacingOrder,
}: RewindHistoryProps) {
  const {
    timeline,
    currentIndex,
    auditStream,
    rewindStep,
    fastForwardStep,
    jumpToTimelineIndex,
    isTimelinePending,
    canRewind,
    canFastForward,
    resetSession,
  } = useCart();

  const [activeTab, setActiveTab] = useState("timeline");
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [timeline.length, auditStream.length, activeTab]);

  return (
    <div className={styles.rewindContainer}>
      <div className={styles.rewindFunctionHeader}>
        <div className={styles.tabContainer}>
          {/* {!isCartEmpty && (
            <> */}
            <button
              onClick={() => setActiveTab("timeline")}
              className={styles.tabButton(activeTab === "timeline")}
            >
              ⏳ Timeline {isTimelinePending && "..."}
            </button>
         
          <div className="pb-1 text-zinc-300">|</div> 
          {/* </>)} */}
          <button
            onClick={() => setActiveTab("audit")}
            className={styles.tabButton(activeTab === "audit")}
          >
            📜 Food Ledger
          </button>
        </div>

        <div className={styles.actionRow}>
          <button
            onClick={() => resetSession(setCheckoutStatus, onPlacingOrder)}
            title="Reset Session Data"
            className={styles.resetButton}
          >
            🔄 Reset Session
          </button>{" "}
          {/* {!isCartEmpty && ( */}
            <div className={styles.rewindButtonControlGroup}>
              <button
                onClick={rewindStep}
                disabled={!canRewind}
                className={styles.rewindButtonControlButton(canRewind)}
              >
                ⏮ Undo
              </button>
              <button
                onClick={fastForwardStep}
                disabled={!canFastForward}
                className={styles.rewindButtonControlButton(canFastForward)}
              >
                Redo ⏭
              </button>
            </div>
          {/* )} */}
        </div>
      </div>

      <div ref={scrollContainerRef} className={styles.scrollWrapper}>
        {activeTab === "timeline" &&
          timeline.map((snapshot, index) => {
            const isActive = index === currentIndex;
            const isPast = index < currentIndex;

            return (
              <button
                key={index}
                onClick={() => jumpToTimelineIndex(index)}
                className={styles.timelineItem(isActive, isPast)}
              >
                <div className={styles.timelineDotContainer}>
                  <span className={styles.timelineDot(isActive, isPast)} />
                  <span className={styles.timelineText}>
                    {snapshot.actionLabel}
                  </span>
                </div>
                <span className={styles.timeline}>
                  {isActive
                    ? "Present"
                    : `Qty: ${snapshot.cart.reduce((s, i) => s + i.quantity, 0)}`}
                </span>
              </button>
            );
          })}

        {activeTab === "audit" &&
          auditStream.map((log, index) => (
            <div key={index} className={styles.auditItem}>
              <span className={styles.auditPin} />
              <div className={styles.auditDetails}>
                <span className={styles.auditTime}>{log.timestamp}</span>
                <span className={styles.auditId}>
                  #{(index + 1).toString().padStart(3, "0")}
                </span>
              </div>
              <p className={styles.auditText}>{log.text}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

const styles = {
  rewindContainer:
    "bg-zinc-900/60 border border-zinc-800/80 rounded-2xl lg:p-4 lg:mb-5 p-2 mb-2 text-xs w-full",
  rewindFunctionHeader:
    "flex flex-col gap-2.5 pb-1 lg:pb-3  border-b border-zinc-800/60 mb-1 lg:mb-3 w-full items-center",
  tabContainer:
    "flex items-center justify-center gap-4 w-full border-b border-zinc-800/20 pb-1",

  tabButton: (isActive: boolean) =>
    `font-bold tracking-wider uppercase text-[10px] pb-1 cursor-pointer transition relative ${
      isActive
        ? "text-orange-400 border-b border-orange-500"
        : "text-zinc-500 hover:text-zinc-400"
    }`,

  actionRow:
    "flex items-center justify-between w-full pt-1 px-1 lg:min-h-6 lg:px-0 gap-3",
  resetButton:
    "text-[10px] text-zinc-500 hover:text-red-400 font-bold tracking-wide transition cursor-pointer bg-zinc-950/40 border border-zinc-800/60  rounded-md px-2 py-0.5 hover:bg-zinc-800/40 shrink-0",

  rewindButtonControlGroup:
    "flex items-center shrink-0 lg:gap-3 text-[10px] font-bold text-zinc-500 select-none",
  rewindButtonControlButton: (isEnabled: boolean) =>
    `px-2 py-0.5 rounded-md text-[10px] font-medium transition duration-150 border  ${
      isEnabled
        ? "bg-zinc-800 text-orange-400  border-zinc-700/60   hover:bg-zinc-700 cursor-pointer"
        : "bg-zinc-900/20 text-zinc-600  border-zinc-800/40   cursor-not-allowed"
    }`,

  scrollWrapper:
    "max-h-25 overflow-y-auto pr-1 flex flex-col gap-2 relative border-l border-zinc-800 pl-3 ml-1.5 custom-scrollbar",

  timelineItem: (isActive: boolean, isPast: boolean) =>
    `text-left group flex items-center justify-between py-1 transition cursor-pointer w-full rounded-lg px-2 -ml-2 ${
      isActive
        ? "bg-orange-500/10 text-orange-400 font-semibold"
        : isPast
          ? "text-zinc-300 hover:bg-zinc-800/50"
          : "text-zinc-600 hover:bg-zinc-800/20"
    }`,
  timelineDotContainer: "flex items-center gap-2",
  timelineDot: (isActive: boolean, isPast: boolean) =>
    `w-1.5 h-1.5 rounded-full absolute left-[5.5px] transition duration-200 ${
      isActive
        ? "bg-orange-500 ring-4 ring-orange-500/20 scale-125"
        : isPast
          ? "bg-zinc-500"
          : "bg-zinc-800"
    }`,
  timelineText: "truncate max-w-[130px] ml-1.5",
  timeline: "text-[9px] text-zinc-500 group-hover:text-zinc-400 shrink-0",

  auditItem:
    "flex flex-col gap-0.5 text-left py-0.5 text-[11px] text-zinc-400 relative",
  auditPin: "w-1 h-1 rounded-full bg-zinc-700 absolute left-[-14px] top-2",
  auditDetails: "flex items-center justify-between gap-2",
  auditTime: "text-zinc-500 text-[9px] font-mono shrink-0",
  auditId: "truncate text-zinc-300 w-full text-right font-mono text-[9px]",
  auditText:
    "text-zinc-400 break-words leading-relaxed pl-1 bg-zinc-900/20 rounded p-1 border border-zinc-800/30 font-mono text-[10px]",
};
