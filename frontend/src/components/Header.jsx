function Header({ language, cefrLevel }) {
  return (
    <div className="header">
      <h2>Logo</h2>
      <div className="diff-label">
        <p>
          {language.charAt(0).toUpperCase() + language.slice(1)} • {cefrLevel}
        </p>
      </div>
    </div>
  );
}
export default Header;
