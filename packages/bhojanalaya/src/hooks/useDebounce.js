import { useEffect, useState } from "react";

export const useDebounce = (value, callback, delay = 300) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      callback(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, callback, delay]);
};
