import { useEffect, useState } from "react";
import api from "../services/api";

export default function Quiz() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [view, setView] = useState("subjects"); // subjects | scores
  const [scores, setScores] = useState([]);
  const [departmentName, setDepartmentName] = useState("");

  const userDept = localStorage.getItem("userDepartment") || "CS";

  const DEPT_NAMES = {
    CS: "Computer Science",
    IT: "Information Technology",
    DS: "Data Science",
    MACS: "Maths & Computational Sciences",
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.quiz.getSubjects(userDept);
      if (response.subjects) {
        setSubjects(response.subjects);
        setDepartmentName(response.departmentName || DEPT_NAMES[userDept] || "");
      } else {
        setError("No subjects available");
      }
    } catch (err) {
      console.error("Subjects fetch error:", err);
      setError("Failed to load subjects");
    }
    setLoading(false);
  };

  const fetchScores = async () => {
    try {
      const data = await api.quiz.getScores();
      setScores(Array.isArray(data) ? data : []);
    } catch {
      setScores([]);
    }
  };

  const handleSubjectSelect = async (subject) => {
    setSelectedSubject(subject);
    setLoading(true);
    setError("");
    try {
      const response = await api.quiz.getQuiz(subject, userDept);
      if (response.questions && response.questions.length > 0) {
        setQuestions(response.questions);
        setAnswers(new Array(response.questions.length).fill(null));
      } else {
        setError("No questions available for this subject");
      }
    } catch (err) {
      console.error("Quiz fetch error:", err);
      setError("Failed to load quiz");
    }
    setLoading(false);
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await api.quiz.submit({
        subject: selectedSubject,
        answers,
        questions,
      });
      setScore(response.score);
      setShowResult(true);
    } catch (err) {
      setError("Failed to submit quiz");
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(questions.length).fill(null));
    setShowResult(false);
    setScore(0);
    setQuizStarted(false);
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setQuestions([]);
    setQuizStarted(false);
    setShowResult(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setView("subjects");
  };

  if (loading) return <div className="fade-in" style={{ padding: "2rem", color: "var(--neo-text-sec)", textAlign: "center" }}>Loading...</div>;

  if (error && !selectedSubject) {
    return (
      <div className="fade-in" style={{ padding: "2rem", display: "flex", justifyContent: "center" }}>
        <div className="neo-container" style={{ padding: "2rem", textAlign: "center", maxWidth: "400px" }}>
          <div style={{ color: "var(--neo-danger)", marginBottom: "1rem" }}>{error}</div>
          <button className="neo-button neo-button-primary" onClick={fetchSubjects}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // My Scores View
  if (view === "scores") {
    return (
      <div className="fade-in" style={{ padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 className="neo-title" style={{ fontSize: "2rem" }}>📊 My Quiz Scores</h1>
          <button
            onClick={() => setView("subjects")}
            className="neo-button"
          >
            ← Back to Subjects
          </button>
        </div>

        <div className="neo-table-container">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                {["Subject", "Score", "Percentage", "Date"].map((h) => (
                  <th key={h} style={{ color: "var(--neo-text-sec)", padding: "1rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scores.map((s, idx) => {
                const pct = s.totalQuestions > 0 ? Math.round((s.score / s.totalQuestions) * 100) : 0;
                let pctColor = "var(--neo-success)";
                if (pct < 50) pctColor = "var(--neo-danger)";
                else if (pct < 70) pctColor = "var(--neo-warning)";
                
                return (
                  <tr key={idx}>
                    <td style={{ padding: "1rem", color: "var(--neo-text)", fontWeight: "600" }}>{s.subject}</td>
                    <td style={{ padding: "1rem", color: "var(--neo-text)" }}>{s.score}/{s.totalQuestions}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ color: pctColor, fontWeight: "700", fontSize: "1rem" }}>
                        {pct}%
                      </span>
                      <span style={{ marginLeft: "0.5rem", fontSize: "0.78rem", color: pctColor }}>
                        {pct >= 70 ? "✅ Pass" : pct >= 50 ? "⚠️ Average" : "❌ Needs work"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", color: "var(--neo-text-sec)", fontSize: "0.85rem" }}>
                      {s.completedAt ? new Date(s.completedAt).toLocaleDateString("en-IN") : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {scores.length === 0 && (
            <p style={{ color: "var(--neo-text-sec)", textAlign: "center", padding: "2rem" }}>
              No quiz scores yet. Take a quiz to see your results here!
            </p>
          )}
        </div>
      </div>
    );
  }

  // Subject Selection Screen - Grouped by Semester
  if (!selectedSubject) {
    const subjectsBySemester = subjects.reduce((acc, item) => {
      const sem = item.semester || 1;
      if (!acc[sem]) acc[sem] = [];
      acc[sem].push(item);
      return acc;
    }, {});

    return (
      <div className="fade-in" style={{ padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 className="neo-title" style={{ fontSize: "2rem", margin: 0 }}>📝 Select Subject</h1>
            {departmentName && <p style={{ color: "var(--neo-cyan)", margin: "0.3rem 0 0", fontSize: "0.95rem", fontWeight: "500" }}>M.Sc. {departmentName}</p>}
          </div>
          <button onClick={() => { setView("scores"); fetchScores(); }} className="neo-button neo-button-primary">
            📊 My Scores
          </button>
        </div>

        {Object.keys(subjectsBySemester)
          .sort()
          .map((sem) => (
            <div key={sem} style={{ marginBottom: "4rem" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem", gap: "1rem" }}>
                <h2 className="neo-title" style={{ color: "var(--neo-text)", margin: 0, fontSize: "1.5rem" }}>
                  <span style={{ color: "var(--neo-cyan)", marginRight: "0.5rem" }}>✤</span> Semester {sem}
                </h2>
                <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(6, 182, 212, 0.5), transparent)" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
                {subjectsBySemester[sem].map((item, index) => {
                  const gradients = [
                    "linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(6, 182, 212, 0.1))",
                    "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(239, 68, 68, 0.1))",
                    "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))",
                  ];
                  const activeGradient = gradients[index % gradients.length];
                  
                  return (
                    <div
                      key={index}
                      onClick={() => handleSubjectSelect(item.subject)}
                      className="neo-container"
                      style={{ 
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        cursor: "pointer", 
                        padding: "2rem", 
                        background: activeGradient,
                        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        minHeight: "200px"
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.boxShadow = "var(--shape-outset-hover)";
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "var(--shape-outset)";
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📘</div>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.5rem", color: "#fff" }}>{item.subject}</h3>
                      </div>
                      
                      <div style={{ marginTop: "1rem" }}>
                        <button style={{
                          background: "linear-gradient(135deg, var(--neo-violet), var(--neo-cyan))",
                          color: "#fff",
                          border: "none",
                          padding: "0.5rem 1.2rem",
                          borderRadius: "20px",
                          fontWeight: "600",
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          transition: "all 0.3s"
                        }}>
                          Start Quiz →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    );
  }

  // Quiz Start Screen
  if (!quizStarted && questions.length > 0) {
    return (
      <div className="fade-in" style={{ padding: "2rem", display: "flex", justifyContent: "center" }}>
        <div className="neo-container" style={{ padding: "3rem", width: "100%", maxWidth: "600px", textAlign: "center" }}>
          <h1 className="neo-title" style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📝 {selectedSubject}</h1>
          <p style={{ color: "var(--neo-text-sec)", marginBottom: "2rem" }}>
            {questions.length} Questions
          </p>
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ color: "var(--neo-text-sec)", marginBottom: "1.5rem" }}>
              Test your knowledge in {selectedSubject}. Answer all questions and see your score!
            </p>
            <button className="neo-button neo-button-primary" style={{ padding: "1rem 3rem", fontSize: "1.1rem", marginBottom: "1rem" }} onClick={() => setQuizStarted(true)}>
              Start Quiz
            </button>
            <br />
            <button className="neo-button" onClick={handleBackToSubjects}>
              ← Back to Subjects
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Result Screen
  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="fade-in" style={{ padding: "2rem", display: "flex", justifyContent: "center" }}>
        <div className="neo-container" style={{ padding: "3rem", width: "100%", maxWidth: "500px", textAlign: "center" }}>
          <h1 className="neo-title" style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎉 Completed!</h1>
          <h2 style={{ color: "var(--neo-text-sec)", marginBottom: "2rem", fontWeight: "500" }}>
            {selectedSubject}
          </h2>
          <div className="neo-inset" style={{ padding: "2rem", marginBottom: "2rem" }}>
            <div style={{ fontSize: "3.5rem", fontWeight: "800", color: "var(--neo-accent)" }}>
              {score} / {questions.length}
            </div>
            <div style={{ fontSize: "1.2rem", fontWeight: "600", marginTop: "0.5rem", color: percentage >= 70 ? "var(--neo-success)" : percentage >= 50 ? "var(--neo-warning)" : "var(--neo-danger)" }}>
              {percentage}% Correct
            </div>
          </div>
          
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button className="neo-button neo-button-primary" onClick={handleRestart}>
              Retake Quiz
            </button>
            <button className="neo-button" onClick={handleBackToSubjects}>
              New Subject
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Questions Screen
  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="fade-in" style={{ padding: "2rem", display: "flex", justifyContent: "center" }}>
      <div className="neo-container" style={{ padding: "3rem", width: "100%", maxWidth: "800px" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
          <div>
            <h2 className="neo-title" style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{selectedSubject}</h2>
            <div style={{ color: "var(--neo-text-sec)" }}>
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </div>
        
        <div className="progress-bar" style={{ marginBottom: "2rem" }}>
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Question Area */}
        <div className="neo-inset" style={{ padding: "2.5rem", marginBottom: "2rem" }}>
          <div style={{ fontSize: "1.3rem", fontWeight: "600", lineHeight: "1.6" }}>{currentQ.question}</div>
        </div>
        
        {/* Answers */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "3rem" }}>
          {currentQ.options.map((option, index) => {
            const isSelected = answers[currentQuestion] === index;
            return (
              <div
                key={index}
                className={isSelected ? "neo-inset" : "neo-outset"}
                style={{
                  padding: "1.5rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  transition: "all 0.2s",
                  border: isSelected ? "1px solid var(--neo-accent)" : "1px solid transparent",
                  color: isSelected ? "var(--neo-accent)" : "var(--neo-text)",
                }}
                onClick={() => handleAnswerSelect(index)}
              >
                <div className={isSelected ? "neo-outset" : "neo-inset"} style={{ width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span style={{ fontSize: "1.1rem" }}>{option}</span>
              </div>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            className="neo-button"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            style={{ opacity: currentQuestion === 0 ? 0.5 : 1 }}
          >
            ← Previous
          </button>
          {currentQuestion === questions.length - 1 ? (
            <button
              className="neo-button neo-button-primary"
              onClick={handleSubmit}
              disabled={answers[currentQuestion] === null}
              style={{ opacity: answers[currentQuestion] === null ? 0.5 : 1 }}
            >
              Submit Quiz
            </button>
          ) : (
            <button
              className="neo-button neo-button-primary"
              onClick={handleNext}
              disabled={answers[currentQuestion] === null}
              style={{ opacity: answers[currentQuestion] === null ? 0.5 : 1 }}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
