import { useState, useEffect } from "react";
import { useExamStore } from "./stores/useExamStore";
import SubjectSession from "./components/SubjectSession";
import Calculator from "./components/Calculator";
import AnalyticsDashboard from "./components/AnalyticsDashboard";

const SUBJECTS = [
  { id: "english", name: "Use of English", icon: "📝", compulsory: true },
  { id: "mathematics", name: "Mathematics", icon: "📐" },
  { id: "biology", name: "Biology", icon: "🧬" },
  { id: "physics", name: "Physics", icon: "⚛️" },
  { id: "chemistry", name: "Chemistry", icon: "🧪" },
];

const MOCK_QS = {
  english: Array(15).fill().map((_, i) => ({ text: `English Q${i+1}`, options: ["A","B","C","D"], correct: 0, explanation: "Mock" })),
  mathematics: Array(15).fill().map((_, i) => ({ text: `Math Q${i+1}`, options: ["A","B","C","D"], correct: 0 })),
  biology: [],
  physics: [],
  chemistry: [],
};

export default function ExamShell() {
  const [screen, setScreen] = useState("home");
  const [mode, setMode] = useState("exam");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [currentSubIndex, setCurrentSubIndex] = useState(0);
  const [subjectAnswers, setSubjectAnswers] = useState({});
  const [examTimeLeft, setExamTimeLeft] = useState(120 * 60);
  const [results, setResults] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [sessionHistory, setSessionHistory] = useState(() => {
    const saved = localStorage.getItem("scrutiny_session_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [questionsMap, setQuestionsMap] = useState({});
  const { saveAnswer: globalSave, toggleBookmark, isBookmarked, clearAll } = useExamStore();

  useEffect(() => {
    async function load() {
      const map = {};
      for (const sub of SUBJECTS) {
        try {
          const res = await fetch(`/questions/${sub.id}.json`);
          if (res.ok) map[sub.id] = await res.json();
          else map[sub.id] = MOCK_QS[sub.id] || [];
        } catch {
          map[sub.id] = MOCK_QS[sub.id] || [];
        }
      }
      setQuestionsMap(map);
    }
    load();
  }, []);

  useEffect(() => {
    if (screen !== "exam" || mode !== "exam") return;
    if (examTimeLeft <= 0) {
      finishSubject();
      return;
    }
    const timer = setInterval(() => setExamTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [screen, mode, examTimeLeft]);

  const toggleSubject = (subId) => {
    if (subId === "english" && !selectedSubjects.find((s) => s.id === "english")) {
      setSelectedSubjects([{ id: "english", name: "Use of English" }, ...selectedSubjects]);
    } else if (subId !== "english") {
      if (selectedSubjects.find((s) => s.id === subId)) {
        setSelectedSubjects((prev) => prev.filter((s) => s.id !== subId));
      } else if (selectedSubjects.length < 4) {
        const sub = SUBJECTS.find((s) => s.id === subId);
        setSelectedSubjects((prev) => [...prev, sub]);
      }
    }
  };

  const startExam = () => {
    setScreen("exam");
    setCurrentSubIndex(0);
    setSubjectAnswers({});
    setExamTimeLeft(mode === "exam" ? 120 * 60 : 0);
    setResults(null);
  };

  const finishSubject = () => {
    const currentSub = selectedSubjects[currentSubIndex];
    const qs = questionsMap[currentSub.id] || [];
    const answersForSub = subjectAnswers[currentSub.id] || {};
    const newSession = { subjectId: currentSub.id, answers: answersForSub, timestamp: Date.now() };
    setSessionHistory((prev) => {
      const updated = [...prev, newSession];
      localStorage.setItem("scrutiny_session_history", JSON.stringify(updated));
      return updated;
    });
    if (currentSubIndex + 1 < selectedSubjects.length) {
      setCurrentSubIndex((i) => i + 1);
    } else {
      const totalScore = selectedSubjects.reduce((sum, sub) => {
        const qs2 = questionsMap[sub.id] || [];
        const ans2 = subjectAnswers[sub.id] || {};
        let s = 0;
        qs2.forEach((q, i) => {
          if (ans2[i] === q.correct) s++;
        });
        return sum + s;
      }, 0);
      const totalPossible = selectedSubjects.reduce((sum, sub) => sum + (questionsMap[sub.id]?.length || 0), 0);
      setResults({
        totalScore,
        totalPossible,
        subjectResults: selectedSubjects.map((sub) => {
          const qs2 = questionsMap[sub.id] || [];
          const ans2 = subjectAnswers[sub.id] || {};
          let s = 0;
          qs2.forEach((q, i) => {
            if (ans2[i] === q.correct) s++;
          });
          return { name: sub.name, score: s, total: qs2.length };
        }),
      });
      setScreen("results");
    }
  };

  const handleSaveAnswer = (subId, qIdx, ans) => {
    setSubjectAnswers((prev) => ({
      ...prev,
      [subId]: { ...(prev[subId] || {}), [qIdx]: ans },
    }));
    globalSave(subId, qIdx, ans);
  };

  if (screen === "home") {
    const canStart = selectedSubjects.length === 4;
    return (
      <div className="app">
        <div className="header">
          <div className="logo">
            SCRUTINY<span>CBT</span>
          </div>
        </div>
        <div className="home">
          <h1>JAMB CBT Simulator</h1>
          <div className="mode-toggle">
            <button className={mode === "exam" ? "active" : ""} onClick={() => setMode("exam")}>
              Exam Mode (timed)
            </button>
            <button className={mode === "study" ? "active" : ""} onClick={() => setMode("study")}>
              Study Mode (untimed)
            </button>
          </div>
          <div className="subject-grid">
            {SUBJECTS.map((sub) => (
              <div
                key={sub.id}
                className={`subject-card ${selectedSubjects.some((s) => s.id === sub.id) ? "selected" : ""} ${sub.compulsory ? "compulsory" : ""}`}
                onClick={() => toggleSubject(sub.id)}
              >
                <span>{sub.icon}</span> <span>{sub.name}</span>
                {sub.compulsory && <span className="badge">Compulsory</span>}
              </div>
            ))}
          </div>
          <button className="start-btn" disabled={!canStart} onClick={startExam}>
            Start {mode === "exam" ? "Exam" : "Study"}
          </button>
        </div>
      </div>
    );
  }

  if (screen === "exam") {
    const currentSub = selectedSubjects[currentSubIndex];
    const questions = questionsMap[currentSub.id] || [];
    const answersForSub = subjectAnswers[currentSub.id] || {};
    return (
      <div className="app">
        <div className="header">
          <div className="logo">
            SCRUTINY<span>CBT</span>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {mode === "exam" && (
              <div className="timer">
                ⏱️ {Math.floor(examTimeLeft / 60)}:{(examTimeLeft % 60).toString().padStart(2, "0")}
              </div>
            )}
            <button className="calc-btn" onClick={() => setShowCalculator(true)}>
              🧮
            </button>
          </div>
        </div>
        <SubjectSession
          subject={currentSub}
          questions={questions}
          answers={answersForSub}
          onSaveAnswer={(qIdx, ans) => handleSaveAnswer(currentSub.id, qIdx, ans)}
          onToggleBookmark={(qIdx) => toggleBookmark(currentSub.id, qIdx)}
          isBookmarked={(qIdx) => isBookmarked(currentSub.id, qIdx)}
          mode={mode}
          onFinish={finishSubject}
        />
        {showCalculator && <Calculator onClose={() => setShowCalculator(false)} />}
      </div>
    );
  }

  if (screen === "results" && results) {
    const percent = Math.round((results.totalScore / results.totalPossible) * 100);
    const grade = percent >= 70 ? "Excellent" : percent >= 50 ? "Average" : "Needs Work";
    return (
      <div className="app">
        <div className="header">
          <div className="logo">
            SCRUTINY<span>CBT</span>
          </div>
        </div>
        <div className="results-screen">
          <h2>Session Complete</h2>
          <div className="score-circle">
            <div className="big-score">{results.totalScore}</div>
            <div>/ {results.totalPossible}</div>
            <div style={{ fontSize: "0.9rem" }}>
              {percent}% – {grade}
            </div>
          </div>
          <div className="subject-breakdown">
            {results.subjectResults.map((r) => (
              <div key={r.name} className="subject-row">
                <span>{r.name}</span>
                <span>
                  {r.score}/{r.total}
                </span>
              </div>
            ))}
          </div>
          <AnalyticsDashboard sessionHistory={sessionHistory} questionsMap={questionsMap} />
          <div className="action-buttons">
            <button
              onClick={() => {
                clearAll();
                setScreen("home");
                setSelectedSubjects([]);
                setSubjectAnswers({});
                setExamTimeLeft(120 * 60);
                setSessionHistory([]);
                localStorage.removeItem("scrutiny_session_history");
              }}
            >
              New Session
            </button>
            <button onClick={() => window.location.reload()}>Close</button>
          </div>
        </div>
      </div>
    );
  }
  return null;
}