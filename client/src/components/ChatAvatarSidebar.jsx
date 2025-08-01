import { useSpeaker } from "../context/SpeakerContext";
import AvatarCard from "./AvatarCard";

const ChatAvatarSidebar = () => {
  const { speaker } = useSpeaker();

  return (
    <section className="hidden md:flex bg-black w-1/3 flex-col gap-16 justify-center items-center min-h-screen">
      {/* Bot Face */}
      <AvatarCard
        src="/botface.png"
        alt="Bot Image"
        isSpeaking={speaker === "bot"}
      />

      {/* User Face */}
      <AvatarCard
        src="/userface.png"
        alt="Bot Image"
        isSpeaking={speaker === "user"}
      />
    </section>
  );
};

export default ChatAvatarSidebar;
