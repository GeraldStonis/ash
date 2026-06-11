import express from "express";
import path from "path";
import dotenv from "dotenv";
import { Ollama } from "ollama";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Ollama client lazily
let aiClient: Ollama | null = null;
function getOllamaClient(): Ollama | null {
  if (!aiClient) {
    const apiKey = process.env.OLLAMA_API_KEY;
    if (apiKey && apiKey.trim() !== "") {
      try {
        aiClient = new Ollama({
          host: "https://ollama.com",
          headers: {
            Authorization: "Bearer " + apiKey,
          },
        });
      } catch (e) {
        console.error("Failed to initialize Ollama client:", e);
      }
    }
  }
  return aiClient;
}



// 5. Chatbot Endpoint
app.post("/api/chatbot", async (req, res) => {
  const { messages, systemPrompt } = req.body;
  const ai = getOllamaClient();

  if (!ai) {
    return res.json({ text: "the so called evaluator's api key is missing...", isLive: false });
  }

  try {
    const ollamaMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const response = await ai.chat({
      model: "gpt-oss:120b",
      messages: ollamaMessages,
      stream: false,
    });

    return res.json({ text: response.message.content, isLive: true });
  } catch (err) {
    console.error("Ollama Chatbot API error:", err);
    return res.json({ text: "oof connection died. blame my web dev skills.", isLive: false, error: true });
  }
});

// Serve Frontend Vite Application
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is happily humming on port ${PORT}`);
  });
}

startServer();
