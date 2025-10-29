// UN SOLO 'DOMContentLoaded' para todo el archivo
document.addEventListener('DOMContentLoaded', () => {

    /* ============================
       UTILIDADES Y CONFIG INICIAL
       ============================ */
    // Año en footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Menu toggle (mobile)
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            // Alternativa simple: despliega <nav> con clase
            const nav = document.querySelector('header nav');
            if (nav.style.display === 'flex') nav.style.display = 'none';
            else nav.style.display = 'flex';
        });
    }

    /* ============================
       PANTALLA DE CARGA (LOADER)
       ============================ */
    const loader = document.getElementById('site-loader');
    const loaderProgress = loader ? loader.querySelector('.loader-progress') : null;

    // Simular progreso y ocultar al terminar carga real
    let progress = 0;
    const fakeProgress = setInterval(() => {
        progress += Math.random() * 18; // incremento variable
        if (progress > 98) progress = 98;
        if (loaderProgress) loaderProgress.style.width = `${Math.floor(progress)}%`;
    }, 300);

    // Cuando todo cargue (o 2.2s), ocultar loader
    window.addEventListener('load', () => {
        clearInterval(fakeProgress);
        if (loaderProgress) loaderProgress.style.width = '100%';
        setTimeout(() => {
            if (loader) {
                loader.setAttribute('aria-hidden', 'true');
                // allow pointer events after fade
                setTimeout(() => loader.style.display = 'none', 600);
            }
        }, 600);
    });

    /* ============================
       CÓDIGO DE LA GRÁFICA
       ============================ */
    try {
        const ctx = document.getElementById('graficaLenguas').getContext('2d');
        const etiquetas = ['Náhuatl', 'Maya', 'Tseltal', 'Tsotsil', 'Mixteco', 'Zapoteco'];
        const datos = [1651000, 774000, 589000, 539000, 526000, 490000];
        const coloresFondo = [
            'rgba(217, 0, 108, 0.8)', 'rgba(0, 139, 139, 0.8)', 'rgba(255, 117, 24, 0.8)',
            'rgba(241, 196, 15, 0.8)', 'rgba(41, 128, 185, 0.8)', 'rgba(142, 68, 173, 0.8)'
        ];
        const coloresBorde = coloresFondo.map(c => c.replace('0.8', '1'));

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: etiquetas,
                datasets: [{
                    label: 'Número de Hablantes (Aprox.)',
                    data: datos,
                    backgroundColor: coloresFondo,
                    borderColor: coloresBorde,
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, ticks: { font: { family: "'Lato', sans-serif" } } },
                    x: { ticks: { font: { family: "'Lato', sans-serif" } } }
                },
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Principales Lenguas Indígenas en México por Hablantes',
                        font: { size: 16, family: "'Merriweather', serif", weight: 'bold' },
                        color: '#333333'
                    }
                }
            }
        });
    } catch (e) {
        console.error("Error al crear la gráfica:", e);
    }

    /* ============================
       CÓDIGO DEL CHATBOT (NO TOCAR LÓGICA)
       ============================ */
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
            // accessibility
            const hidden = chatContainer.classList.contains('hidden');
            chatContainer.setAttribute('aria-hidden', hidden ? 'true' : 'false');
        });

        chatClose.addEventListener('click', () => {
            chatContainer.classList.add('hidden');
            chatContainer.setAttribute('aria-hidden', 'true');
        });

        // 2. Manejar el envío del formulario
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userText = chatInput.value.trim();
            if (userText === '') return;

            addMessage(userText, 'user');
            chatInput.value = '';

            // Mostrar indicador de "escribiendo..."
            addMessage('...', 'bot-typing');

            // Obtenemos la respuesta de la IA (NO MODIFICAR SU LÓGICA)
            const botResponse = await generarRespuesta(userText);

            // Quitamos el indicador de "escribiendo..."
            const typingIndicator = chatMessages.querySelector('.bot-typing');
            if (typingIndicator) chatMessages.removeChild(typingIndicator);

            // Añadimos la respuesta real
            addMessage(botResponse, 'bot');
        });

        // 3. Función para añadir mensajes a la ventana
        function addMessage(text, sender) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('chat-message');

            if (sender === 'user') messageElement.classList.add('user-message');
            else if (sender === 'bot') messageElement.classList.add('bot-message');
            else if (sender === 'bot-typing') {
                messageElement.classList.add('bot-message', 'bot-typing');
                messageElement.innerHTML = '<div class="typing-indicator"><span class="dot"></span> <span class="dot"></span> <span class="dot"></span></div>';
                chatMessages.appendChild(messageElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                return;
            }

            const p = document.createElement('p');
            p.innerHTML = text.replace(/\n/g, '<br>');
            messageElement.appendChild(p);
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // 4. EL "CEREBRO" DEL BOT (NO CAMBIAR)
        async function generarRespuesta(pregunta) {

            try {
                // Llama a nuestro servidor en el puerto 3000
                const response = await fetch('https://lenguas-indigenas-ia.onrender.com/chat', {
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

    } catch (e) {
        console.error("Error al iniciar el chatbot:", e);
    }

    /* ============================
       QUIZ: MINI CUESTIONARIO
       ============================ */
    (function initQuiz() {
        const questions = [
            {
                q: '¿Cuál de estas es una lengua indígena de México?',
                choices: ['Italiano', 'Náhuatl', 'Portugués', 'Finlandés'],
                a: 1
            },
            {
                q: '¿Qué elemento es central en la cosmovisión de muchos pueblos mesoamericanos?',
                choices: ['La computadora', 'El maíz', 'El petróleo', 'La electricidad'],
                a: 1
            },
            {
                q: 'El "huipil" es:',
                choices: ['Un tipo de instrumento musical', 'Un platillo', 'Una prenda tradicional', 'Una danza'],
                a: 2
            }
        ];

        let idx = 0;
        let score = 0;

        const qEl = document.getElementById('quiz-question');
        const choicesEl = document.getElementById('quiz-choices');
        const nextBtn = document.getElementById('quiz-next');
        const feedbackEl = document.getElementById('quiz-feedback');

        function render() {
            const item = questions[idx];
            qEl.textContent = `${idx + 1}. ${item.q}`;
            choicesEl.innerHTML = '';
            item.choices.forEach((c, i) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.textContent = c;
                btn.dataset.index = i;
                btn.addEventListener('click', onChoice);
                choicesEl.appendChild(btn);
            });
            feedbackEl.textContent = `${score}/${questions.length}`;
            nextBtn.disabled = true;
        }

        function onChoice(e) {
            const selected = Number(e.currentTarget.dataset.index);
            const correct = questions[idx].a;
            const buttons = choicesEl.querySelectorAll('button');
            buttons.forEach(b => b.disabled = true);
            if (selected === correct) {
                e.currentTarget.style.background = 'linear-gradient(90deg,#dff7e6,#b8f0c8)';
                score++;
                feedbackEl.textContent = `¡Correcto! ${score}/${questions.length}`;
            } else {
                e.currentTarget.style.background = 'linear-gradient(90deg,#ffdede,#ffbdbd)';
                // Marcar el correcto
                const ok = choicesEl.querySelector(`button[data-index="${correct}"]`);
                if (ok) ok.style.outline = '3px solid rgba(0,139,139,0.12)';
            }
            nextBtn.disabled = false;
        }

        nextBtn.addEventListener('click', () => {
            idx++;
            if (idx >= questions.length) {
                // mostrar resultado
                qEl.textContent = `Resultados: ${score} de ${questions.length}`;
                choicesEl.innerHTML = `<p>¡Buen trabajo! Comparte lo aprendido.</p>`;
                nextBtn.disabled = true;
                nextBtn.textContent = 'Completado';
                feedbackEl.textContent = '';
            } else {
                render();
            }
        });

        // iniciar
        render();
    })();

    /* ============================
       SOPA DE LETRAS (BÁSICA)
       - coloca palabras horizontal/vertical
       - selección por clic: el usuario hace clic en letras en orden para formar palabra
       - cuando se forma palabra correcta, se marca como encontrada
       ============================ */
    (function initWordSearch() {
        const words = ['NAHUATL', 'MAYA', 'ZAPATECO', 'MAIZ', 'HUIPIL', 'TONA'];
        const gridSize = 12;
        const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
        const placements = []; // {word,row,col,dir,len}

        // helpers
        function randInt(max) { return Math.floor(Math.random() * max); }

        // Try to place words (horizontal L->R or vertical T->B)
        for (const word of words) {
            const w = word.toUpperCase();
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < 250) {
                attempts++;
                const dir = Math.random() > 0.5 ? 'H' : 'V';
                if (dir === 'H') {
                    const row = randInt(gridSize);
                    const col = randInt(gridSize - w.length + 1);
                    // check collision (allow same letters)
                    let ok = true;
                    for (let i = 0; i < w.length; i++) {
                        const cur = grid[row][col + i];
                        if (cur !== '' && cur !== w[i]) { ok = false; break; }
                    }
                    if (!ok) continue;
                    for (let i = 0; i < w.length; i++) grid[row][col + i] = w[i];
                    placements.push({word:w, row, col, dir, len:w.length});
                    placed = true;
                } else {
                    const col = randInt(gridSize);
                    const row = randInt(gridSize - w.length + 1);
                    let ok = true;
                    for (let i = 0; i < w.length; i++) {
                        const cur = grid[row + i][col];
                        if (cur !== '' && cur !== w[i]) { ok = false; break; }
                    }
                    if (!ok) continue;
                    for (let i = 0; i < w.length; i++) grid[row + i][col] = w[i];
                    placements.push({word:w, row, col, dir, len:w.length});
                    placed = true;
                }
            }
            if (!placed) {
                console.warn('No se pudo colocar:', word);
            }
        }

        // fill remaining with random letters (A-Z)
        const letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (!grid[r][c]) grid[r][c] = letters.charAt(randInt(letters.length));
            }
        }

        // Render grid
        const gridEl = document.getElementById('wordsearch-grid');
        const wordListEl = document.getElementById('word-list');
        gridEl.innerHTML = '';
        wordListEl.innerHTML = '';

        // create cells
        const cells = []; // refs to elements
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const span = document.createElement('div');
                span.className = 'ws-cell';
                span.dataset.r = r;
                span.dataset.c = c;
                span.textContent = grid[r][c];
                gridEl.appendChild(span);
                cells.push(span);
            }
        }

        // create word list
        const foundWords = new Set();
        for (const pl of placements) {
            const li = document.createElement('li');
            li.textContent = pl.word;
            li.dataset.word = pl.word;
            wordListEl.appendChild(li);
        }

        // Selection logic: user clicks letters in order to form word
        let selection = [];
        function resetSelectionVisual() {
            selection.forEach(el => el.classList.remove('sel'));
        }
        function clearSelection() {
            resetSelectionVisual();
            selection = [];
        }

        gridEl.addEventListener('click', (ev) => {
            const cell = ev.target.closest('.ws-cell');
            if (!cell) return;
            // if already found, ignore
            if (cell.classList.contains('found')) return;

            // toggle selection: if clicked same as last, remove last
            const idx = selection.indexOf(cell);
            if (idx !== -1 && idx === selection.length - 1) {
                cell.classList.remove('sel');
                selection.pop();
            } else {
                // add cell
                selection.push(cell);
                cell.classList.add('sel');
            }
        });

        // keyboard accessibility: Enter = check
        gridEl.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter') checkSelection();
            if (ev.key === 'Escape') clearSelection();
        });

        // Check selection function
        function checkSelection() {
            if (selection.length === 0) return;
            const word = selection.map(s => s.textContent).join('');
            const reversed = selection.map(s => s.textContent).reverse().join('');
            // check against remaining words
            let matched = null;
            for (const pl of placements) {
                if (foundWords.has(pl.word)) continue;
                if (pl.word === word || pl.word === reversed) {
                    matched = pl.word; break;
                }
            }
            if (matched) {
                // mark cells as found
                selection.forEach(s => { s.classList.add('found'); s.classList.remove('sel'); });
                foundWords.add(matched);
                // mark in list
                const li = wordListEl.querySelector(`li[data-word="${matched}"]`);
                if (li) li.classList.add('found');
                // feedback: hint area
                const hint = document.getElementById('ws-hint');
                hint.textContent = `¡Encontraste "${matched}"! Palabras restantes: ${placements.length - foundWords.size}`;
                // clear selection
                selection = [];
                // victory?
                if (foundWords.size === placements.length) {
                    hint.textContent = '¡Felicidades! Encontraste todas las palabras 🎉';
                }
            } else {
                // small feedback for wrong selection
                const hint = document.getElementById('ws-hint');
                hint.textContent = 'No coincide. Intenta otra combinación. (Presiona ESC para limpiar)';
                // flash wrong visuals
                selection.forEach(s => {
                    s.classList.add('wrong');
                    setTimeout(() => s.classList.remove('wrong'), 600);
                });
                setTimeout(() => clearSelection(), 600);
            }
        }

        // Control buttons
        document.getElementById('ws-reset').addEventListener('click', () => {
            // simply reload the page part: regenerate by reloading script
            // Easiest: reload full page to get new puzzle
            window.location.reload();
        });

        // add a 'Check' button inline for discoverability
        const checkBtn = document.createElement('button');
        checkBtn.textContent = 'Comprobar selección';
        checkBtn.className = 'btn-secondary';
        checkBtn.style.marginTop = '8px';
        checkBtn.addEventListener('click', checkSelection);
        document.getElementById('wordsearch-area').appendChild(checkBtn);

    })();

    /* ============================
       Accessibility tweaks: keyboard for wordsearch and focus outlines
       ============================ */
    // Allow focusing grid for keyboard events
    const wsGrid = document.getElementById('wordsearch-grid');
    if (wsGrid) wsGrid.setAttribute('tabindex', '0');

}); // fin DOMContentLoaded
