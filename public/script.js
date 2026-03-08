const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("send-btn");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Remove welcome message on first send
  const welcome = chatBox.querySelector(".welcome-msg");
  if (welcome) welcome.remove();

  appendMessage("user", userMessage);
  input.value = "";
  sendBtn.disabled = true;

  // Create a placeholder bot message we can update in-place
  const botMessageElement = document.createElement("div");
  botMessageElement.classList.add("message", "bot", "thinking");
  botMessageElement.textContent = "SARI sedang memproses...";
  chatBox.appendChild(botMessageElement);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation: [{ role: "user", text: userMessage }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || response.statusText;
      throw new Error(`Server error: ${errorMessage}`);
    }

    const data = await response.json();

    botMessageElement.classList.remove("thinking");

    if (data && data.result) {
      botMessageElement.innerHTML = marked.parse(data.result);
    } else {
      botMessageElement.textContent = "Sorry, no response received.";
    }
  } catch (error) {
    console.error("Error fetching response:", error);
    botMessageElement.classList.remove("thinking");
    botMessageElement.textContent = "Failed to get response from server.";
  } finally {
    sendBtn.disabled = false;
    chatBox.scrollTop = chatBox.scrollHeight;
    input.focus();
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
