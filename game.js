// ===== ИГРОВЫЕ ДАННЫЕ =====

// База заданий по русскому языку
const TASKS = [
    {
        id: 1,
        question: "Выберите правильное написание слова:",
        prompt: "Я хочу поес_дить за городом.",
        options: ["посИдить", "посЕдить"],
        correct: 0,
        explanation: "ПосИдеть (от слова 'сидя'), а посЕдеть - это стать седым.",
        category: "орфография"
    },
    {
        id: 2,
        question: "Где нужна запятая?",
        prompt: "Когда я вернусь домой(1) я сразу начну учить уроки.",
        options: ["Запятая нужна в месте (1)", "Запятая не нужна"],
        correct: 0,
        explanation: "Запятая ставится между частями сложноподчиненного предложения.",
        category: "пунктуация"
    },
    {
        id: 3,
        question: "Выберите правильное написание:",
        prompt: "Я пришёл, что_бы помочь тебе.",
        options: ["чтобы (слитно)", "что бы (раздельно)"],
        correct: 0,
        explanation: "ЧТОБЫ пишется слитно, когда является союзом (можно заменить на 'для того чтобы').",
        category: "орфография"
    },
    {
        id: 4,
        question: "Найдите предложение с ошибкой:",
        options: [
            "Мама сказала, что обед готов.",
            "Придя домой я сразу лёг спать.",
            "Когда закончится урок, мы пойдём гулять.",
            "Я знаю, где находится эта улица."
        ],
        correct: 1,
        explanation: "После деепричастного оборота 'Придя домой' нужна запятая.",
        category: "пунктуация"
    },
    {
        id: 5,
        question: "Выберите правильное окончание:",
        prompt: "Много помидор__ лежало на столе.",
        options: ["помидоров", "помидор"],
        correct: 0,
        explanation: "В родительном падеже множественного числа правильно: помидоров.",
        category: "грамматика"
    },
    {
        id: 6,
        question: "Выберите правильное написание:",
        prompt: "Не_смотря на дождь, мы пошли гулять.",
        options: ["Несмотря (слитно)", "Не смотря (раздельно)"],
        correct: 0,
        explanation: "НЕСМОТРЯ НА пишется слитно, когда является предлогом (можно заменить на 'вопреки').",
        category: "орфография"
    },
    {
        id: 7,
        question: "Где НЕ пишется слитно?",
        options: [
            "(не)пришедший вовремя",
            "(не)законченная работа",
            "совсем (не)интересный",
            "(не)доумевать"
        ],
        correct: 3,
        explanation: "НЕДОУМЕВАТЬ пишется слитно, так как без НЕ не употребляется.",
        category: "орфография"
    },
    {
        id: 8,
        question: "Выберите правильный вариант:",
        prompt: "В течени_ дня я много работал.",
        options: ["в течениИ", "в течениЕ"],
        correct: 1,
        explanation: "В ТЕЧЕНИЕ (когда речь о времени) пишется с Е на конце.",
        category: "орфография"
    },
    {
        id: 9,
        question: "Какое предложение составлено правильно?",
        options: [
            "Мы ходили в магазин, где купили хлеб.",
            "Книга, которую я читал, очень интересная.",
            "Приехав в город, мне стало грустно.",
            "Учитель попросил, чтобы мы сделали домашнее задание."
        ],
        correct: 2,
        explanation: "В предложении 'Приехав в город, мне стало грустно' ошибка: деепричастие относится к 'мне', но подлежащее - 'грустно'. Правильно: 'Приехав в город, я загрустил.'",
        category: "грамматика"
    },
    {
        id: 10,
        question: "Выберите правильное написание:",
        prompt: "Я то_же хочу пойти в кино.",
        options: ["тоже (слитно)", "то же (раздельно)"],
        correct: 0,
        explanation: "ТОЖЕ пишется слитно, когда является союзом (можно заменить на 'также' или 'и').",
        category: "орфография"
    }
];

// NPC персонажи с заданиями (позиции в процентах от размера экрана)
const NPCS = [
    { id: 1, emoji: "👨‍🏫", name: "Учитель Орфографий", xPercent: 15, yPercent: 20, taskId: 1 },
    { id: 2, emoji: "👩‍🎓", name: "Студентка Пунктуация", xPercent: 60, yPercent: 30, taskId: 2 },
    { id: 3, emoji: "🧙‍♂️", name: "Мудрец Грамматиус", xPercent: 35, yPercent: 70, taskId: 3 },
    { id: 4, emoji: "👨‍💼", name: "Профессор Синтаксис", xPercent: 80, yPercent: 50, taskId: 4 },
    { id: 5, emoji: "👩‍🔬", name: "Доктор Морфология", xPercent: 70, yPercent: 80, taskId: 5 },
    { id: 6, emoji: "🧑‍🎨", name: "Художник Слов", xPercent: 20, yPercent: 60, taskId: 6 },
    { id: 7, emoji: "👨‍⚖️", name: "Судья Правописание", xPercent: 50, yPercent: 15, taskId: 7 },
    { id: 8, emoji: "👩‍💻", name: "Программистка Лексика", xPercent: 10, yPercent: 80, taskId: 8 },
    { id: 9, emoji: "🧑‍🍳", name: "Повар Фразеология", xPercent: 85, yPercent: 20, taskId: 9 },
    { id: 10, emoji: "👨‍🚀", name: "Космонавт Стилистика", xPercent: 45, yPercent: 40, taskId: 10 }
];

// ===== ИГРОВОЕ СОСТОЯНИЕ =====

const gameState = {
    player: {
        x: 0,
        y: 0,
        speed: 8
    },
    score: 0,
    level: 1,
    completedTasks: new Set(),
    currentNPC: null,
    keys: {},
    gameMap: {
        width: 0,
        height: 0
    }
};

// ===== ЭЛЕМЕНТЫ DOM =====

const player = document.getElementById('player');
const npcsContainer = document.getElementById('npcs-container');
const dialogBox = document.getElementById('dialog-box');
const taskBox = document.getElementById('task-box');
const victoryBox = document.getElementById('victory-box');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const completedTasksElement = document.getElementById('completed-tasks');
const totalTasksElement = document.getElementById('total-tasks');

// ===== ИНИЦИАЛИЗАЦИЯ ИГРЫ =====

function initGame() {
    // Получение размеров игрового поля
    const gameWorld = document.querySelector('.game-world');
    gameState.gameMap.width = gameWorld.clientWidth;
    gameState.gameMap.height = gameWorld.clientHeight;

    // Установка начальной позиции игрока (в центре)
    gameState.player.x = gameState.gameMap.width / 2;
    gameState.player.y = gameState.gameMap.height / 2;
    updatePlayerPosition();

    // Создание NPC
    createNPCs();

    // Обновление статистики
    updateStats();

    // Обработка клавиатуры
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Обработка изменения размера окна
    window.addEventListener('resize', handleResize);

    // Игровой цикл
    gameLoop();
}

// Обработка изменения размера окна
function handleResize() {
    const gameWorld = document.querySelector('.game-world');
    const oldWidth = gameState.gameMap.width;
    const oldHeight = gameState.gameMap.height;

    gameState.gameMap.width = gameWorld.clientWidth;
    gameState.gameMap.height = gameWorld.clientHeight;

    // Масштабирование позиции игрока
    if (oldWidth > 0 && oldHeight > 0) {
        gameState.player.x = (gameState.player.x / oldWidth) * gameState.gameMap.width;
        gameState.player.y = (gameState.player.y / oldHeight) * gameState.gameMap.height;
        updatePlayerPosition();
    }

    // Пересоздание NPC с новыми позициями
    createNPCs();
}

// ===== СОЗДАНИЕ NPC =====

function createNPCs() {
    npcsContainer.innerHTML = '';

    NPCS.forEach(npc => {
        const npcElement = document.createElement('div');
        npcElement.className = 'npc';
        npcElement.id = `npc-${npc.id}`;
        npcElement.textContent = npc.emoji;

        // Вычисление позиции в пикселях из процентов
        const x = (npc.xPercent / 100) * gameState.gameMap.width;
        const y = (npc.yPercent / 100) * gameState.gameMap.height;

        npcElement.style.left = `${x}px`;
        npcElement.style.top = `${y}px`;

        // Сохранение позиции для проверки взаимодействия
        npcElement.dataset.x = x;
        npcElement.dataset.y = y;

        if (!gameState.completedTasks.has(npc.taskId)) {
            npcElement.classList.add('has-task');
        } else {
            npcElement.classList.add('completed');
        }

        npcsContainer.appendChild(npcElement);
    });
}

// ===== ОБРАБОТКА КЛАВИАТУРЫ =====

function handleKeyDown(e) {
    gameState.keys[e.key] = true;

    // Пробел для взаимодействия с NPC
    if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        checkNPCInteraction();
    }
}

function handleKeyUp(e) {
    gameState.keys[e.key] = false;
}

// ===== ИГРОВОЙ ЦИКЛ =====

function gameLoop() {
    movePlayer();
    requestAnimationFrame(gameLoop);
}

// ===== ПЕРЕМЕЩЕНИЕ ИГРОКА =====

function movePlayer() {
    let dx = 0;
    let dy = 0;

    // Проверка нажатых клавиш
    if (gameState.keys['ArrowLeft'] || gameState.keys['a'] || gameState.keys['A']) {
        dx = -gameState.player.speed;
    }
    if (gameState.keys['ArrowRight'] || gameState.keys['d'] || gameState.keys['D']) {
        dx = gameState.player.speed;
    }
    if (gameState.keys['ArrowUp'] || gameState.keys['w'] || gameState.keys['W']) {
        dy = -gameState.player.speed;
    }
    if (gameState.keys['ArrowDown'] || gameState.keys['s'] || gameState.keys['S']) {
        dy = gameState.player.speed;
    }

    // Обновление позиции с проверкой границ
    gameState.player.x += dx;
    gameState.player.y += dy;

    // Ограничение движения в пределах карты
    gameState.player.x = Math.max(0, Math.min(gameState.gameMap.width - 40, gameState.player.x));
    gameState.player.y = Math.max(0, Math.min(gameState.gameMap.height - 40, gameState.player.y));

    updatePlayerPosition();
}

function updatePlayerPosition() {
    player.style.left = `${gameState.player.x}px`;
    player.style.top = `${gameState.player.y}px`;
}

// ===== ВЗАИМОДЕЙСТВИЕ С NPC =====

function checkNPCInteraction() {
    // Проверяем расстояние до каждого NPC
    for (const npc of NPCS) {
        // Вычисление позиции NPC из процентов
        const npcX = (npc.xPercent / 100) * gameState.gameMap.width;
        const npcY = (npc.yPercent / 100) * gameState.gameMap.height;

        const distance = Math.sqrt(
            Math.pow(gameState.player.x - npcX, 2) +
            Math.pow(gameState.player.y - npcY, 2)
        );

        // Если игрок близко к NPC (менее 100 пикселей для больших экранов)
        const interactionDistance = Math.max(100, gameState.gameMap.width * 0.08);
        if (distance < interactionDistance) {
            startNPCDialog(npc);
            return;
        }
    }
}

function startNPCDialog(npc) {
    gameState.currentNPC = npc;

    const dialogSpeaker = document.getElementById('dialog-speaker');
    const dialogText = document.getElementById('dialog-text');
    const dialogButtons = document.getElementById('dialog-buttons');

    dialogSpeaker.textContent = npc.name;

    if (gameState.completedTasks.has(npc.taskId)) {
        // NPC уже выполнен
        dialogText.textContent = "Спасибо за помощь! Ты отлично справился с заданием!";
        dialogButtons.innerHTML = '<button class="dialog-btn" onclick="closeDialog()">Закрыть</button>';
    } else {
        // NPC с новым заданием
        dialogText.textContent = "Привет! У меня есть задание по русскому языку. Поможешь?";
        dialogButtons.innerHTML = `
            <button class="dialog-btn" onclick="startTask(${npc.taskId})">Конечно!</button>
            <button class="dialog-btn" onclick="closeDialog()">Позже</button>
        `;
    }

    dialogBox.classList.remove('hidden');
}

function closeDialog() {
    dialogBox.classList.add('hidden');
    gameState.currentNPC = null;
}

// ===== ЗАДАНИЯ =====

function startTask(taskId) {
    closeDialog();

    const task = TASKS.find(t => t.id === taskId);
    if (!task) return;

    const taskQuestion = document.getElementById('task-question');
    const taskOptions = document.getElementById('task-options');
    const taskFeedback = document.getElementById('task-feedback');
    const submitButton = document.getElementById('task-submit');

    // Заполнение вопроса
    let questionHTML = task.question;
    if (task.prompt) {
        questionHTML += `<br><br><strong>${task.prompt}</strong>`;
    }
    taskQuestion.innerHTML = questionHTML;

    // Создание вариантов ответа
    taskOptions.innerHTML = '';
    task.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'task-option';
        optionElement.textContent = option;
        optionElement.dataset.index = index;
        optionElement.onclick = () => selectOption(index);
        taskOptions.appendChild(optionElement);
    });

    // Сброс состояния
    taskFeedback.classList.remove('show', 'correct', 'incorrect');
    taskFeedback.textContent = '';
    submitButton.disabled = true;
    submitButton.onclick = () => submitAnswer(taskId);

    taskBox.classList.remove('hidden');
}

let selectedOptionIndex = null;

function selectOption(index) {
    selectedOptionIndex = index;

    // Снять выделение со всех опций
    const options = document.querySelectorAll('.task-option');
    options.forEach(opt => opt.classList.remove('selected'));

    // Выделить выбранную опцию
    options[index].classList.add('selected');

    // Активировать кнопку отправки
    document.getElementById('task-submit').disabled = false;
}

function submitAnswer(taskId) {
    const task = TASKS.find(t => t.id === taskId);
    const taskFeedback = document.getElementById('task-feedback');
    const submitButton = document.getElementById('task-submit');
    const options = document.querySelectorAll('.task-option');

    // Проверка ответа
    const isCorrect = selectedOptionIndex === task.correct;

    // Визуальная обратная связь
    options.forEach((opt, index) => {
        if (index === task.correct) {
            opt.classList.add('correct');
        } else if (index === selectedOptionIndex && !isCorrect) {
            opt.classList.add('incorrect');
        }
    });

    // Отображение результата
    taskFeedback.classList.add('show');
    if (isCorrect) {
        taskFeedback.classList.add('correct');
        taskFeedback.textContent = `✓ Правильно! ${task.explanation}`;

        // Добавление очков
        gameState.score += 10;
        gameState.completedTasks.add(taskId);

        // Проверка уровня
        updateLevel();

        // Обновление NPC
        const npcElement = document.getElementById(`npc-${gameState.currentNPC.id}`);
        if (npcElement) {
            npcElement.classList.remove('has-task');
            npcElement.classList.add('completed');
        }

        // Обновление статистики
        updateStats();

        // Проверка победы
        if (gameState.completedTasks.size === TASKS.length) {
            setTimeout(() => {
                closeTask();
                showVictory();
            }, 2000);
        } else {
            // Изменить кнопку
            submitButton.textContent = 'Продолжить';
            submitButton.onclick = closeTask;
        }
    } else {
        taskFeedback.classList.add('incorrect');
        taskFeedback.textContent = `✗ Неправильно. ${task.explanation}`;

        // Изменить кнопку
        submitButton.textContent = 'Попробовать ещё раз';
        submitButton.onclick = () => retryTask(taskId);
    }
}

function retryTask(taskId) {
    // Сбросить выбор
    selectedOptionIndex = null;

    // Очистить визуальную обратную связь
    const options = document.querySelectorAll('.task-option');
    options.forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
    });

    const taskFeedback = document.getElementById('task-feedback');
    taskFeedback.classList.remove('show', 'correct', 'incorrect');

    const submitButton = document.getElementById('task-submit');
    submitButton.textContent = 'Ответить';
    submitButton.disabled = true;
    submitButton.onclick = () => submitAnswer(taskId);
}

function closeTask() {
    taskBox.classList.add('hidden');
    selectedOptionIndex = null;
}

// ===== ОБНОВЛЕНИЕ СТАТИСТИКИ =====

function updateStats() {
    scoreElement.textContent = gameState.score;
    levelElement.textContent = gameState.level;
    completedTasksElement.textContent = gameState.completedTasks.size;
    totalTasksElement.textContent = TASKS.length;
}

function updateLevel() {
    const newLevel = Math.floor(gameState.completedTasks.size / 3) + 1;
    if (newLevel > gameState.level) {
        gameState.level = newLevel;
        gameState.player.speed += 1; // Увеличение скорости с уровнем
    }
}

// ===== ПОБЕДА =====

function showVictory() {
    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('final-level').textContent = gameState.level;
    victoryBox.classList.remove('hidden');
}

function restartGame() {
    // Сброс состояния
    gameState.score = 0;
    gameState.level = 1;
    gameState.completedTasks.clear();
    gameState.player.x = gameState.gameMap.width / 2;
    gameState.player.y = gameState.gameMap.height / 2;
    gameState.player.speed = 8;
    selectedOptionIndex = null;

    // Обновление UI
    updatePlayerPosition();
    createNPCs();
    updateStats();

    // Закрыть окно победы
    victoryBox.classList.add('hidden');
}

// ===== ЗАПУСК ИГРЫ =====

window.addEventListener('load', initGame);
