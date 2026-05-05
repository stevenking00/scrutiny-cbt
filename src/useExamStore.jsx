import { useState, useEffect, useCallback } from "react";

export function useExamStore() {
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem("scrutiny_answers");
    return saved ? JSON.parse(saved) : {};
  });
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem("scrutiny_bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("scrutiny_answers", JSON.stringify(answers));
  }, [answers]);
  useEffect(() => {
    localStorage.setItem("scrutiny_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const saveAnswer = useCallback((subjectId, qIndex, selected) => {
    const key = `${subjectId}_${qIndex}`;
    setAnswers(prev => ({ ...prev, [key]: selected }));
  }, []);

  const getAnswer = useCallback((subjectId, qIndex) => {
    const key = `${subjectId}_${qIndex}`;
    return answers[key];
  }, [answers]);

  const toggleBookmark = useCallback((subjectId, qIndex) => {
    const id = `${subjectId}_${qIndex}`;
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  }, []);

  const isBookmarked = useCallback((subjectId, qIndex) => {
    return bookmarks.includes(`${subjectId}_${qIndex}`);
  }, [bookmarks]);

  const clearAll = useCallback(() => {
    setAnswers({});
    setBookmarks([]);
    localStorage.clear();
  }, []);

  return { answers, saveAnswer, getAnswer, bookmarks, toggleBookmark, isBookmarked, clearAll };
}