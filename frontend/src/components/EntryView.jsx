import { useState } from "react";

function EntryView({ changeStage }) {
  const [videoURL, setVideoURL] = useState("");
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
        <input
          type="text"
          value={videoURL}
          onChange={(e) => setVideoURL(e.target.value)}
          placeholder="Paste Youtube link..."
          required
        ></input>
        <button
          type="button"
          onClick={() => {
            changeStage("processing");
          }}
        >
          Transcribe
        </button>
      </form>
    </div>
  );
}
export default EntryView;
