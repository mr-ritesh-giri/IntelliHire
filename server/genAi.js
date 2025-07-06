import { GoogleGenAI } from "@google/genai";

import dotenv from "dotenv";
import interviewPrompts from "./interviewPrompts.js";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function chatWithAi(transcripts) {
  const input = transcripts?.map(({ from, text }) => {
    return `${from}: ${text}`;
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: input,
    generationConfig: {
      responseMimeType: "text/plain",
      temperature: 0.7,
      topK: 1,
      topP: 1,
    },
    config: {
      systemInstruction: interviewPrompts,
    },
  });

  return response.text;
}
