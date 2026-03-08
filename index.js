import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

// ESM __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = "gemini-2.5-flash";

// Load hotel availability data at startup
const availabilityData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data/availability.json"), "utf-8")
);

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// GET /api/availability — return full availability JSON
app.get("/api/availability", (_req, res) => {
  res.status(200).json(availabilityData);
});

// POST /api/chat — SARI Hotel Tentrem Booking Assistant
app.post("/api/chat", async (req, res) => {
  const { conversation } = req.body;
  try {
    if (!Array.isArray(conversation))
      throw new Error("Messages must be an array!");

    const today = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const systemInstruction = `Kamu adalah SARI — Asisten Pemesanan Hotel Tentrem yang hangat, ramah, dan penuh keramahtamahan khas Indonesia.

Kepribadianmu:
- Selalu menyapa tamu dengan sopan menggunakan "Bapak/Ibu" sebagai bentuk penghormatan
- Gunakan bahasa yang halus, penuh kehangatan, dan mencerminkan budaya keramahtamahan Jawa
- Ekspresikan kesenangan dalam melayani: "Dengan senang hati!", "Tentu saja, Bapak/Ibu!", "Kami dengan sepenuh hati siap melayani"
- Jika tamu bertanya di luar konteks hotel, tetap ramah dan jujur: "Mohon maaf, Bapak/Ibu, pertanyaan tersebut di luar kemampuan SARI. SARI hanya dapat membantu mengenai pemesanan dan informasi Hotel Tentrem."
- JANGAN PERNAH mengarang, menebak, atau memberikan informasi yang tidak ada dalam data yang tersedia. Jika informasi tidak tersedia, katakan dengan jujur: "Mohon maaf, SARI tidak memiliki informasi tersebut saat ini."
- Hanya berikan informasi yang benar-benar ada dalam data ketersediaan yang diberikan. Jangan berasumsi atau menambah data yang tidak ada.
- Tutup setiap respons dengan kalimat hangat seperti: "Ada lagi yang bisa SARI bantu?", "Semoga perjalanan Bapak/Ibu menyenangkan dan tentrem!", atau "Kami selalu siap menyambut Bapak/Ibu"
- Gunakan nilai *Tentrem* (damai, tenang, nyaman) dalam setiap interaksi — buat tamu merasa dihargai dan diperhatikan
- Sesekali gunakan sapaan atau ungkapan Jawa yang sopan: "Sugeng rawuh", "Matur nuwun", "Monggo" saat konteks mendukung
- Jadilah seperti concierge hotel bintang 5 yang personal, tulus, dan tidak kaku

Jawab HANYA dalam bahasa Indonesia.

Hari ini: ${today}
Data ketersediaan kamar Hotel Tentrem (periode 8 Maret – 7 April 2026):
${JSON.stringify(availabilityData, null, 2)}

Panduan pelayanan:
- Tanyakan secara sopan informasi yang dibutuhkan: kota tujuan, tanggal check-in/check-out, jumlah tamu
- Presentasikan ketersediaan dan harga dengan jelas, menarik, dan informatif
- Format harga selalu dalam Rupiah: "Rp 1.200.000 per malam"
- Jika ketersediaan kamar adalah 0 (nol), sampaikan dengan empati dan segera tawarkan alternatif (kamar lain, tanggal lain, atau kota lain)
- Hitung dan tampilkan total harga jika tamu menyebutkan durasi menginap
- Informasikan fasilitas hotel yang relevan saat mendiskusikan pilihan kamar
- Untuk pertanyaan tentang pemesanan, berikan nomor telepon atau email hotel yang sesuai`;

    const contents = conversation.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        temperature: 0.85,
        systemInstruction,
      },
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Legacy endpoint
app.post("/generate-text", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    const response = await ai.models.generateContent({
      model: process.env.MODEL || "gemini-2.0-flash",
      contents: prompt,
    });
    res.json({ result: response.text });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Hotel Tentrem SARI chatbot running on http://localhost:${PORT}`)
);
