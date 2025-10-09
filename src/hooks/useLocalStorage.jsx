import { useEffect, useState } from "react";

export function useLocalStorage(storageKey, initialValue) {
  //Initialize state
  const [value, setValue] = useState(() => {
    try {
      //Get the saved value from localStorage
      const storedValue = localStorage.getItem(storageKey);
      //If something was saved before, convert it from JSON and use it
      if (storedValue !== null) {
        const parsedValue = JSON.parse(storedValue);
        return parsedValue;
      } else {
        //If nothing was saved before, start with the given initialValue
        return initialValue;
      }
    } catch (error) {
      //If an error was caught, just return the initialValue
      console.error("Error reading localStorage: ", error);
      return initialValue;
    }
  });

  //Save to localStorage whenever storageKey/value changes
  useEffect(() => {
    try {
      const stringifiedValue = JSON.stringify(value);
      localStorage.setItem(storageKey, stringifiedValue);
    } catch (error) {
      console.error("Error saving to localStorage: ", error);
    }
  }, [storageKey, value]); //dependency array (whenever one changes, useEffect re-runs)

  return [value, setValue];
}
