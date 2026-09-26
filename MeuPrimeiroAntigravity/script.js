const STORAGE_KEY = 'meu_dia_tarefas_v3';

const form = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');
const taskCount = document.querySelector('#task-count');
const emptyState = document.querySelector('#empty-state');
const progressCopy = document.querySelector('#progress-copy');
const clearCompletedButton = document.querySelector('#clear-completed');
const filterButtons = document.querySelectorAll('.filter-button');
const dateElement = document.querySelector('#today-date');

let tasks = loadTasks();
let currentFilter = 'all';

dateElement.textContent = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
}).format(new Date());

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const text = taskInput.value.trim();
    if (!text) {
        alert('Digite uma tarefa antes de adicionar.');
        taskInput.focus();
        return;
    }

    tasks.unshift({
        id: createTaskId(),
        text,
        completed: false
    });

    saveTasks();
    taskInput.value = '';
    currentFilter = 'all';
    updateActiveFilter();
    renderTasks();
    taskInput.focus();
});

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        currentFilter = button.dataset.filter;
        updateActiveFilter();
        renderTasks();
    });
});

taskList.addEventListener('change', (event) => {
    if (!event.target.matches('.task-checkbox')) return;

    const task = tasks.find((item) => item.id === event.target.dataset.id);
    if (!task) return;

    task.completed = event.target.checked;
    saveTasks();
    renderTasks();
});

taskList.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('.delete-button');
    if (!deleteButton) return;

    tasks = tasks.filter((task) => task.id !== deleteButton.dataset.id);
    saveTasks();
    renderTasks();
});

clearCompletedButton.addEventListener('click', () => {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    renderTasks();
});

function loadTasks() {
    try {
        const storedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return Array.isArray(storedTasks)
            ? storedTasks
                .filter((task) => task && typeof task.text === 'string')
                .map((task) => ({
                    id: String(task.id ?? createTaskId()),
                    text: task.text,
                    completed: Boolean(task.completed)
                }))
            : [];
    } catch {
        return [];
    }
}

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
        alert('Não foi possível salvar as tarefas neste navegador.');
    }
}

function createTaskId() {
    return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
}

function updateActiveFilter() {
    filterButtons.forEach((button) => {
        const isActive = button.dataset.filter === currentFilter;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
}

function renderTasks() {
    const visibleTasks = tasks.filter((task) => {
        if (currentFilter === 'pending') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    taskList.replaceChildren();

    visibleTasks.forEach((task) => {
        const item = document.createElement('li');
        item.className = `task-item${task.completed ? ' is-completed' : ''}`;

        const checkbox = document.createElement('input');
        checkbox.className = 'task-checkbox';
        checkbox.type = 'checkbox';
        checkbox.checked = Boolean(task.completed);
        checkbox.dataset.id = task.id;
        checkbox.setAttribute('aria-label', `Marcar como ${task.completed ? 'pendente' : 'concluída'}: ${task.text}`);

        const text = document.createElement('span');
        text.className = 'task-text';
        text.textContent = task.text;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.type = 'button';
        deleteButton.dataset.id = task.id;
        deleteButton.textContent = 'Excluir';
        deleteButton.setAttribute('aria-label', `Excluir tarefa: ${task.text}`);

        item.append(checkbox, text, deleteButton);
        taskList.append(item);
    });

    const completedCount = tasks.filter((task) => task.completed).length;
    const pendingCount = tasks.length - completedCount;
    taskCount.textContent = String(tasks.length);
    emptyState.hidden = visibleTasks.length > 0;
    emptyState.querySelector('.empty-title').textContent = tasks.length === 0
        ? 'Tudo começa com uma ideia.'
        : 'Nada por aqui.';
    emptyState.querySelector('.empty-copy').textContent = tasks.length === 0
        ? 'Adicione uma tarefa e tire os planos da cabeça.'
        : 'Experimente escolher outro filtro.';
    progressCopy.textContent = tasks.length === 0
        ? 'Seu dia está só começando.'
        : pendingCount === 0
            ? 'Tudo concluído. Aproveite essa sensação!'
            : `${pendingCount} ${pendingCount === 1 ? 'tarefa pendente' : 'tarefas pendentes'} · ${completedCount} concluída${completedCount === 1 ? '' : 's'}`;
    clearCompletedButton.hidden = completedCount === 0;
}

renderTasks();