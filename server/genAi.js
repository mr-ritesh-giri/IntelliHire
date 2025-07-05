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
      systemInstruction: [],
    },
  });

  return response.text;
}
