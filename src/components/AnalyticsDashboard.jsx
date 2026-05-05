import { useEffect, useState } from "react";

export default function AnalyticsDashboard({ sessionHistory, questionsMap }) {
  const [avgTime, setAvgTime] = useState(0);
  const [predicted, setPredicted] = useState(0);
  const [weakTopics, setWeakTopics] = useState([]);

  useEffect(() => {
    if (!sessionHistory.length) return;
    let totalTime = 0, totalQs = 0;
    let totalCorrect = 0, totalAttempted = 0;
    const topicStats = {};

    sessionHistory.forEach(session => {
      const qs = questionsMap[session.subjectId] || [];
      Object.entries(session.answers || {}).forEach(([idxStr, selected]) => {
        const idx = parseInt(idxStr);
        const q = qs[idx];
        if (!q) return;
        totalAttempted++;
        if (selected === q.correct) totalCorrect++;
        if (q.topic) {
          if (!topicStats[q.topic]) topicStats[q.topic] = { correct: 0, total: 0 };
          topicStats[q.topic].total++;
          if (selected === q.correct) topicStats[q.topic].correct++;
        }
      });
      if (session.timestamps) {
        Object.values(session.timestamps).forEach(ts => { totalTime += ts; totalQs++; });
      }
    });
    setAvgTime(totalQs ? Math.round(totalTime / totalQs) : 0);
    setPredicted(totalAttempted ? Math.round((totalCorrect / totalAttempted) * 400) : 0);
    const weak = Object.entries(topicStats)
      .map(([topic, st]) => ({ topic, pct: (st.correct / st.total) * 100 }))
      .filter(t => t.pct < 50)
      .sort((a,b) => a.pct - b.pct);
    setWeakTopics(weak.slice(0,5));
  }, [sessionHistory, questionsMap]);

  return (
    <div className="analytics-dashboard">
      <h3>📊 Analytics</h3>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Avg time/question</div><div className="stat-value">{avgTime} sec</div></div>
        <div className="stat-card"><div className="stat-label">Predicted JAMB score</div><div className="stat-value">{predicted}/400</div></div>
      </div>
      {weakTopics.length > 0 && (
        <div><div className="stat-label">⚠️ Weak topics (&lt;50%)</div><ul>{weakTopics.map(t => <li key={t.topic}>{t.topic} – {Math.round(t.pct)}%</li>)}</ul></div>
      )}
    </div>
  );
}