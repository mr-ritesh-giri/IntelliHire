import AvatarCard from "./AvatarCard";

const ChatAvatarSidebar = () => {
  return (
    <section className="bg-black w-1/3 flex flex-col gap-16 justify-center items-center min-h-screen">
      {/* Bot Face */}
      <AvatarCard src="src/assets/botface.png" alt="Bot Image" />
      {/* User Face */}
      <AvatarCard src="src/assets/userface.png" alt="User Image" />
    </section>
  );
};

export default ChatAvatarSidebar;
