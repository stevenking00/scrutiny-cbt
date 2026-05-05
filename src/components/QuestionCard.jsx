import { useState } from "react";

export default function QuestionCard({ question, subjectId, qIndex, selected, onSelect, mode, isBookmarked, onToggleBookmark }) {
  const [reveal, setReveal] = useState(false);

  const handleSelect = (idx) => {
    onSelect(idx);
    if (mode === "study") setReveal(true);
  };

  const isCorrect = reveal && selected === question.correct;

  return (
    <div className="question-card">
      <div className="question-header">
        <span>Q{qIndex + 1}</span>
        <button className={`bookmark-btn ${isBookmarked ? "active" : ""}`} onClick={onToggleBookmark}>
          {isBookmarked ? "★" : "☆"}
        </button>
      </div>
      <div className="question-text">{question.text}</div>
      <div className="options">
        {question.options.map((opt, i) => (
          <button key={i} className={`option ${selected === i ? "selected" : ""}`} onClick={() => handleSelect(i)} disabled={reveal && mode === "study"}>
            <span>{String.fromCharCode(65 + i)}.</span>
            <span>{opt}</span>
          </button>
        ))}
      </div>
      {mode === "study" && reveal && (
        <div className="explanation">
          <strong>{isCorrect ? "✓ Correct" : "✗ Incorrect"}</strong>
          <p>{question.explanation || "No explanation."}</p>
        </div>
      )}
      {mode === "study" && selected !== undefined && !reveal && (
        <button className="reveal-btn" onClick={() => setReveal(true)}>Reveal explanation</button>
      )}
    </div>
  );
}