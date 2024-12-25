import { useCallback, useRef } from 'react';

export function useDebounce<TArgs extends unknown[], TReturn>(
  callback: (...args: TArgs) => Promise<TReturn> | TReturn,
  delay: number
): (...args: TArgs) => void {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: TArgs) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
} 