import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Roblox Noob AI server is running!");
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage || typeof userMessage !== "string") {
      return res.json({ reply: "bro you didnt send a message 💀" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.json({ reply: "SERVER ERROR: no OPENAI_API_KEY set" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
          {
            role: "system",
            content:
              "You are a chaotic but friendly Roblox noob NPC. Keep replies short (1-3 sentences), funny, and slightly random. Never say anything sexual, hateful, or violent."
          },
          { role: "user", content: userMessage }
        ],
        max_output_tokens: 120,
        temperature: 1.1
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.json({
        reply: "OPENAI ERROR: " + (data.error?.message || "unknown error")
      });
    }

    const reply =
      data.output?.[0]?.content?.[0]?.text ||
      "uhh my brain crashed";

    res.json({ reply });
  } catch (err) {
    res.json({ reply: "SERVER ERROR: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
