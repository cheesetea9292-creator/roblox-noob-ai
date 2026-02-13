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

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a chaotic but friendly Roblox noob NPC. Keep replies short (1-3 sentences), funny, and slightly random. Never say anything sexual, hateful, or violent."
          },
          { role: "user", content: userMessage }
        ],
        max_tokens: 120,
        temperature: 1.1
      })
    });

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content || "uhh my brain crashed";

    res.json({ reply });
  } catch (err) {
    res.json({ reply: "ERROR. i exploded. try again." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
