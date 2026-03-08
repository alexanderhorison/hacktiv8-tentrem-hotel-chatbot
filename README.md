# Hotel Tentrem Chatbot — SARI Virtual Concierge

A conversational AI booking assistant for **Hotel Tentrem**, powered by Google Gemini AI. The bot — named **SARI** — helps guests check room availability, get pricing information, and learn about hotel facilities across three properties in **Jakarta, Semarang, and Yogyakarta**.

Built as a Hacktiv8 Phase 1 project submission.

---

## Features

- **Multi-turn conversation** — SARI remembers the context of your conversation
- **Real availability data** — Queries mock availability data for 31 days across 3 hotels and 4 room types
- **Indonesian hospitality personality** — SARI communicates with warm, Javanese-influenced courtesy
- **Markdown rendering** — Responses are formatted with bold, lists, and structure
- **Anti-hallucination** — SARI only responds based on data it has; never fabricates information
- **Gemini 2.5 Flash** — Powered by Google's latest fast AI model

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Backend   | Node.js, Express.js (ESM)         |
| AI        | Google Gemini API (`@google/genai`) |
| Data      | Local JSON mock (no external API key needed) |
| Frontend  | Vanilla HTML/CSS/JS               |
| Markdown  | `marked.js`                       |

---

## Project Structure

```
hacktiv8-tentrem-hotel-chatbot/
├── data/
│   └── availability.json   # Mock hotel availability (3 hotels × 4 room types × 31 days)
├── public/
│   ├── index.html          # Chat UI
│   ├── script.js           # Frontend logic
│   └── style.css           # Styling (shadcn-inspired)
├── index.js                # Express server + Gemini integration
├── package.json
└── .env.example
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- Google Gemini API key ([get one here](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/alexanderhorison/hacktiv8-tentrem-hotel-chatbot.git
cd hacktiv8-tentrem-hotel-chatbot

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### Running

```bash
node index.js
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Endpoints

| Method | Endpoint           | Description                          |
|--------|--------------------|--------------------------------------|
| GET    | `/api/availability`| Returns full hotel availability JSON |
| POST   | `/api/chat`        | Multi-turn chat with SARI            |

### POST `/api/chat`

**Request:**
```json
{
  "conversation": [
    { "role": "user", "text": "Ada kamar di Yogyakarta tanggal 15 Maret?" }
  ]
}
```

**Response:**
```json
{
  "result": "Sugeng rawuh, Bapak/Ibu! ..."
}
```

---

## Hotel Data

SARI has availability data for:

| Hotel                  | Room Types                                      |
|------------------------|-------------------------------------------------|
| Hotel Tentrem Jakarta  | Deluxe (Rp 1.2jt) · Superior (Rp 1.8jt) · Junior Suite (Rp 2.5jt) · Suite (Rp 4jt) |
| Hotel Tentrem Semarang | Deluxe (Rp 900rb) · Superior (Rp 1.3jt) · Junior Suite (Rp 1.8jt) · Suite (Rp 3jt)  |
| Hotel Tentrem Yogyakarta | Deluxe (Rp 950rb) · Superior (Rp 1.4jt) · Junior Suite (Rp 2jt) · Suite (Rp 3.2jt) |

Coverage: **8 Maret – 7 April 2026**

---

## Environment Variables

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## Author

**Alexander** — Hacktiv8 Phase 1 Project
