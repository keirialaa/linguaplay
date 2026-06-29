import ContextPanel from "./ContextPanel";
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
        <TabPanel videoId={videoId}></TabPanel>
      </div>
    </div>
  );
}
export default ChatView;
