function formatDuration(totalSeconds) {
  if (totalSeconds == null) return "";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function ContextPanel({
  videoId,
  title,
  channel,
  duration,
  cefrLevel,
  complexity,
  diffDescr,
  expressions,
  cultureNote,
}) {
  return (
    <div className="context-panel-container">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        allowFullScreen
      ></iframe>
      <div className="context-panel-text">
        <h3>{title}</h3>
        <p>
          {channel} • {formatDuration(duration)}
        </p>
      </div>
      <div className="boxes">
        <div className="difficulty box">
          <div className="difficulty-header">
            <p className="box-heading">Difficulty</p>
            <div className="diff-label">
              <p>
                {cefrLevel} • {complexity}
              </p>
            </div>
          </div>
          <div className="difficulty-bars"></div>
          <div className="difficulty-description">
            <p>{diffDescr}</p>
          </div>
        </div>
        <div className="expression box">
          <p className="box-heading">Expressions</p>
          <div className="expression-items">
            {expressions && expressions.length > 0 ? (
              expressions.map((exp, i) => (
                <div className="expression-item" key={i}>
                  <p className="expression-phrase">{exp.phrase}</p>
                  <p className="expression-explanation">
                    <i>{exp.explanation}</i>
                  </p>
                </div>
              ))
            ) : (
              <p>No relevant information detected</p>
            )}
          </div>
        </div>
        <div className="culture-note box">
          <p className="box-heading">Culture note</p>
          <p>{cultureNote}</p>
        </div>
      </div>
    </div>
  );
}
export default ContextPanel;
