import { formatDuration } from "../utils/formatDuration";

function Transcript({ chunks }) {
  return (
    <div className="transcript-container">
      {chunks.map((chunk, i) => (
        <div className="chunk" key={i}>
          <p className="chunk-timestamp">
            {formatDuration(chunk.start)} - {formatDuration(chunk.end)}
          </p>
          <p className="chunk-text">{chunk.text}</p>
        </div>
      ))}
    </div>
  );
}
export default Transcript;
