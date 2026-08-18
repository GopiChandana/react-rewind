import React, { useRef } from "react";


const App = () => {
  const inputRef = useRef(null);
  const handleSearchSubmit = () => {
    if (inputRef.current) {
      alert(`Searching for : {inputRef.current.value}`);
    }
  };
  return (
    <header className="sticky top-0 z-50 flex justify-between  items-center bg-pink-200 px-6 py-4 shadow-sm font-bold text-stone-50">
      <span className="text-8xl animate-spin [animation-duration:8s]">⌛️</span>
      <form onSubmit={handleSearchSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search 🧐"
          className="px-4 py-4 bg-white text-2xl text-pink-800 focus:border-pink-800 focus:outline-none focus:ring-4 focus:ring-pink-300 text-left placeholder:text-center rounded-xl"
        />
      </form>
      <span className="text-5xl">👩🏻‍🦰</span>
    </header>
  );
};

export default App;
