import { useEffect, useRef, useState } from "react";
import AssistantIndicator from "./AssistantIndicator";
import axios from "axios";

function VoiceAssistant() {
  const uiLoaded = useRef(false);
  const speechRecognition = useRef(null);
  const [speaker, setSpeaker] = useState("");
  const [error, setError] = useState("");

  const [messages, setMessages] = useState([]);

  const getAiResponse = async (userMessage) => {
    const response = await axios.post("/chat", {
      transcripts: userMessage,
    });
    return response.data.message;
  };

  // STT (Speech to Text)
  useEffect(() => {
    if (uiLoaded.current === false) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      console.log(SpeechRecognition);

      if (!SpeechRecognition) {
        console.error(
          "Speech Recognition API is not supported in this browser."
        );
        return;
      }

      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.lang = "en-IN";

      recognition.onstart = () => {
        console.log("🎤 Listening started");
        setSpeaker("user");
      };

      recognition.onspeechstart = () => {
        console.log("🗣️ User started speaking");
      };

      recognition.onspeechend = () => {
        console.log("🔇 User stopped speaking");
      };

      recognition.onend = () => {
        console.log("🛑 Recognition ended");
        setSpeaker("");
      };

      recognition.onresult = async (event) => {
        const userTranscript = event.results[0][0].transcript;

        if (userTranscript && userTranscript.trim() !== "") {
          const newTranscripts = [
            ...messages,
            { from: "user", text: userTranscript },
          ];

          const response = await getAiResponse(newTranscripts);

          SpeakBot(response);

          setMessages((prev) => [
            ...prev,
            { from: "user", text: userTranscript },
            { from: "bot", text: response },
          ]);
        } else {
          setError("User didn't speak.");
        }
      };

      recognition.onerror = (event) => {
        console.error("Recognition Error:", event.error);
        setError(event.error);
      };

      speechRecognition.current = recognition;
    }

    uiLoaded.current = true;
  }, [uiLoaded]);

  // Loading the voices from here
  useEffect(() => {
    const loadVoices = () => {
      // const allVoices =
      window.speechSynthesis.getVoices();
      // console.log(allVoices);
    };
    loadVoices();

    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // TTS (Text to Speech)
  const SpeakBot = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();

    utterance.voice = voices.find(
      (voice) => voice.name === "Microsoft Zira - English (United States)"
    );

    utterance.lang = "en-IN"; // Indian English voice
    utterance.pitch = 1.2; // Slightly higher pitch (0–2 range)
    utterance.rate = 1; // Normal speaking speed (0.1–10)
    utterance.volume = 1; // Max safe volume (0–1)

    utterance.onstart = () => {
      console.log("✅ Speech started!");
      setSpeaker("bot");
    };

    utterance.onend = () => {
      console.log("✅ Speech finished!");
      setSpeaker("");

      if (speechRecognition.current) {
        speechRecognition.current?.start();
        console.log("🎙️ Recognition Started");
      } else {
        console.log("Speech Recognition not initialized");
      }
    };

    utterance.onerror = (event) => {
      console.error("Utterence Error:", event.error);
      setError(event.error);
    };

    speechSynthesis.speak(utterance);
  };

  const startInterview = async () => {
    try {
      setMessages([]);
      const botText = await getAiResponse([{ from: "user", text: "" }]);
      setMessages((prev) => [...prev, { from: "bot", text: botText }]);
      SpeakBot(botText);
    } catch (error) {
      setError(error.message);
      alert(error.toString());
    }
  };

  return (
    <section className="overflow-auto relative h-screen bg-purple-700 text-white flex flex-col">
      {/* Chat Area */}
      <main className="flex-1 pt-6 p-6 overflow-y-auto space-y-4">
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.from === "bot" ? "items-start" : "justify-end"
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-md text-base leading-relaxed ${
                  msg.from === "user" ? "bg-blue-500" : "bg-gray-900"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-3xl mt-80 font-semibold text-gray-950">
            Let's sharpen those interview skills. Hit the mic to start talking!
            🎤
          </p>
        )}
      </main>

      {/* Footer / Mic Control */}
      <footer className="fixed bottom-[4%] right-[29.6%] transform -translate-x-1/2 flex justify-center flex-col items-center">
        <button
          className="w-16 h-16 bg-gray-950 hover:bg-gray-900 rounded-full transition-colors"
          onClick={async () => await startInterview()}
        >
          <AssistantIndicator type={speaker} />
        </button>
      </footer>
    </section>
  );
}

export default VoiceAssistant;
