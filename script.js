
        // Combos para modo básico (solo golpes 1-6)

        const basicCombos = [
        "1", "2", "3", "4", "5", "6",
        "1-1", "1-2", "2-1", "2-3", "3-2", "4-3",
        "1-1-2", "1-2-1", "1-2-3", "1-2-4", "1-2-5", "1-2-6",
        "2-3-2", "2-3-4", "3-2-3", "3-4-3", "5-6-2",
        "1-1-2-3", "1-2-3-2", "1-2-3-4", "1-2-5-2", "1-2-6-3",
        "2-3-2-3", "2-3-4-2", "3-2-3-2", "3-4-3-2",
        "1-3-2-3", "1-4-3-2", "2-5-2-3", "2-6-3-2",
        "1-1-2-3-2", "1-2-3-2-3", "1-2-3-4-2", "1-2-5-2-3",
        "2-3-2-3-2", "3-2-3-4-2"
        ];


        // Combos para modo avanzado (golpes 1-6 + defensas)

        const advancedCombos = [
        "1", "2", "3", "4", "5", "6",
        "1-1", "1-2", "2-3", "3-2", "1-1-2", "1-2-3",
        "2-3-2", "1-2-3-2", "3-2-3", "1-2-5", "1-2-3-2-3",

        // Bloqueos (B)
        "B-1-2", "1-B-2", "1-2-B-2", "B-2-3", "2-B-3",
        "1-2-B-3-2", "B-1-1-2", "1-1-B-2",
        "B-3-2", "3-B-2", "2-3-B-2",

        // Esquivas (E)
        "E-1-2", "1-E-2", "1-2-E-3", "2-E-3-2",
        "E-2-3", "E-3-2", "3-E-2", "1-2-E-2",
        "1-E-3-2", "E-1-2-3",

        // Contraataques (C)
        "1-2-C", "C-1-2", "2-3-C", "3-2-C",
        "1-2-3-C", "C-3-2", "2-C-3-2",

        // Combinaciones mixtas
        "B-1-2-3", "E-1-2-3", "1-B-3-2", "1-E-3-2",
        "B-1-2-E-3", "E-1-2-B-3", "1-2-E-3-2",
        "1-B-2-E-3", "E-2-3-B-2",

        // Más complejas (fluidez de combate)
        "B-1-1-2-3", "E-1-2-3-2", "1-2-B-3-2",
        "1-2-E-3-2-3", "B-2-3-2-3", "E-3-2-3-2",

        // Ritmo y reacción
        "1-E-1-2", "2-B-2-3", "E-1-2-C",
        "B-1-2-C", "1-2-E-C", "E-2-3-C",

        // Presión + defensa
        "1-1-2-B-3", "1-2-3-E-2", "2-3-2-B-2",
        "3-2-3-E-3", "1-2-5-E-2", "2-3-6-B-2"
        ];

        // Mapeo de números a nombres para la voz
        const numberToWord = {
            "1": "jab",
            "2": "cross",
            "3": "gancho izquierdo",
            "4": "gancho derecho",
            "5": "uppercut izquierdo",
            "6": "uppercut derecho",
            "B": "bloqueo",
            "E": "esquiva",
            "C": "contraataque",
            "-": "y"
        };

        // Mapeo de números a nombres para la voz
        const numbers = {
            "1": "1",
            "2": "2",
            "3": "3",
            "4": "4",
            "5": "5",
            "6": "6",
            "B": "bloqueo",
            "E": "esquiva",
            "C": "contraataque",
            "-": "y"
        };

        let currentRound = 0;
        let totalRounds = 0;
        let roundTime = 0;
        let restTime = 0;
        let comboPause = 0;
        let mode = "normal";
        let voiceType = "numbers";
        let timerInterval;
        let timeLeft = 0;
        let isResting = false;
        let isTraining = false;
        let comboInterval;
        let countdownInterval;
        let combos = [];

        // Función para manejar el menú de tema
        function toggleThemeMenu() {
            const menu = document.getElementById('themeMenu');
            menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
        }

        // Función para establecer el tema
        function setTheme(theme) {
            if (theme === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.body.classList.toggle('light-mode', !prefersDark);
                localStorage.setItem('theme', 'system');
            } else {
                document.body.classList.toggle('light-mode', theme === 'light');
                localStorage.setItem('theme', theme);
            }
            toggleThemeMenu();
            applySystemThemeListener();
        }

        // Aplicar el tema guardado o del sistema al cargar
        function applyTheme() {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            if (savedTheme === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.body.classList.toggle('light-mode', !prefersDark);
            } else {
                document.body.classList.toggle('light-mode', savedTheme === 'light');
            }
            applySystemThemeListener();
        }

        // Escuchar cambios en las preferencias del sistema
        function applySystemThemeListener() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'system') {
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                mediaQuery.addEventListener('change', (e) => {
                    document.body.classList.toggle('light-mode', !e.matches);
                });
            }
        }

        // Función para seleccionar el modo
        function selectMode(selectedMode) {
            mode = selectedMode;
            document.getElementById("mode").value = selectedMode;
            document.querySelectorAll(".mode-selector .selector-option").forEach(el => {
                el.classList.remove("active");
            });
            document.querySelector(`.mode-selector .selector-option[data-mode="${selectedMode}"]`).classList.add("active");
        }

        // Función para seleccionar el tipo de voz
        function selectVoice(selectedVoice) {
            voiceType = selectedVoice;
            document.getElementById("voiceType").value = selectedVoice;
            document.querySelectorAll(".voice-selector .selector-option").forEach(el => {
                el.classList.remove("active");
            });
            document.querySelector(`.voice-selector .selector-option[data-voice="${selectedVoice}"]`).classList.add("active");
        }

        // Función para hablar texto
        function speak(text) {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'es-ES';
                utterance.rate = 1;
                window.speechSynthesis.speak(utterance);
            }
        }

        // Función para convertir combo a texto legible
        function comboToText(combo) {
            if (voiceType === "numbers") {
                //return combo.replace(/-/g, " ");
                return combo.split("-").map(part => numbers[part] || part).join(" ");
            } else {
                return combo.split("-").map(part => numberToWord[part] || part).join(" ");
            }
        }

        // Función para mostrar y decir un combo aleatorio
        function showRandomCombo() {
            if (combos.length === 0) return;
            const randomIndex = Math.floor(Math.random() * combos.length);
            const combo = combos[randomIndex];
            document.getElementById("combo").textContent = combo;
            speak(comboToText(combo));
        }

        // Función para iniciar el entrenamiento
        function startTraining() {
            currentRound = 0;
            totalRounds = parseInt(document.getElementById("rounds").value);
            roundTime = parseInt(document.getElementById("roundTime").value);
            restTime = parseInt(document.getElementById("restTime").value);
            comboPause = parseInt(document.getElementById("comboPause").value);
            mode = document.getElementById("mode").value;
            voiceType = document.getElementById("voiceType").value;

            combos = mode === "normal" ? basicCombos : advancedCombos;

            document.getElementById("setup").classList.add("hidden");
            document.getElementById("training").classList.remove("hidden");
            isTraining = true;
            startRound();
        }

        // Función para detener el entrenamiento
        function stopTraining() {
            clearInterval(timerInterval);
            clearInterval(comboInterval);
            clearInterval(countdownInterval);
            window.speechSynthesis.cancel();
            document.getElementById("setup").classList.remove("hidden");
            document.getElementById("training").classList.add("hidden");
            document.getElementById("countdown").textContent = "";
            isTraining = false;
        }

        // Función para iniciar una ronda
        function startRound() {
            currentRound++;
            isResting = false;
            timeLeft = roundTime;
            document.getElementById("status").textContent = `Ronda ${currentRound} de ${totalRounds}`;
            document.getElementById("timer").textContent = formatTime(timeLeft);
            document.getElementById("combo").textContent = "";

            // Cuenta atrás visual y auditiva (3, 2, 1)
            let count = 3;
            document.getElementById("countdown").textContent = count;
            speak(count.toString());
            countdownInterval = setInterval(() => {
                count--;
                document.getElementById("countdown").textContent = count > 0 ? count : "";
                if (count > 0) {
                    speak(count.toString());
                } else {
                    clearInterval(countdownInterval);
                    document.getElementById("countdown").textContent = "¡YA!";
                    speak("¡YA!");
                    setTimeout(() => {
                        document.getElementById("countdown").textContent = "";
                        startComboTimer();
                        startTimer();
                    }, 500);
                }
            }, 1000);
        }

        // Función para iniciar el temporizador de la ronda
        function startTimer() {
            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                timeLeft--;
                document.getElementById("timer").textContent = formatTime(timeLeft);

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    clearInterval(comboInterval);
                    if (currentRound < totalRounds) {
                        isResting = true;
                        document.getElementById("status").textContent = `Descanso (${restTime} segundos)`;
                        speak(`Descanso. Ronda ${currentRound} terminada. Siguiente ronda en ${restTime} segundos`);

                        setTimeout(() => {
                            startRound();
                        }, restTime * 1000);
                    } else {
                        speak("Entrenamiento completado. ¡Buen trabajo!");
                        setTimeout(() => {
                            stopTraining();
                        }, 5000);
                    }
                }
            }, 1000);
        }

        // Función para iniciar el temporizador de combos
        function startComboTimer() {
            clearInterval(comboInterval);
            showRandomCombo();
            comboInterval = setInterval(() => {
                showRandomCombo();
            }, comboPause * 1000);
        }

        // Función para formatear el tiempo (MM:SS)
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        // Inicializar modo, voz y tema por defecto
        document.addEventListener("DOMContentLoaded", () => {
            // Primero cargamos la configuración si existe
            loadConfiguration();

            selectMode("normal");
            selectVoice("numbers");
            applyTheme();
        });

        // Cerrar el menú de tema al hacer clic fuera
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('themeMenu');
            const toggle = document.querySelector('.theme-toggle');
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                menu.style.display = 'none';
            }
        });

        // Función para guardar la configuración en LocalStorage
        function saveConfiguration() {
            const config = {
                rounds: document.getElementById("rounds").value,
                roundTime: document.getElementById("roundTime").value,
                restTime: document.getElementById("restTime").value,
                comboPause: document.getElementById("comboPause").value,
                mode: document.getElementById("mode").value,
                voiceType: document.getElementById("voiceType").value
            };

            localStorage.setItem('boxingConfig', JSON.stringify(config));
            
            // Feedback visual simple
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = "¡Guardado! ✅";
            setTimeout(() => btn.textContent = originalText, 2000);
        }

        // Función para cargar la configuración guardada
        function loadConfiguration() {
            const savedConfig = localStorage.getItem('boxingConfig');
            if (savedConfig) {
                const config = JSON.parse(savedConfig);
                
                // Aplicar valores a los inputs/selects
                document.getElementById("rounds").value = config.rounds;
                document.getElementById("roundTime").value = config.roundTime;
                document.getElementById("restTime").value = config.restTime;
                document.getElementById("comboPause").value = config.comboPause;
                
                // Aplicar modos y voces visualmente
                selectMode(config.mode);
                selectVoice(config.voiceType);
            }
        }