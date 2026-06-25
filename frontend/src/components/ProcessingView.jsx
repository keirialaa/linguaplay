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
      <form className="search-bar">
        <input type="text" placeholder="Paste Youtube link" required></input>
        <button type="button" onClick={() => changeStage("chat")}>
          Transcribe
        </button>
      </form>
      <div className="processing-status"></div>
    </div>
  );
}
export default ProcessingView;
