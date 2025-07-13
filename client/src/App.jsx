import ChatAvatarSidebar from "./components/ChatAvatarSidebar";
import VoiceAssistant from "./components/VoiceAssistant";

function App() {
  return (
    <>
      {/* ChatAvatar Sidebar */}
      <main className="bg-black h-screen w-full flex">
        <ChatAvatarSidebar />
        <section className="bg-purple-700 w-2/3">
          {/* Chat Section */}
          <VoiceAssistant />
        </section>
      </main>
    </>
  );
}

export default App;
