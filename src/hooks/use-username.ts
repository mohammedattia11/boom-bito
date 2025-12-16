import { useEffect, useState } from "react";
import {nanoid} from "nanoid"

const generateUsername = () => {
  return `anonymous-${nanoid(12)}`;
};

const STORAGE_KEY = "chat_username";

export function useUsername() {
  const [username, setUsername] = useState("anonymous");

  useEffect(() => {
      const main = () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setUsername(stored);
          return;
        }
        const generated = generateUsername();
        localStorage.setItem(STORAGE_KEY, generated);
        setUsername(generated);
      };
      main();
    }, []);
  return username
}