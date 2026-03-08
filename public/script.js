const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("send-btn");

const STORAGE_KEY = "tentrem_chat_history";

// conversation array for multi-turn context
let conversation = [];

// --- LocalStorage helpers ---
function saveHistory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversation));
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

// --- Render a message bubble ---
function appendMessage(role, text) {
  const welcome = chatBox.querySelector(".welcome-msg");
  if (welcome) welcome.remove();

  const msg = document.createElement("div");
  msg.classList.add("message", role);
  if (role === "model") {
    msg.innerHTML = marked.parse(text);
  } else {
    msg.textContent = text;
  }
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

// --- Restore previous chat on page load ---
function restoreHistory() {
  conversation = loadHistory();
  if (conversation.length === 0) return;

  const welcome = chatBox.querySelector(".welcome-msg");
  if (welcome) welcome.remove();

  conversation.forEach(({ role, text }) => appendMessage(role, text));
}

restoreHistory();

// --- Submit handler ---
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  conversation.push({ role: "user", text: userMessage });
  saveHistory();
  appendMessage("user", userMessage);
  input.value = "";
  sendBtn.disabled = true;

  // Placeholder bot bubble
  const botEl = document.createElement("div");
  botEl.classList.add("message", "bot", "thinking");
  botEl.textContent = "SARI sedang memproses...";
  chatBox.appendChild(botEl);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversation }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || response.statusText);
    }

    const data = await response.json();
    botEl.classList.remove("thinking");

    if (data && data.result) {
      botEl.innerHTML = marked.parse(data.result);
      conversation.push({ role: "model", text: data.result });
      saveHistory();
    } else {
      botEl.textContent = "Mohon maaf, tidak ada respons yang diterima.";
    }
  } catch (error) {
    console.error("Error:", error);
    botEl.classList.remove("thinking");
    botEl.textContent = "Gagal mendapatkan respons dari server.";
  } finally {
    sendBtn.disabled = false;
    chatBox.scrollTop = chatBox.scrollHeight;
    input.focus();
  }
});
