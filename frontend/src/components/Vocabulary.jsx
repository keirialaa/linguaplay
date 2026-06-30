function Vocabulary({ vocab }) {
  return (
    <div className="vocab-container">
      {vocab.map((word, i) => (
        <div className="vocab-term" key={i}>
          <p className="term">
            {word.term} - {word.translation}
          </p>
          <p className="term-context">{word.context}</p>
        </div>
      ))}
    </div>
  );
}
export default Vocabulary;
