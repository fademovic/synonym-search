import React from "react";
import { DEFAULT_DEBOUNCE_TIME } from "utils/constants";

export const useDebounce = (value) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, DEFAULT_DEBOUNCE_TIME);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
};
