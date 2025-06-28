import { useEffect, useRef, useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import axios from "axios";

function App() {
  const uiLoaded = useRef(false);
  const speechRecognition = useRef(null);
  const [voices, setVoices] = useState([]);
  const [isListening, setIsListening] = useState("Mic Testing");
  const [error, setError] = useState("No error");

  const [messages, setMessages] = useState([{ from: "user", text: "Ritesh" }]);

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
        setIsListening((prev) => {
          return prev + " 🎤  Listening Started";
        });
        console.log("🎤 Listening started");
      };

      recognition.onspeechstart = () => {
        setIsListening((prev) => {
          return prev + " 🗣️ User started speaking";
        });
        console.log("🗣️ User started speaking");
      };

      recognition.onspeechend = () => {
        setIsListening((prev) => {
          return prev + " 🔇 User stopped speaking";
        });
        console.log("🔇 User stopped speaking");
      };

      recognition.onend = () => {
        setIsListening((prev) => {
          return prev + " 🛑 Recognition ended";
        });
        console.log("🛑 Recognition ended");
      };

      recognition.onresult = async (event) => {
        const userTranscript = event.results[0][0].transcript;

        const newTranscripts = [
          ...messages,
          { from: "user", text: userTranscript },
        ];

        const response = await getAiResponse(newTranscripts);
        console.log(response);

        speakBot(response);

        setMessages((prev) => [
          ...prev,
          { from: "user", text: userTranscript },
          { from: "bot", text: response },
        ]);
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
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
      // console.log(allVoices);
    };
    loadVoices();

    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // TTS (Text to Speech)
  const speakBot = (text) => {
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
    // alert("Alert");
    try {
      const botText = await getAiResponse([{ from: "user", text: "Ritesh" }]);
      setMessages((prev) => [...prev, { from: "bot", text: botText }]);
      speakBot(botText);
    } catch (error) {
      alert(error.toString());
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="p-4 bg-gray-800 text-center text-xl font-bold shadow">
        Interview Bot 🎙️
      </header>

      {/* Chat Area */}
      <main className="flex-1 p-6 overflow-y-auto space-y-4">
        {/* Bot Message */}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.from === "bot" ? "items-start" : "justify-end"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-md ${
                msg.from === "user" ? "bg-blue-600" : "bg-green-600"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </main>

      {/* Footer / Mic Control */}
      <footer className="p-4 bg-gray-800 flex items-center justify-between">
        <span className="text-sm text-gray-300">Tap mic to start</span>
        <button
          className="p-3 bg-blue-500 rounded-full hover:bg-blue-600"
          onClick={async () => await startInterview()}
        >
          <FaMicrophone className="text-white text-xl" />
        </button>
      </footer>
    </div>
  );
}

export default App;
