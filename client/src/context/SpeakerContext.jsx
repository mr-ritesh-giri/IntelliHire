import { createContext, useContext, useState } from "react";

const SpeakerContext = createContext();

export const SpeakerProvider = ({ children }) => {
  const [speaker, setSpeaker] = useState("");

  return (
    <SpeakerContext.Provider value={{ speaker, setSpeaker }}>
      {children}
    </SpeakerContext.Provider>
  );
};

export const useSpeaker = () => useContext(SpeakerContext);
