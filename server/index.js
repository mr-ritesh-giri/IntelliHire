import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { chatWithAi } from "./genAi.js";

const port = 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World! This is the AI chat server.");
});

app.post("/chat", async (req, res) => {
  const { transcripts } = req.body;
  console.log("Transcripts:", transcripts);

  const response = await chatWithAi(transcripts);
  console.log(response);

  res.json({ message: response });
});

app.listen(port, () => {
  console.log(`AI server is running at ${port}`);
});
