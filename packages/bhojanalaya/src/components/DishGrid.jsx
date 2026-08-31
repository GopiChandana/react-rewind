import React from "react";
import DishCard from "./DishCard";

const DishGrid = ({ results,successfulOrderPlaced }) => {
  console.log(results,"dishGrid")
  return (
    <div>
      {results?.length > 0 ? (
        <div className={styles.scrollView}>
          <div className={styles.gridContainer}>
            {results.map((item) => (
              <DishCard dish={item} key={item.id} successfulOrderPlaced = {successfulOrderPlaced}/>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p className="text-xl font-semibold">🍲 No Restaurants Found</p>
          <p className="text-xs text-zinc-600">
            Try cleaning your search input queries
          </p>
        </div>
      )}
    </div>
  );
};

export default DishGrid;

const styles = {
  scrollView:
    "w-full h-[calc(100vh-180px)] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700",
  gridContainer: "grid grid-cols-1 lg:grid-cols-2 gap-5 p-4 w-full",
  emptyState:
    "px-4 py-16 text-center text-zinc-500 flex flex-col gap-2 items-center justify-center",
};
