import { useEffect, useRef } from "react";

function App() {
  const uiLoaded = useRef(false);
  const speechRecognition = useRef(null);

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

      console.log("Recognition", recognition);

      recognition.continuous = false;
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log("🎤 Listening started");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("User", transcript);
      };

      recognition.onerror = (err) => {
        console.error("Recognition Error:", err.error);
      };

      speechRecognition.current = recognition;
    }

    uiLoaded.current = true;
  }, [uiLoaded]);

  const startInterview = () => {
    if (speechRecognition.current) {
      speechRecognition.current.start();
      console.log("Recognition Started");
    } else {
      console.log("Speech Recognition not initialized");
    }
  };

  return (
    <div className="h-screen w-full bg-cyan-950 p-10">
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
