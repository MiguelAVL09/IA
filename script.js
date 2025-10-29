document.addEventListener("DOMContentLoaded", () => {
  // ====== LOADER ======
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.style.opacity = "0";
    setTimeout(() => (loader.style.display = "none"), 600);
  }, 1500);

  // ====== INICIALIZAR AOS ======
  AOS.init({ duration: 1000, once: true });

  // ====== GRÁFICA ======
  try {
    const ctx = document.getElementById("graficaLenguas").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Náhuatl", "Maya", "Tseltal", "Tsotsil", "Mixteco", "Zapoteco"],
        datasets: [{
          label: "Número de Hablantes (Aprox.)",
          data: [1651000, 774000, 589000, 539000, 526000, 490000],
          backgroundColor: [
            "rgba(217,0,108,0.7)", "rgba(0,139,139,0.7)",
            "rgba(255,117,24,0.7)", "rgba(241,196,15,0.7)",
            "rgba(41,128,185,0.7)", "rgba(142,68,173,0.7)"
          ],
          borderColor: [
            "rgba(217,0,108,1)", "rgba(0,139,139,1)",
            "rgba(255,117,24,1)", "rgba(241,196,15,1)",
            "rgba(41,128,185,1)", "rgba(142,68,173,1)"
          ],
          borderWidth: 1, borderRadius: 5
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  } catch (e) { console.error("Error al crear la gráfica:", e); }

  // ====== CHATBOT ======
  const chatToggle = document.getElementById("chat-toggle");
  const chatContainer = document.getElementById("chat-container");
  const chatClose = document.getElementById("chat-close");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");

  chatToggle.addEventListener("click", () => chatContainer.classList.toggle("hidden"));
  chatClose.addEventListener("click", () => chatContainer.classList.add("hidden"));

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userText = chatInput.value.trim();
    if (userText === "") return;
    addMessage(userText, "user");
    chatInput.value = "";
    addMessage("...", "bot-typing");

    const botResponse = await generarRespuesta(userText);
    chatMessages.querySelector(".bot-typing")?.remove();
    addMessage(botResponse, "bot");
  });

  function addMessage(text, sender) {
    const div = document.createElement("div");
    div.classList.add("chat-message", `${sender}-message`);
    const p = document.createElement("p");
    p.innerHTML = sender === "bot-typing"
      ? '<span class="dot"></span><span class="dot"></span><span class="dot"></span>'
      : text.replace(/\n/g, "<br>");
    div.appendChild(p);
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function generarRespuesta(pregunta) {
    try {
      const response = await fetch("https://lenguas-indigenas.onrender.com/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: pregunta }),
      });
      const data = await response.json();
      return data.reply;
    } catch {
      return "No pude conectarme al servidor 😢";
    }
  }

  // ====== QUIZ ======
  const quizBtns = document.querySelectorAll(".quiz-btn");
  const quizFeedback = document.getElementById("quiz-feedback");
  quizBtns.forEach(btn =>
    btn.addEventListener("click", () => {
      if (btn.dataset.answer === "true") {
        quizFeedback.textContent = "✅ ¡Correcto! El Náhuatl es la más hablada.";
        quizFeedback.style.color = "green";
      } else {
        quizFeedback.textContent = "❌ No, intenta otra vez.";
        quizFeedback.style.color = "red";
      }
    })
  );

  // ====== SOPA DE LETRAS ======
  const canvas = document.getElementById("sopaCanvas");
  const ctx2 = canvas.getContext("2d");
  const sopaReiniciar = document.getElementById("sopaReiniciar");
  function dibujarSopa() {
    ctx2.fillStyle = "#fff";
    ctx2.fillRect(0, 0, canvas.width, canvas.height);
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚ".split("");
    ctx2.fillStyle = "#333";
    ctx2.font = "16px Lato";
    for (let y = 0; y < 10; y++)
      for (let x = 0; x < 10; x++)
        ctx2.fillText(letras[Math.floor(Math.random() * letras.length)], x * 28 + 8, y * 28 + 20);
  }
  sopaReiniciar.addEventListener("click", dibujarSopa);
  dibujarSopa();
});
