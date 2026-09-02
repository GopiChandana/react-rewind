import { useEffect } from "react";

export const useDebounce = <T>(
  value: T,
  callback: (value: T) => void,
  delay: number = 300,
) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      callback(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, callback, delay]);
};
