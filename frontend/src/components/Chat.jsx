function Chat() {
  return (
    <div className="chat-container">
      <div className="chat-space"></div>
      <div className="input-space">
        <form className="chat-input">
          <input placeholder="Ask a question about the video..."></input>
          <button type="button">Explain</button>
        </form>
      </div>
    </div>
  );
}
export default Chat;
