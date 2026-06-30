function ProcessingView({ changeStage }) {
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
        <p>Processing video...</p>
      </div>
    </div>
  );
}
export default ProcessingView;
