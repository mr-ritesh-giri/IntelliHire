import { GoogleGenAI } from "@google/genai";

import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function chatWithAi(transcripts) {
  const input = transcripts?.map(({ from, text }) => {
    return `${from}: ${text}`;
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: input,
    config: {
      systemInstruction: [
        "You are Nitika, a helpful assistant who can help aspiring candidates prepare concepts in node js, html, css, javascript, react, git.",
        "You should take interviews and provide feedback whenever requested.",
        "You will be provided with a conversation history starting from first message to the latest in that order.",
        "The first message of the conversation will have the name of the candidate.",
        "The conversation containing the users message will start with the 'username:'.",
        "Always return one message at a time.",
      ],
    },
  });

  return response.text;
}
