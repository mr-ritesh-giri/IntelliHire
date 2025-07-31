import { useEffect, useRef, useState } from "react";
import AssistantIndicator from "./AssistantIndicator";
import axios from "axios";
import { useSpeaker } from "../context/SpeakerContext";

function VoiceAssistant() {
  const { speaker, setSpeaker } = useSpeaker();

  const uiLoaded = useRef(false);
  const speechRecognition = useRef(null);
  const [error, setError] = useState("");

  const [messages, setMessages] = useState([]);
  const [botResponse, setBotResponse] = useState();

  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);

  const StartSpeech = () => {
    console.log("Starting Speech Called");

    if (speechRecognition.current) {
      speechRecognition.current?.start();
      console.log("🎙️ Recognition Started");
    } else {
      console.log("Speech Recognition not initialized");
    }
  };

  const getAiResponse = async (userMessage) => {
    const response = await axios.post(
      "https://intellihire-8qmi.onrender.com/chat",
      {
        transcripts: userMessage,
      }
    );
    return response.data.message;
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const atBottom = scrollHeight - scrollTop === clientHeight;
    setIsUserAtBottom(atBottom);
  };

  useEffect(() => {
    if (isUserAtBottom) {
      scrollToBottom();
    }
  }, [messages]);

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

      let didSpeak = false;

      recognition.onstart = () => {
        console.log("🎤 Listening started");
        setSpeaker("user");
        didSpeak = false;
      };

      recognition.onspeechstart = () => {
        console.log("🗣️ User started speaking");
        didSpeak = true;
      };

      recognition.onspeechend = () => {
        console.log("🔇 User stopped speaking");
      };

      recognition.onend = () => {
        console.log("🛑 Recognition ended");
        setSpeaker("");

        if (!didSpeak) {
          console.log("User did not speak — restarting");
          setTimeout(() => {
            StartSpeech();
          }, 2000);
        }
      };

      recognition.onresult = async (event) => {
        const userTranscript = event.results[0][0].transcript;

        if (userTranscript && userTranscript.trim() !== "") {
          setMessages((prev) => [
            ...prev,
            { from: "user", text: userTranscript },
          ]);
        } else {
          console.log("User didn't speak.");
          setTimeout(() => {
            StartSpeech();
          }, 2000);
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

  useEffect(() => {
    const fetchBotResponse = async () => {
      const isLastMessageFromUser =
        messages.length > 0 && messages[messages.length - 1]?.from === "user";

      if (isLastMessageFromUser) {
        const response = await getAiResponse(messages);
        setBotResponse(response);
      }
    };
    fetchBotResponse();
  }, [messages]);

  useEffect(() => {
    if (botResponse) {
      console.log(botResponse);
      SpeakBot(botResponse);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: botResponse,
        },
      ]);
    }
  }, [botResponse]);

  // Loading the voices from here
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      console.log(allVoices);
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
    utterance.rate = 1.5; // Normal speaking speed (0.1–10)
    utterance.volume = 1; // Max safe volume (0–1)

    utterance.onstart = () => {
      console.log("✅ Speech started!");
      setSpeaker("bot");
    };

    utterance.onend = () => {
      console.log("✅ Speech finished!");
      setSpeaker("");
      StartSpeech();
    };

    utterance.onerror = (event) => {
      console.error("Utterence Error:", event.error);
      setError(event.error);
    };

    speechSynthesis.speak(utterance);
  };

  const startInterview = async () => {
    try {
      setMessages([{ from: "user", text: "" }]);
    } catch (error) {
      setError(error.message);
      alert(error.toString());
    }
  };

  return (
    <section
      ref={chatContainerRef}
      onScroll={handleScroll}
      className="overflow-auto relative h-screen bg-purple-700 text-white flex flex-col"
    >
      {/* Chat Area */}
      <main className="flex-1 pt-6 px-6 pb-20 overflow-y-auto space-y-4">
        {messages.length > 0 ? (
          messages.map(
            (msg, idx) =>
              msg.text && (
                <div
                  key={idx}
                  ref={chatEndRef}
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
              )
          )
        ) : (
          <p className="text-center text-3xl mt-80 font-semibold text-gray-950">
            Let's sharpen those interview skills. Hit the mic to start talking!
            🎤
          </p>
        )}
      </main>

      {/* Footer / Mic Control */}
      <footer className="fixed left-0 w-full flex justify-center items-center bottom-[1%] md:right-[29.6%] md:left-auto md:w-auto md:flex-col md:transform md:-translate-x-1/2">
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
