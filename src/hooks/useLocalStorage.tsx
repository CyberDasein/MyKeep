import { useState, useEffect, useCallback } from "react";

type UseLocalStorage<T> = (key: string, initialValue: T) => [
  T,
  { setItem: (value: T) => void; removeItem: () => void }
];

export default function useLocalStorage<T>(key: string, initialValue: T): ReturnType<UseLocalStorage<T>> {
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error("Ошибка чтения из localStorage:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Ошибка записи в localStorage:", error);
    }
  }, [key, value]);

  const setItem = useCallback((newValue: T) => {
    setValue(newValue);
  }, []);

  const removeItem = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return [value, { setItem, removeItem }];
}
