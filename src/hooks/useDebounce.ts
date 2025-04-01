import { useState, useEffect } from "react";

/**
 * Хук для реализации debounce.
 * @param value Значение, которое нужно дебаунсить.
 * @param delay Задержка в миллисекундах.
 * @returns значение.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler); // Очищаем таймер при каждом изменении
  }, [value, delay]);

  return debouncedValue;
}
