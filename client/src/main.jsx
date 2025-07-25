import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SpeakerProvider } from "./context/SpeakerContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SpeakerProvider>
      <App />
    </SpeakerProvider>
  </StrictMode>
);
