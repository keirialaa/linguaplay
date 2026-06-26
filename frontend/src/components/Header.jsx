function Header({ language, cefrLevel }) {
  return (
    <div className="header">
      <h2>Logo</h2>
      <h2>
        {language.charAt(0).toUpperCase() + language.slice(1)} • {cefrLevel}
      </h2>
    </div>
  );
}
export default Header;
