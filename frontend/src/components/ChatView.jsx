import ContextPanel from "./ContextPanel";
import Header from "./Header";
import TabPanel from "./TabPanel";

function ChatView() {
  return (
    <div className="container-chat-view">
      <Header></Header>
      <div className="content-chat-view">
        <ContextPanel></ContextPanel>
        <TabPanel></TabPanel>
      </div>
    </div>
  );
}
export default ChatView;
