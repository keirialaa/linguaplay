import { useState } from "react";

function QuizMessage({ quiz, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [lockedIn, setLockedIn] = useState(false);
  const [score, setScore] = useState(0);
  const questions = quiz?.questions;
  const current = questions?.[currentIndex];

  if (!questions || !current)
    return <p className="message bot">Failed to load quiz. Please try again.</p>;

  const normalize = (s) => s?.trim().toLowerCase();
  const isCorrect = (ans) => normalize(ans) === normalize(current.correct_answer);

  const handleCheck = () => {
    if (!selectedOption || lockedIn) return;
    setLockedIn(true);
    if (isCorrect(selectedOption)) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex + 1);
    setSelectedOption(null);
    setLockedIn(false);
  };

  const getOptionClass = (ans) => {
    if (!lockedIn) return selectedOption === ans ? "option selected" : "option";
    if (isCorrect(ans)) return "option correct";
    if (ans === selectedOption) return "option wrong";
    return "option";
  };

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <p className="quiz-progress">{currentIndex + 1} / {questions.length}</p>
        <button className="quiz-close" onClick={onClose}>✕</button>
      </div>
      <p className="quiz-question">{current.question}</p>
      <div className="quiz-options">
        {current.options.map((ans) => (
          <div
            key={ans}
            className={getOptionClass(ans)}
            onClick={() => { if (!lockedIn) setSelectedOption(ans); }}
          >
            {ans}
          </div>
        ))}
      </div>
      {!lockedIn && selectedOption && (
        <button className="button-quiz" onClick={handleCheck}>Check answer</button>
      )}
      {lockedIn && (
        <div className="quiz-feedback">
          <p>{isCorrect(selectedOption) ? "Correct!" : `Wrong — correct answer: ${current.correct_answer}`}</p>
          {currentIndex < questions.length - 1 ? (
            <button className="button-quiz" onClick={handleNext}>Next question</button>
          ) : (
            <p>Quiz complete! Score: {score} / {questions.length}</p>
          )}
        </div>
      )}
    </div>
  );
}
export default QuizMessage;
