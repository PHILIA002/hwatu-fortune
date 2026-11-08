"use client";

import { useEffect, useState } from "react";

export default function useFortunes() {
  const [fortunes, setFortunes] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hwatu-fortunes");

      if (saved) {
        setFortunes(JSON.parse(saved));
      }
    } catch {
      setFortunes({});
    }

    setIsLoaded(true);
  }, []);

  const updateFortune = (cardId: string | number, value: string) => {
    setFortunes((prev) => {
      const next = {
        ...prev,
        [String(cardId)]: value,
      };

      localStorage.setItem("hwatu-fortunes", JSON.stringify(next));
      return next;
    });
  };

  return { fortunes, updateFortune, isLoaded };
}