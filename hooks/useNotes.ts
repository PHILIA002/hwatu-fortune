"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "hwatu-notes";

const INITIAL_NOTES = ["", "", "", "", ""];

export function useNotes() {
  const [notes, setNotes] = useState<string[]>(INITIAL_NOTES);

  // 저장된 메모 불러오기
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setNotes(
            INITIAL_NOTES.map((_, index) =>
              typeof parsed[index] === "string" ? parsed[index] : ""
            )
          );
        }
      }
    } catch {
      setNotes(INITIAL_NOTES);
    }
  }, []);

  // 메모 수정 및 자동 저장
  const updateNote = (index: number, value: string) => {
    setNotes((prev) => {
      const updated = [...prev];
      updated[index] = value;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      return updated;
    });
  };

  return {
    notes,
    updateNote,
  };
}