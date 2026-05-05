import { useState } from "react";
import QuestionCard from "./QuestionCard";

export default function SubjectSession({ subject, questions, answers, onSaveAnswer, onToggleBookmark, isBookmarked, mode, onFinish }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentQ = questions[currentIdx];
  const selected = answers[currentIdx];

  return (
    <div className="subject-session">
      <div className="session-header">
        <h2>{subject.name}</h2>
        <span>{Object.keys(answers).length}/{questions.length} answered</span>
      </div>
      <div style={{ flex: 1 }}>
        <QuestionCard
          question={currentQ}
          subjectId={subject.id}
          qIndex={currentIdx}
          selected={selected}
          onSelect={(ans) => onSaveAnswer(currentIdx, ans)}
          mode={mode}
          isBookmarked={isBookmarked(currentIdx)}
          onToggleBookmark={() => onToggleBookmark(currentIdx)}
        />
      </div>
      <div className="session-footer">
        <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(i => i-1)}>← Prev</button>
        <span>{currentIdx+1}/{questions.length}</span>
        {currentIdx+1 < questions.length ? (
          <button onClick={() => setCurrentIdx(i => i+1)}>Next →</button>
        ) : (
          <button onClick={onFinish}>Finish Subject</button>
        )}
      </div>
    </div>
  );
}