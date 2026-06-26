import ContextPanel from "./ContextPanel";
import Header from "./Header";
import TabPanel from "./TabPanel";

function ChatView({
  videoId,
  title,
  duration,
  channel,
  cefrLevel,
  complexity,
  diffDescr,
  expressions,
  cultureNote,
  language,
}) {
  return (
    <div className="container-chat-view">
      <Header language={language} cefrLevel={cefrLevel}></Header>
      <div className="content-chat-view">
        <ContextPanel
          videoId={videoId}
          title={title}
          duration={duration}
          channel={channel}
          cefrLevel={cefrLevel}
          complexity={complexity}
          diffDescr={diffDescr}
          expressions={expressions}
          cultureNote={cultureNote}
        ></ContextPanel>
        <TabPanel></TabPanel>
      </div>
    </div>
  );
}
export default ChatView;
