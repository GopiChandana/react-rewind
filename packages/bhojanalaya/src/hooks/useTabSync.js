import { useEffect, useRef } from "react";

export const useTabSync = (storageKey, callback) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    const initialValue = localStorage.getItem(storageKey);
    if (initialValue !== null) {
      callbackRef.current(initialValue);
    }

    const handleTabChanges = (event) => {
      if (event.key === storageKey) {
        const newValue = event.newValue ?? "";
        callbackRef.current(newValue);
      }
    };

    window.addEventListener("storage", handleTabChanges);
    return () => window.removeEventListener("storage", handleTabChanges);
  }, [storageKey]);
};
