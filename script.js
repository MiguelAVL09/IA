// =================================
// Lógica de la Pantalla de Carga
// =================================
window.onload = () => {
    const loader = document.getElementById('loader');
    const pageContent = document.getElementById('page-content');

    // Ocultar el loader
    loader.classList.add('loader-hidden');

    // Mostrar el contenido de la página
    pageContent.classList.add('visible');
    pageContent.classList.remove('hidden-on-load');
};


// 'DOMContentLoaded' se ejecuta cuando el HTML está listo
document.addEventListener('DOMContentLoaded', () => {

    // =================================
    // CÓDIGO DE LA GRÁFICA (Existente)
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
            type: 'bar', data: { labels: etiquetas, datasets: [{ label: 'Número de Hablantes (Aprox.)', data: datos, backgroundColor: coloresFondo, borderColor: coloresBorde, borderWidth: 1, borderRadius: 5 }] },
            options: { responsive: true, scales: { y: { beginAtZero: true, ticks: { font: { family: "'Lato', sans-serif" }} }, x: { ticks: { font: { family: "'Lato', sans-serif" }} } },
                plugins: { legend: { display: false }, title: { display: true, text: 'Principales Lenguas Indígenas en México por Hablantes', font: { size: 18, family: "'Merriweather', serif", weight: 'bold' }, color: '#333333' } }
            }
        });
    } catch (e) { console.error("Error al crear la gráfica:", e); }

    // =================================
    // CÓDIGO DEL CHATBOT (Existente y Corregido)
    // =================================
    try {
        const chatToggle = document.getElementById('chat-toggle');
        const chatContainer = document.getElementById('chat-container');
        const chatClose = document.getElementById('chat-close');
        const chatForm = document.getElementById('chat-form');
        const chatInput = document.getElementById('chat-input');
        const chatMessages = document.getElementById('chat-messages');

        chatToggle.addEventListener('click', () => chatContainer.classList.toggle('hidden'));
        chatClose.addEventListener('click', () => chatContainer.classList.add('hidden'));

        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userText = chatInput.value.trim();
            if (userText === '') return;
            addMessage(userText, 'user');
            chatInput.value = '';
            addMessage("...", 'bot-typing');
            const botResponse = await generarRespuesta(userText);
            const typingIndicator = chatMessages.querySelector('.typing-indicator');
            if (typingIndicator) {
                chatMessages.removeChild(typingIndicator.parentElement);
            }
            addMessage(botResponse, 'bot');
        });

        function addMessage(text, sender) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('chat-message', `${sender}-message`);
            const p = document.createElement('p');
            if (sender === 'bot-typing') {
                p.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
                p.classList.add('typing-indicator');
            } else {
                p.innerHTML = text.replace(/\n/g, '<br>');
            }
            messageElement.appendChild(p);
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        async function generarRespuesta(pregunta) {
            try {
                // RECUERDA: Cambia esto a tu URL de Render cuando lo subas
                const response = await fetch('https://lenguas-indigenas-ia.onrender.com/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: pregunta }),
                });
                if (!response.ok) throw new Error('El servidor no pudo responder.');
                const data = await response.json();
                return data.reply;
            } catch (error) {
                console.error('Error al llamar al backend:', error);
                return '¡Uy! No pude conectarme con mi cerebro. Revisa que el servidor (server.js) esté corriendo.';
            }
        }
    } catch (e) { console.error("Error al iniciar el chatbot:", e); }

    // =================================
    // Lógica del Modal
    // =================================
    try {
        const modalContainer = document.getElementById('modal-container');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalCloseBtn = document.getElementById('modal-close-btn');
        const clickableCards = document.querySelectorAll('.clickable-card');

        // Contenido para cada modal
        const modalContent = {
            'escucha-activa': {
                title: "El Arte de la Escucha Activa",
                body: "La escucha activa en un contexto intercultural no es solo oír, es entender. Significa callar tu propia 'voz' mental que está juzgando o preparando una respuesta. Concéntrate en el lenguaje corporal, las pausas y el tono. No asumas que 'silencio' significa que no tienen nada que decir; puede ser una señal de respeto o reflexión. Haz preguntas abiertas como '¿Puedes contarme más sobre eso?' en lugar de '¿Te refieres a esto?'. La paciencia es tu mejor herramienta."
            },
            'sin-prejuicios': {
                title: "Abrazando la Diversidad: Sin Prejuicios",
                body: "Nuestra cultura nos da 'lentes' con los que vemos el mundo. 'Sin prejuicios' significa reconocer que llevas puestos esos lentes. Por ejemplo, el concepto de 'éxito' occidental (dinero, propiedades) puede ser irrelevante en una comunidad donde el 'éxito' es el bienestar colectivo o el equilibrio con la naturaleza. No veas sus costumbres como 'atrasadas' o 'pintorescas', sino como sistemas de conocimiento tan válidos y complejos como el tuyo."
            },
            'frases-basicas': {
                title: "Pequeñas Palabras, Puentes Gigantes",
                body: "Aprender frases simples es una señal de humildad y respeto. Muestra que valoras su lengua y no esperas que ellos hagan todo el esfuerzo de comunicarse en la tuya. <br><br> <strong>Ejemplos:</strong><br><ul><li><strong>Náhuatl:</strong> <i>Niltze</i> (Hola), <i>Tlazocamati</i> (Gracias)</li><li><strong>Maya:</strong> <i>Ba'ax ka wa'alik'</i> (Hola/¿Qué dices?), <i>Yum bo'otik</i> (Gracias)</li><li><strong>Zapoteco (Valles):</strong> <i>Padiush</i> (Gracias)</li></ul> <br>No te preocupes por la pronunciación perfecta. El esfuerzo es lo que cuenta y, a menudo, será recibido con una sonrisa."
            }
        };

        // Función para abrir el modal
        function openModal(id) {
            const content = modalContent[id];
            if (content) {
                modalTitle.textContent = content.title;
                modalBody.innerHTML = content.body; // Usamos innerHTML para las etiquetas <br>
                modalContainer.classList.remove('hidden');
            }
        }

        // Función para cerrar el modal
        function closeModal() {
            modalContainer.classList.add('hidden');
        }

        // Asignar eventos
        clickableCards.forEach(card => {
            card.addEventListener('click', () => {
                openModal(card.dataset.modalId);
            });
        });

        modalCloseBtn.addEventListener('click', closeModal);
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                closeModal();
            }
        });

    } catch(e) { console.error("Error al iniciar el modal:", e); }

    // =================================
    // Lógica del Quiz
    // =================================
    try {
        const quizData = [
            {
                question: "¿Cuántas lenguas indígenas se hablan en México?",
                options: ["10", "42", "68", "112"],
                answer: "68"
            },
            {
                question: "Palabras como 'chocolate' y 'aguacate' provienen del...",
                options: ["Maya", "Zapoteco", "Mixteco", "Náhuatl"],
                answer: "Náhuatl"
            },
            {
                question: "¿Qué es una lengua 'tonal'?",
                options: ["Una lengua que se canta", "Una lengua donde el tono cambia el significado", "Una lengua sin vocales", "Una lengua que se habla muy fuerte"],
                answer: "Una lengua donde el tono cambia el significado"
            },
            {
                question: "¿Cómo se dice 'gracias' en Náhuatl?",
                options: ["Yum bo'otik", "Tlazocamati", "Padiush", "Arigato"],
                answer: "Tlazocamati"
            }
        ];

        let currentQuestionIndex = 0;
        let score = 0;

        const questionEl = document.getElementById('quiz-question');
        const optionsEl = document.getElementById('quiz-options');
        const feedbackEl = document.getElementById('quiz-feedback');
        const nextBtn = document.getElementById('quiz-next-btn');

        function loadQuestion() {
            feedbackEl.textContent = '';
            nextBtn.classList.add('hidden');
            optionsEl.innerHTML = ''; // Limpiar opciones anteriores

            const currentQuestion = quizData[currentQuestionIndex];
            questionEl.textContent = currentQuestion.question;

            currentQuestion.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.classList.add('quiz-option');
                button.addEventListener('click', selectAnswer);
                optionsEl.appendChild(button);
            });
        }

        function selectAnswer(e) {
            const selectedButton = e.target;
            const correctAnswer = quizData[currentQuestionIndex].answer;

            Array.from(optionsEl.children).forEach(button => {
                button.disabled = true;
                if (button.textContent === correctAnswer) {
                    button.classList.add('correct');
                }
            });

            if (selectedButton.textContent === correctAnswer) {
                feedbackEl.textContent = "¡Correcto! 🎉";
                feedbackEl.style.color = "green";
                score++;
            } else {
                selectedButton.classList.add('incorrect');
                feedbackEl.textContent = `Incorrecto. La respuesta era: ${correctAnswer}`;
                feedbackEl.style.color = "red";
            }

            nextBtn.classList.remove('hidden');
        }

        nextBtn.addEventListener('click', () => {
            currentQuestionIndex++;
            if (currentQuestionIndex < quizData.length) {
                loadQuestion();
            } else {
                questionEl.textContent = "¡Quiz completado!";
                optionsEl.innerHTML = '';
                feedbackEl.textContent = `Tu puntuación fue: ${score} de ${quizData.length}`;
                nextBtn.textContent = "Volver a empezar";
                nextBtn.addEventListener('click', () => {
                    location.reload(); 
                }, { once: true });
            }
        });

        loadQuestion();

    } catch(e) { console.error("Error al iniciar el quiz:", e); }

    // =================================
    // Lógica para Animaciones en Scroll
    // =================================
    try {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Si el elemento está en la vista (intersecting)
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Opcional: dejar de observar el elemento una vez que ya fue animado
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px', // Margen alrededor del viewport
            threshold: 0.1 // El 10% del elemento debe ser visible
        });

        // Observar cada elemento que deba ser animado
        animatedElements.forEach(el => observer.observe(el));

    } catch(e) { console.error("Error al iniciar el observador de animaciones:", e); }

}); // <-- ESTE ES EL ÚNICO CIERRE del 'DOMContentLoaded'