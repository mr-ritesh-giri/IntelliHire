import { useEffect, useRef, useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import axios from "axios";

function App() {
  const uiLoaded = useRef(false);
  const speechRecognition = useRef(null);
  const [error, setError] = useState("No error");

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
      };

      recognition.onspeechstart = () => {
        console.log("🗣️ User started speaking");
      };

      recognition.onspeechend = () => {
        console.log("🔇 User stopped speaking");
      };

      recognition.onend = () => {
        console.log("🛑 Recognition ended");
      };

      recognition.onresult = async (event) => {
        const userTranscript = event.results[0][0].transcript;

        if (userTranscript && userTranscript.trim() !== "") {
          const newTranscripts = [
            ...messages,
            { from: "user", text: userTranscript },
          ];

          const response = await getAiResponse(newTranscripts);
          // console.log(response);

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

    utterance.lang = "en-US";
    utterance.pitch = 1.1;
    utterance.rate = 1.1;
    utterance.volume = 2;

    utterance.onstart = () => {
      console.log("✅ Speech started!");
    };

    utterance.onend = () => {
      console.log("✅ Speech finished!");

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
      const botText = await getAiResponse([{ from: "user", text: "" }]);
      setMessages((prev) => [...prev, { from: "bot", text: botText }]);
      SpeakBot(botText);
    } catch (error) {
      setError(error.message);
      alert(error.toString());
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-400 text-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 p-4 bg-[#303950] text-center text-2xl font-semibold shadow-md">
        Interview Bot 🎙️
      </header>

      {/* Chat Area */}
      <main className="flex-1 pt-20 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.from === "bot" ? "items-start" : "justify-end"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-md text-base leading-relaxed ${
                msg.from === "user" ? "bg-blue-500" : "bg-[#303950]"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </main>

      {/* Footer / Mic Control */}
      <footer className="fixed bottom-[2%] left-1/2 transform -translate-x-1/2 flex justify-center">
        <button
          className="p-6 bg-[#303950] rounded-full transition-colors"
          onClick={async () => await startInterview()}
        >
          <FaMicrophone className="text-white text-4xl" />
        </button>
      </footer>
    </div>
  );
}

export default App;

{
  /* <button
  className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
  onClick={async () => await startInterview()}
></button>; */
}
