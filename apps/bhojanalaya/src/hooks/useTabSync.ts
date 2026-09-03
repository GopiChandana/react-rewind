import { useEffect, useRef } from "react";

export const useTabSync = (
  storageKey: string,
  callback: (value: string) => void,
) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    const initialValue = localStorage.getItem(storageKey);
    if (initialValue !== null) {
      callbackRef.current(initialValue);
    }

    const handleTabChanges = (event: StorageEvent) => {
      if (event.key === storageKey) {
        const newValue = event.newValue ?? "";
        callbackRef.current(newValue);
      }
    };

    window.addEventListener("storage", handleTabChanges);
    return () => window.removeEventListener("storage", handleTabChanges);
  }, [storageKey]);
};
