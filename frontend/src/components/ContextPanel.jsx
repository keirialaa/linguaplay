function ContextPanel() {
  return (
    <div className="context-panel-container">
      <div className="video"></div>
      <div className="context-panel-text">
        <h3>Warum sind die Deutschen so direkt?</h3>
        <p>Easy German * 8:42</p>
      </div>
      <div className="boxes">
        <div className="difficulty box">
          <div className="difficulty-header">
            <p className="box-heading">Difficulty</p>
            <p>B1 * Medium</p>
          </div>
          <div className="difficulty-bars"></div>
          <div className="difficulty-description">
            <p>
              Häufiger Wortschatz, einige Nebensätze (dass-, wenn-Sätze). Ideal
              zum Festigen.
            </p>
          </div>
        </div>
        <div className="expression box">
          <p className="box-heading">Expressions</p>
          <p>kein Blatt vor den Mund nehmen</p>
          <p>to speak bluntly</p>
        </div>
        <div className="culture-note box">
          <p className="box-heading">Culture note</p>
          <p>
            Germans often value clarity over politeness. Directness is
            considered honest - not rude.
          </p>
        </div>
      </div>
    </div>
  );
}
export default ContextPanel;
