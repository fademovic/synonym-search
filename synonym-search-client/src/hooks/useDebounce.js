import { useState, useEffect } from "react";
import { DEFAULT_DEBOUNCE_TIME } from "utils/constants";

export const useDebounce = (value) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, DEFAULT_DEBOUNCE_TIME);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
};
