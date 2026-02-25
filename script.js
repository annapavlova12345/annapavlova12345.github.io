// 1. Массив, в котором будут храниться все задачи.
// Каждая задача — это объект с тремя полями:
//   id — уникальный номер (чтобы можно было отличать задачи друг от друга)
//   text — текст задачи
//   completed — true/false (выполнена или нет)
let tasks = [];

// 2. Получаем ссылки на HTML-элементы, с которыми будем работать.
// document.getElementById('...') ищет элемент по его id.
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const clearAllBtn = document.getElementById('clearAllBtn');

// 3. Функция для загрузки задач из localStorage (хранилища браузера)
function loadFromStorage() {
    // Пытаемся получить данные по ключу 'tasks'
    const stored = localStorage.getItem('tasks');
    if (stored) {
        // Если там что-то есть, превращаем JSON-строку обратно в массив
        try {
            tasks = JSON.parse(stored);
        } catch (e) {
            // Если вдруг данные повреждены, начинаем с пустого массива
            tasks = [];
        }
    } else {
        // Если ничего нет, массив пустой
        tasks = [];
    }
}

// 4. Функция для сохранения текущего массива задач в localStorage
function saveToStorage() {
    // JSON.stringify превращает массив в строку, чтобы можно было сохранить
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 5. Функция отрисовки (рендеринга) списка задач на странице
function render() {
    // Очищаем содержимое списка <ul>, чтобы потом заново построить все пункты
    todoList.innerHTML = '';

    // Проходим по каждому элементу массива tasks с помощью forEach
    tasks.forEach(task => {
        // Создаём новый элемент <li>
        const li = document.createElement('li');
        // Добавляем ему класс 'todo-item'
        li.className = 'todo-item';
        // Если задача выполнена, добавляем ещё класс 'completed'
        if (task.completed) {
            li.classList.add('completed');
        }
        // Запоминаем id задачи в специальном атрибуте data-id (пригодится)
        li.dataset.id = task.id;

        // Создаём чекбокс
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed; // ставим галочку, если задача выполнена
        // Вешаем обработчик: при изменении чекбокса вызываем toggleTask с id задачи
        checkbox.addEventListener('change', () => toggleTask(task.id));

        // Создаём span с текстом задачи
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;

        // Создаём кнопку удаления
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '✖'; // крестик
        // При клике удаляем задачу
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        // Добавляем все созданные элементы внутрь <li>
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        // Добавляем готовый <li> в список <ul>
        todoList.appendChild(li);
    });
}

// 6. Функция добавления новой задачи
function addTask(text) {
    // Убираем лишние пробелы в начале и конце
    text = text.trim();
    // Если после обрезки строка пустая — ничего не делаем
    if (text === '') return;

    // Создаём объект новой задачи
    const newTask = {
        id: Date.now(), // текущее время в миллисекундах — отличный уникальный номер
        text: text,
        completed: false
    };

    // Добавляем его в массив
    tasks.push(newTask);
    // Сохраняем обновлённый массив в localStorage
    saveToStorage();
    // Перерисовываем список
    render();
    // Очищаем поле ввода
    taskInput.value = '';
}

// 7. Функция удаления задачи по id
function deleteTask(id) {
    // filter создаёт новый массив, в который попадают только те задачи,
    // у которых id НЕ равен переданному (т.е. удаляем задачу с этим id)
    tasks = tasks.filter(task => task.id !== id);
    saveToStorage();
    render();
}

// 8. Функция переключения состояния задачи (выполнено/не выполнено)
function toggleTask(id) {
    // Ищем задачу с таким id в массиве
    const task = tasks.find(task => task.id === id);
    if (task) {
        // Меняем completed на противоположное
        task.completed = !task.completed;
        saveToStorage();
        render();
    }
}

// 9. Функция очистки всех задач
function clearAll() {
    // Спрашиваем подтверждение у пользователя
    if (confirm('Вы уверены, что хотите удалить все задачи?')) {
        tasks = []; // обнуляем массив
        saveToStorage();
        render();
    }
}

// 10. Навешиваем обработчики событий на кнопки и поле ввода

// При клике на кнопку «Добавить» вызываем addTask с текстом из поля
addBtn.addEventListener('click', () => addTask(taskInput.value));

// При нажатии клавиши в поле ввода
taskInput.addEventListener('keypress', (e) => {
    // Если нажата клавиша Enter (код 'Enter')
    if (e.key === 'Enter') {
        addTask(taskInput.value);
    }
});

// При клике на кнопку «Очистить всё» вызываем clearAll
clearAllBtn.addEventListener('click', clearAll);

// 11. Запуск приложения: загружаем сохранённые задачи и рисуем список
loadFromStorage();
render();