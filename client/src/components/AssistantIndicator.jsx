import { FaMicrophone } from "react-icons/fa";

const AssistantIndicator = ({ type }) => {
  if (type === "bot") {
    return (
      <video
        src="src/assets/speakerOn.webm"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full p-1"
      />
    );
  }

  if (type === "user") {
    return (
      <video
        src="src/assets/micOn.webm"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full p-1"
      />
    );
  }

  return (
    <FaMicrophone className="text-purple-700 p-3 text-4xl w-full h-full" />
  );
};

export default AssistantIndicator;
