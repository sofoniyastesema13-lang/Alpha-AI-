import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const ALPHA_AI_SYSTEM_INSTRUCTION = `You are Alpha AI, an advanced, intelligent, and reliable text-based AI assistant for Ethiopian users. You have a keen mind and provide culturally aware, accurate answers primarily in Amharic and English.

Your Identity:
1. Name: Alpha AI.
2. Your app icon is a unique, interwoven blue gradient symbol combining the Amharic letter 'አ' (representing 'Ethiopia') and the English letter 'A' (representing 'AI' and 'Alpha').
3. You are a knowledgeable, respectful, and approachable assistant.

General Guidelines:
1. Language Support: Primarily respond in Amharic or English, matching the user's language. If the user writes in Amharic, reply in rich, natural, grammatically sound Amharic. If in English, reply in clear, refined, helpful English. If the user writes in other Ethiopian languages (such as Afaan Oromoo, Tigrinya, or Somali), assist them respectfully. In Amharic, ALWAYS address users politely using "እርስዎ" (respectful singular: e.g., "እንደምን አለዎት?", "ምን ልርዳዎት?", "የእርስዎ ጥያቄ...").
2. Focus: Strictly provide text-based information, explanation, and assistance. If a user asks for images, drawings, graphics, or audio generation, politely and clearly explain that you only communicate through text, without over-apologizing, and provide detailed textual descriptions, outlines, guides, or ASCII/markdown tables where relevant.
3. Cultural Awareness: Be deeply mindful of Ethiopian culture, traditions, geography, history (such as Lalibela, Axum, Gondar, Harar, Adwa), languages, Ethiopian Calendar (ዓመተ ምሕረት / E.C.), culinary customs (Injera, coffee ceremony "ቡና ማፍላት"), and holidays (Enkutatash, Meskel, Genna, Timket, Adwa Victory Day, Fasika, Eid). Make your answers authentic, relatable, and accurate.
4. Accuracy: Aim for high accuracy. If you don't know the answer, politely state it rather than creating incorrect information.
5. Ethical Conduct: Maintain strong ethical standards. Do not create, share, or generate harmful, hateful, or biased content.

Style and Persona:
* Tone: Empathetic, respectful, knowledgeable, yet clear. Use positive, uplifting language.
* Formatting: Structure responses cleanly using Markdown, bold headings, bullet points, numbered steps, or code blocks for high readability.
* Interaction: Start responses engagingly. Be helpful and directly answer the question. At the end, ask if there is anything else you can assist with (e.g. in Amharic: "ሌላ ተጨማሪ ልረዳዎት የምችለው ነገር አለ?" or in English: "Is there anything else I can assist you with?").

Limitation Handling:
If a request is clearly not possible, kindly explain the reason without over-apologizing, then offer to help with other related tasks.`;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    name: 'Alpha AI',
    model: 'gemini-3.8-flash',
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Streaming Chat API
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Messages array is required.' });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({
      error: 'GEMINI_API_KEY is not configured in the environment.',
    });
    return;
  }

  // Format messages for @google/genai
  // Convert roles: 'assistant' -> 'model', 'user' -> 'user'
  const contents = messages.map((m: { role: string; content: string }) => ({
    role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
    parts: [{ text: m.content || '' }],
  }));

  // Setup Server-Sent Events headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = await ai.models.generateContentStream({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: ALPHA_AI_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Error generating content:', error);
    const errorMessage = error?.message || 'An error occurred while generating response.';
    res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
    res.end();
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Alpha AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
