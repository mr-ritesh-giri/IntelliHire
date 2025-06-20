import { useEffect, useRef, useState } from "react";

function App() {
  const uiLoaded = useRef(false);
  const speechRecognition = useRef(null);
  const [voices, setVoices] = useState([]);
  const [isListening, setIsListening] = useState("Mic Testing");
  const [transcript, setTranscript] = useState("Transcirpt here");
  const [error, setError] = useState("No error");

  const botText = "Hi myself Luffy... How may I assist you?!";

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
      console.log(allVoices);
    };
    loadVoices();

    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

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

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript("You said: " + transcript + ".");
        console.log("User", transcript);
      };

      recognition.onerror = (event) => {
        console.error("Recognition Error:", event.error);
        setError(event.error);
      };

      speechRecognition.current = recognition;
    }

    uiLoaded.current = true;
  }, [uiLoaded]);

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

  const startInterview = () => {
    speakBot(botText);
  };

  return (
    <div className="h-screen w-full bg-cyan-950 p-10">
      <p className="text-white"> {transcript} </p>
      <p className="text-white"> {isListening.toString()} </p>
      <p className="text-red-700"> {error} </p>
      <button
        className="px-4 py-2 bg-cyan-600 rounded-md font-bold"
        onClick={() => startInterview()}
      >
        Start Interview
      </button>
    </div>
  );
}

export default App;
