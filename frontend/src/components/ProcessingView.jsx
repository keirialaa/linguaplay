import { useEffect, useState } from "react";

const PROCESSING_MESSAGES = [
  "Extracting audio...",
  "Detecting language...",
  "Transcribing speech...",
  "Identifying expressions and idioms...",
  "Analyzing difficulty level...",
  "Almost there...",
];

function ProcessingView({ changeStage }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % PROCESSING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <div className="entry-text">
        <h2>Turn any video into an interactive language class</h2>
        <h3>
          Simply paste a YouTube link — LinguaPlay transcribes, detects the
          language, and becomes your language partner.
        </h3>
      </div>
      <div className="processing-status">
        <div className="progress-bar-track">
          <div className="progress-bar-fill"></div>
        </div>
        <p>{PROCESSING_MESSAGES[messageIndex]}</p>
      </div>
    </div>
  );
}
export default ProcessingView;
