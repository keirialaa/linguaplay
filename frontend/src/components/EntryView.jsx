import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";
const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD ?? "";

function EntryView({
  changeStage,
  processingError,
  setProcessingError,
  setVideoId,
  setTitle,
  setDuration,
  setChannel,
  setCefrLevel,
  setComplexity,
  setDiffDescr,
  setExpressions,
  setCultureNote,
  setLanguage,
  setChunks,
  setVocab,
}) {
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
          onClick={async () => {
            setProcessingError("");
            changeStage("processing");
            try {
              const response = await fetch(`${API_URL}/videos`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "X-App-Password": APP_PASSWORD },
                body: JSON.stringify({ url: videoURL }),
              });
              if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || "Something went wrong.");
              }
              const result = await response.json();
              setVideoId(result.video_id);
              setTitle(result.title);
              setDuration(result.duration);
              setChannel(result.channel);
              setCefrLevel(result.analysis.cefr_level);
              setComplexity(result.analysis.complexity);
              setDiffDescr(result.analysis.difficulty_description);
              setExpressions(result.analysis.expressions);
              setCultureNote(result.analysis.culture_note);
              setLanguage(result.language);
              setChunks(result.chunks);
              setVocab(result.analysis.vocabulary);
              changeStage("chat");
            } catch (err) {
              setProcessingError(err.message);
              changeStage("entry");
            }
          }}
        >
          Transcribe
        </button>
      </form>
      {processingError && <p className="error-message">{processingError}</p>}
    </div>
  );
}
export default EntryView;
