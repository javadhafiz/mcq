// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/ask', async (req, res) => {
  const { prompt } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error("❌ Missing OPENROUTER_API_KEY");
    return res.status(500).json({ error: "Server misconfiguration: API key missing" });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    // Log full error details to terminal if failed
    if (!response.ok) {
      console.error("❌ OpenRouter API error:", data);
      return res.status(response.status).json({
        error: data.error || 'Unknown error from OpenRouter',
        status: response.status
      });
    }

    const answer = data.choices?.[0]?.message?.content;

    if (!answer) {
      console.warn("⚠️ Response received, but no message content.");
      return res.status(502).json({ error: "No answer received from model." });
    }

    res.json({ response: answer });

  } catch (err) {
    console.error("❌ Server Exception:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
