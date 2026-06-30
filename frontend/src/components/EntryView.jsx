import { useState } from "react";

function EntryView({
  changeStage,
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
            changeStage("processing");
            try {
              const response = await fetch("http://127.0.0.1:8000/videos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: videoURL }),
              });
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
            } catch (error) {
              console.error("Failed to process video:", error);
              changeStage("entry");
            }
          }}
        >
          Transcribe
        </button>
      </form>
    </div>
  );
}
export default EntryView;
