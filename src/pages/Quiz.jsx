
//   const handleAnswerSelect = (answerIndex) => {
//     const newAnswers = [...answers];
//     newAnswers[currentQuestion] = answerIndex;
//     setAnswers(newAnswers);
//   };

//   const handleNext = () => {
//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(currentQuestion - 1);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await api.quiz.submit({ 
//         year: userYear, 
//         subject: selectedSubject,
//         answers 
//       });
//       setScore(response.score);
//       setShowResult(true);
//     } catch (err) {
//       setError('Failed to submit quiz');
//     }
//   };

//   const handleRestart = () => {
//     setCurrentQuestion(0);
//     setAnswers(new Array(questions.length).fill(null));
//     setShowResult(false);
//     setScore(0);
//     setQuizStarted(false);
//   };

//   const handleBackToSubjects = () => {
//     setSelectedSubject(null);
//     setQuestions([]);
//     setQuizStarted(false);
//     setShowResult(false);
//     setCurrentQuestion(0);
//     setAnswers([]);
//   };

//   if (loading) return <div className="loading">Loading...</div>;

//   if (error && !selectedSubject) {
//     return (
//       <div className="main-container">
//         <div className="quiz-container">
//           <div className="error-message">{error}</div>
//           <button className="start-btn" onClick={fetchSubjects}>Retry</button>
//         </div>
//       </div>
//     );
//   }

//   // Subject Selection Screen
//   if (!selectedSubject) {
//     return (
//       <div className="main-container">
//         <div className="quiz-header" style={{marginBottom: '2rem'}}>
//           <h1>📝 Select Subject - Year {userYear}</h1>
//         </div>
//         <div className="notes-grid">
//           {subjects.map((subject, index) => (
//             <div
//               key={index}
//               onClick={() => handleSubjectSelect(subject)}
//               className="note-card"
//               style={{textAlign: 'center'}}
//             >
//               <h3>{subject}</h3>
//               <p style={{color: '#b0c4de', marginTop: '0.5rem'}}>
//                 Click to start quiz
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // Quiz Start Screen
//   if (!quizStarted && questions.length > 0) {
//     return (
//       <div className="main-container">
//         <div className="quiz-container">
//           <div className="quiz-header">
//             <h1>📝 {selectedSubject}</h1>
//             <p style={{color: '#b0c4de', marginTop: '1rem'}}>
//               Year {userYear} • {questions.length} Questions
//             </p>
//           </div>
//           <div className="quiz-start">
//             <p style={{color: '#b0c4de', marginBottom: '1.5rem'}}>
//               Test your knowledge in {selectedSubject}. Answer all questions and see your score!
//             </p>
//             <button className="start-btn" onClick={() => setQuizStarted(true)}>
//               Start Quiz
//             </button> <br/> <br/>
//             <button 
//               className="start-btn" 
//               onClick={handleBackToSubjects}
//               style={{marginTop: '1rem', background: 'rgba(255,255,255,0.2)'}}
//             >
//               ← Back to Subjects
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Result Screen
//   if (showResult) {
//     const percentage = Math.round((score / questions.length) * 100);
//     return (
//       <div className="main-container">
//         <div className="quiz-container">
//           <div className="result-container">
//             <h1>🎉 Quiz Completed!</h1>
//             <h2 style={{color: '#b0c4de', marginTop: '1rem'}}>{selectedSubject}</h2>
//             <div className="result-score">{score} / {questions.length}</div>
//             <div className="result-percentage">
//               {percentage}% Correct
//             </div>
//             <div style={{
//               background: percentage >= 70 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
//               padding: '1rem',
//               borderRadius: '8px',
//               marginTop: '1.5rem'
//             }}>
//               <p style={{margin: 0, color: percentage >= 70 ? '#4caf50' : '#f44336'}}>
//                 {percentage >= 70 ? '✅ Great job! You passed!' : '📚 Keep practicing!'}
//               </p>
//             </div>
//             <button className="result-btn" onClick={handleRestart}>
//               Retake Quiz
//             </button>
//             <button 
//               className="result-btn" 
//               onClick={handleBackToSubjects}
//               style={{marginTop: '1rem', background: 'rgba(255,255,255,0.2)'}}
//             >
//               ← Back to Subjects
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Quiz Questions Screen
//   const currentQ = questions[currentQuestion];
//   const progress = ((currentQuestion + 1) / questions.length) * 100;

//   return (
//     <div className="main-container">
//       <div className="quiz-container">
//         <div className="quiz-header">
//           <h2>{selectedSubject}</h2>
//           <h3>Question {currentQuestion + 1} of {questions.length}</h3>
//           <div className="progress-bar">
//             <div className="progress" style={{ width: `${progress}%` }}></div>
//           </div>
//         </div>

//         <div className="question-box">
//           <div className="question-text">{currentQ.question}</div>
//           <div className="options">
//             {currentQ.options.map((option, index) => (
//               <div
//                 key={index}
//                 className={`option ${answers[currentQuestion] === index ? 'selected' : ''}`}
//                 onClick={() => handleAnswerSelect(index)}
//               >
//                 <span className="option-letter">{String.fromCharCode(65 + index)}.</span>
//                 <span>{option}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="quiz-footer">
//           <button
//             className="quiz-nav-btn prev-btn"
//             onClick={handlePrevious}
//             disabled={currentQuestion === 0}
//           >
//             ← Previous
//           </button>
//           {currentQuestion === questions.length - 1 ? (
//             <button
//               className="quiz-nav-btn next-btn"
//               onClick={handleSubmit}
//               disabled={answers[currentQuestion] === null}
//             >
//               Submit Quiz
//             </button>
//           ) : (
//             <button
//               className="quiz-nav-btn next-btn"
//               onClick={handleNext}
//               disabled={answers[currentQuestion] === null}
//             >
//               Next →
//             </button>
//           )}
//         </div>
        
//         <button 
//           className="quiz-nav-btn"
//           onClick={handleBackToSubjects}
//           style={{
//             marginTop: '1rem', 
//             background: 'rgba(255,255,255,0.2)',
//             width: '100%'
//           }}
//         >
//           ← Back to Subjects
//         </button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Quiz() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.quiz.getSubjects();
      if (response.subjects) {
        setSubjects(response.subjects);
      } else {
        setError('No subjects available');
      }
    } catch (err) {
      console.error('Subjects fetch error:', err);
      setError('Failed to load subjects');
    }
    setLoading(false);
  };

  const handleSubjectSelect = async (subject, year) => {
    setSelectedSubject(subject);
    // year unused
    setLoading(true);
    setError('');
    try {
      const response = await api.quiz.getQuiz(subject);
      if (response.questions && response.questions.length > 0) {
        setQuestions(response.questions);
        setAnswers(new Array(response.questions.length).fill(null));
      } else {
        setError('No questions available for this subject');
      }
    } catch (err) {
      console.error('Quiz fetch error:', err);
      setError('Failed to load quiz');
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
        questions
      });
      setScore(response.score);
      setShowResult(true);
    } catch (err) {
      setError('Failed to submit quiz');
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
    setSelectedYear(null);
    setQuestions([]);
    setQuizStarted(false);
    setShowResult(false);
    setCurrentQuestion(0);
    setAnswers([]);
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (error && !selectedSubject) {
    return (
      <div className="main-container">
        <div className="quiz-container">
          <div className="error-message">{error}</div>
          <button className="start-btn" onClick={fetchSubjects}>Retry</button>
        </div>
      </div>
    );
  }

  // Subject Selection Screen - Grouped by Year
  if (!selectedSubject) {
    // Group subjects by year
    const subjectsByYear = subjects.reduce((acc, item) => {
      if (!acc[item.year]) {
        acc[item.year] = [];
      }
      acc[item.year].push(item);
      return acc;
    }, {});

    return (
      <div className="main-container">
        <div className="quiz-header" style={{marginBottom: '2rem'}}>
          <h1>📝 Select Subject</h1>
          {/* optional descriptive note */}
        </div>

        {Object.keys(subjectsByYear).sort().map(year => (
          <div key={year} style={{marginBottom: '2rem'}}>
            <h2 style={{
              color: 'white',
              marginBottom: '1rem',
              fontSize: '1.5rem',
              borderBottom: '2px solid #667eea',
              paddingBottom: '0.5rem',
              display: 'inline-block'
            }}>
              📚 Year {year}
            </h2>
            <div className="notes-grid">
              {subjectsByYear[year].map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleSubjectSelect(item.subject, item.year)}
                  className="note-card"
                  style={{textAlign: 'center', cursor: 'pointer'}}
                >
                  <h3>{item.subject}</h3>
                  {/* semester info could be added here using item.semester if desired */}
                  <p style={{color: '#b0c4de', marginTop: '0.3rem'}}>
                    Click to start quiz
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Quiz Start Screen
  if (!quizStarted && questions.length > 0) {
    return (
      <div className="main-container">
        <div className="quiz-container">
          <div className="quiz-header">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', width: '100%'}}>
              <div style={{flex: 1}}>
                <h1>📝 {selectedSubject}</h1>
                <p style={{color: '#b0c4de', marginTop: '0.5rem'}}>
                  {questions.length} Questions
                </p>
              </div>
              <div style={{marginLeft: '1rem'}}>
                <button
                  onClick={() => window.open('https://drive.google.com/drive/folders/1qS68ZAD6Po_6uzhyIB2k-R3TTazpfZ8Z?usp=sharing', '_blank')}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'transform 0.2s',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    minWidth: '140px',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  📖 Study Notes
                </button>
              </div>
            </div>
          <div className="quiz-start">
            <p style={{color: '#b0c4de', marginBottom: '1.5rem'}}>
              Test your knowledge in {selectedSubject}. Answer all questions and see your score!
            </p>
            <button className="start-btn" onClick={() => setQuizStarted(true)}>
              Start Quiz
            </button> <br/> <br/>
            <button 
              className="start-btn" 
              onClick={handleBackToSubjects}
              style={{marginTop: '1rem', background: 'rgba(255,255,255,0.2)'}}
            >
              ← Back to Subjects
            </button>
          </div>
        </div>
        </div>
      </div>
    );
  }

  // Result Screen
  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="main-container">
        <div className="quiz-container">
          <div className="result-container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', width: '100%'}}>
              <div style={{flex: 1}}>
                <h1>🎉 Quiz Completed!</h1>
                <h2 style={{color: '#b0c4de', marginTop: '1rem'}}>{selectedSubject}</h2>
              </div>
              <div style={{marginLeft: '1rem'}}>
                <button
                  onClick={() => window.open('https://drive.google.com/drive/folders/1qS68ZAD6Po_6uzhyIB2k-R3TTazpfZ8Z?usp=sharing', '_blank')}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'transform 0.2s',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    minWidth: '140px',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  📖 Study Notes
                </button>
              </div>
            </div>
            <div className="result-score">{score} / {questions.length}</div>
            <div className="result-percentage">
              {percentage}% Correct
            </div>
            <div style={{
              background: percentage >= 70 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1.5rem'
            }}>
              <p style={{margin: 0, color: percentage >= 70 ? '#4caf50' : '#f44336'}}>
                {percentage >= 70 ? '✅ Great job! You passed!' : '📚 Keep practicing!'}
              </p>
            </div>
            <button className="result-btn" onClick={handleRestart}>
              Retake Quiz
            </button>
            <button 
              className="result-btn" 
              onClick={handleBackToSubjects}
              style={{marginTop: '1rem', background: 'rgba(255,255,255,0.2)'}}
            >
              ← Back to Subjects
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
    <div className="main-container">
      <div className="quiz-container">
        <div className="quiz-header">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', width: '100%'}}>
            <div style={{flex: 1}}>
              <h2>{selectedSubject} (Year {selectedYear})</h2>
              <h3>Question {currentQuestion + 1} of {questions.length}</h3>
            </div>
            <div style={{marginLeft: '1rem'}}>
              <button
                onClick={() => window.open('https://drive.google.com/drive/folders/1qS68ZAD6Po_6uzhyIB2k-R3TTazpfZ8Z?usp=sharing', '_blank')}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'transform 0.2s',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                  minWidth: '140px',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                📖 Study Notes
              </button>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="question-box">
          <div className="question-text">{currentQ.question}</div>
          <div className="options">
            {currentQ.options.map((option, index) => (
              <div
                key={index}
                className={`option ${answers[currentQuestion] === index ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(index)}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}.</span>
                <span>{option}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="quiz-footer">
          <button
            className="quiz-nav-btn prev-btn"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            ← Previous
          </button>
          {currentQuestion === questions.length - 1 ? (
            <button
              className="quiz-nav-btn next-btn"
              onClick={handleSubmit}
              disabled={answers[currentQuestion] === null}
            >
              Submit Quiz
            </button>
          ) : (
            <button
              className="quiz-nav-btn next-btn"
              onClick={handleNext}
              disabled={answers[currentQuestion] === null}
            >
              Next →
            </button>
          )}
        </div>
        
        <button 
          className="quiz-nav-btn"
          onClick={handleBackToSubjects}
          style={{
            marginTop: '1rem', 
            background: 'rgba(255,255,255,0.2)',
            width: '100%'
          }}
        >
          ← Back to Subjects
        </button>
      </div>
    </div>
  );
}