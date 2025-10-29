// UN SOLO 'DOMContentLoaded' para todo el archivo
document.addEventListener('DOMContentLoaded', () => {

    // =================================
    // CÓDIGO DE LA GRÁFICA
    // =================================
    try {
        const ctx = document.getElementById('graficaLenguas').getContext('2d');
        const etiquetas = ['Náhuatl', 'Maya', 'Tseltal', 'Tsotsil', 'Mixteco', 'Zapoteco'];
        const datos = [1651000, 774000, 589000, 539000, 526000, 490000];
        const coloresFondo = [
            'rgba(217, 0, 108, 0.7)', 'rgba(0, 139, 139, 0.7)', 'rgba(255, 117, 24, 0.7)',
            'rgba(241, 196, 15, 0.7)', 'rgba(41, 128, 185, 0.7)', 'rgba(142, 68, 173, 0.7)'
        ];
        const coloresBorde = [
            'rgba(217, 0, 108, 1)', 'rgba(0, 139, 139, 1)', 'rgba(255, 117, 24, 1)',
            'rgba(241, 196, 15, 1)', 'rgba(41, 128, 185, 1)', 'rgba(142, 68, 173, 1)'
        ];

        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: etiquetas,
                datasets: [{
                    label: 'Número de Hablantes (Aprox.)',
                    data: datos,
                    backgroundColor: coloresFondo,
                    borderColor: coloresBorde,
                    borderWidth: 1,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, ticks: { font: { family: "'Lato', sans-serif" }} },
                    x: { ticks: { font: { family: "'Lato', sans-serif" }} }
                },
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Principales Lenguas Indígenas en México por Hablantes',
                        font: { size: 18, family: "'Merriweather', serif", weight: 'bold' },
                        color: '#333333'
                    }
                }
            }
        });
    } catch (e) {
        console.error("Error al crear la gráfica:", e);
    }

    // =================================
    // CÓDIGO DEL CHATBOT
    // =================================
    try {
        const chatToggle = document.getElementById('chat-toggle');
        const chatContainer = document.getElementById('chat-container');
        const chatClose = document.getElementById('chat-close');
        const chatForm = document.getElementById('chat-form');
        const chatInput = document.getElementById('chat-input');
        const chatMessages = document.getElementById('chat-messages');

        // 1. Abrir y cerrar la ventana del chat
        chatToggle.addEventListener('click', () => {
            chatContainer.classList.toggle('hidden');
        });

        chatClose.addEventListener('click', () => {
            chatContainer.classList.add('hidden');
        });

        // 2. Manejar el envío del formulario (modificado para manejar 'await')
        chatForm.addEventListener('submit', async (e) => { // <-- Añadir 'async' aquí
            e.preventDefault();
            const userText = chatInput.value.trim();
            if (userText === '') return;
            
            addMessage(userText, 'user');
            chatInput.value = '';

            // Mostrar un indicador de "escribiendo..."
            addMessage("...", 'bot-typing'); // Usaremos esta clase para el indicador

            // Obtenemos la respuesta de la IA
            const botResponse = await generarRespuesta(userText); // Esperamos la respuesta
            
            // Quitamos el indicador de "escribiendo"
            const typingIndicator = chatMessages.querySelector('.bot-typing');
            if(typingIndicator) {
                chatMessages.removeChild(typingIndicator);
            }

            // Añadimos la respuesta real
            addMessage(botResponse, 'bot');
        });

        // 3. Función para añadir mensajes a la ventana
        function addMessage(text, sender) {
            const messageElement = document.createElement('div');
            // 'sender' ahora puede ser 'user', 'bot' o 'bot-typing'
            messageElement.classList.add('chat-message', `${sender}-message`); 
            
            const p = document.createElement('p');
            if (sender === 'bot-typing') {
                p.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
                messageElement.classList.add('typing-indicator'); // Clase especial
            } else {
                // Reemplazar saltos de línea \n con <br> para que se muestren en HTML
                p.innerHTML = text.replace(/\n/g, '<br>'); 
            }
            
            messageElement.appendChild(p);
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // 4. EL "CEREBRO" DEL BOT (Versión 3.0 - Conectado a IA)
        // Esta función llama a nuestro propio servidor (server.js)
        async function generarRespuesta(pregunta) {
            
            try {
                // Llama a nuestro servidor en el puerto 3000
                const response = await fetch('https://lenguas-indigenas.onrender.com/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: pregunta }),
                });

                if (!response.ok) {
                    // Si el servidor falló (ej. 500)
                    throw new Error('El servidor no pudo responder.');
                }

                const data = await response.json();
                return data.reply; // Devuelve la respuesta de la IA

            } catch (error) {
                console.error('Error al llamar al backend:', error);
                // Mensaje de error para el usuario
                return '¡Uy! No pude conectarme con mi cerebro. Revisa que el servidor (server.js) esté corriendo.';
            }
        }
        
        // <-- AQUÍ ESTABA EL CÓDIGO ERRONEO. YA FUE ELIMINADO. -->

    } catch (e) {
        console.error("Error al iniciar el chatbot:", e);
    }

}); // <-- ESTE ES EL ÚNICO CIERRE