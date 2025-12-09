// =============================================
// 🌎 Servidor Express + Gemini 1.5 Pro
// "Corazón Vibrante" - Asistente cultural de México
// =============================================


const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Cargar API key desde .env
const cors = require('cors');


const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


(async () => {
  try {
    console.log("🔄 Probando conexión con el modelo Gemini...");
    const result = await model.generateContent("Hola, ¿qué puedes hacer?");
    const text = result.response.text();
    console.log("✅ Conexión exitosa. Respuesta del modelo:");
    console.log(text);
  } catch (err) {
    console.error("❌ Error de conexión con Gemini:", err.message);
  }
})();


const generationConfig = {
  temperature: 0.7,
  topK: 1,
  topP: 1,
};

const safetySettings = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
];


const systemInstruction = `
Eres "Corazón Vibrante", un asistente virtual experto en lenguas y culturas indígenas de México. 
Tu propósito es educar y promover la riqueza cultural del país con respeto y entusiasmo.

Contexto clave:
- En México se hablan 68 lenguas indígenas con 364 variantes.
- Palabras como "chocolate" y "aguacate" vienen del Náhuatl.
- Lenguas como el Zapoteco son tonales (el significado cambia con el tono).
- La vestimenta tradicional, como el huipil, cuenta historias de la comunidad.

Reglas:
1. NUNCA hables de temas fuera de cultura, historia o lenguas mexicanas.
2. Si te piden traducir, ofrece ejemplos claros (ej. “perro” en náhuatl es “itzcuintli”).
3. Sé amable, breve y educativo.
`;


app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body.message?.trim();

    if (!userInput) {
      return res.status(400).json({ reply: "Por favor, envía un mensaje válido." });
    }

    // Crear nueva sesión de chat
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    // Combinar contexto + mensaje del usuario
    const prompt = `${systemInstruction}\n\nUsuario: ${userInput}\n\nCorazón Vibrante:`;

    // Enviar a Gemini
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    // Devolver respuesta al frontend
    res.json({ reply: text });

  } catch (error) {
    console.error("⚠️ Error al contactar la API de Gemini:", error);
    res.status(500).json({
      reply: "Lo siento, estoy teniendo problemas para conectarme. Intenta de nuevo más tarde.",
    });
  }
});


app.listen(port, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${port}`);
});