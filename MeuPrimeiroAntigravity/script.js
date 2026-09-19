/**
 * MEU DIA PRO ✨ - Suíte de Produtividade & Gestão de Tarefas
 * Arquitetura Modular em Vanilla JavaScript (Senior Web Dev Pattern)
 */

// =========================================================
// 1. SOUND FX ENGINE (Sintetizador Web Audio API)
// =========================================================
const SoundFX = {
    audioCtx: null,
    isMuted: localStorage.getItem('meu_dia_muted') === 'true',

    init() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioCtx = new AudioContext();
            }
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    },

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('meu_dia_muted', this.isMuted);
        this.updateSoundIcon();
        Toast.show(this.isMuted ? 'Áudio desativado 🔇' : 'Áudio ativado 🔊', 'info');
    },

    updateSoundIcon() {
        const soundIcon = document.getElementById('sound-icon');
        if (soundIcon) {
            soundIcon.className = this.isMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
        }
    },

    // Som de conclusão de tarefa (Acorde C-Major arpegiado suave)
    playSuccess() {
        if (this.isMuted) return;
        this.init();
        if (!this.audioCtx) return;

        const now = this.audioCtx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        notes.forEach((freq, i) => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.07);

            gain.gain.setValueAtTime(0.001, now + i * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.12, now + i * 0.07 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.35);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(now + i * 0.07);
            osc.stop(now + i * 0.07 + 0.4);
        });
    },

    // Som ao adicionar tarefa (Pop suave)
    playPop() {
        if (this.isMuted) return;
        this.init();
        if (!this.audioCtx) return;

        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.13);
    },

    // Som de exclusão de tarefa (Whoosh sutil descendente)
    playDelete() {
        if (this.isMuted) return;
        this.init();
        if (!this.audioCtx) return;

        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.17);
    },

    // Som ao finalizar Pomodoro (Campainha harmônica suave)
    playTimerEnd() {
        if (this.isMuted) return;
        this.init();
        if (!this.audioCtx) return;

        const now = this.audioCtx.currentTime;
        [880, 1174.66].forEach((freq) => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(now);
            osc.stop(now + 1.25);
        });
    }
};

// =========================================================
// 2. TOAST NOTIFICATION SYSTEM
// =========================================================
const Toast = {
    container: document.getElementById('toast-container'),

    show(message, type = 'info', duration = 3200) {
        if (!this.container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icons = {
            success: 'fa-solid fa-circle-check',
            error: 'fa-solid fa-triangle-exclamation',
            info: 'fa-solid fa-circle-info'
        };

        toast.innerHTML = `
            <i class="${icons[type] || icons.info} toast-icon"></i>
            <div class="toast-content">${message}</div>
            <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
        `;

        toast.addEventListener('click', () => this.dismiss(toast));
        this.container.appendChild(toast);

        setTimeout(() => {
            this.dismiss(toast);
        }, duration);
    },

    dismiss(toast) {
        if (!toast || toast.classList.contains('toast-out')) return;
        toast.classList.add('toast-out');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
};

// =========================================================
// 3. THEME MANAGER
// =========================================================
const ThemeManager = {
    selectEl: document.getElementById('theme-select'),

    init() {
        const savedTheme = localStorage.getItem('meu_dia_theme') || 'aurora';
        this.applyTheme(savedTheme);

        if (this.selectEl) {
            this.selectEl.value = savedTheme;
            this.selectEl.addEventListener('change', (e) => {
                this.applyTheme(e.target.value);
            });
        }
    },

    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('meu_dia_theme', theme);
    }
};

// =========================================================
// 4. POMODORO FOCUS TIMER
// =========================================================
const Pomodoro = {
    panel: document.getElementById('pomodoro-panel'),
    toggleBtn: document.getElementById('pomodoro-toggle-btn'),
    closeBtn: document.getElementById('pomodoro-close-btn'),
    displayEl: document.getElementById('pomodoro-display'),
    startBtn: document.getElementById('pomodoro-start-btn'),
    resetBtn: document.getElementById('pomodoro-reset-btn'),
    playIcon: document.getElementById('pomodoro-play-icon'),
    modeBtns: document.querySelectorAll('.pomodoro-mode-btn'),

    modes: {
        focus: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60
    },

    currentMode: 'focus',
    timeLeft: 25 * 60,
    isRunning: false,
    intervalId: null,

    init() {
        this.updateDisplay();

        this.toggleBtn?.addEventListener('click', () => {
            this.panel.classList.toggle('hidden');
            this.toggleBtn.classList.toggle('active');
        });

        this.closeBtn?.addEventListener('click', () => {
            this.panel.classList.add('hidden');
            this.toggleBtn.classList.remove('active');
        });

        this.startBtn?.addEventListener('click', () => this.toggleStart());
        this.resetBtn?.addEventListener('click', () => this.reset());

        this.modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.setMode(btn.dataset.mode);
            });
        });
    },

    setMode(mode) {
        if (!this.modes[mode]) return;
        this.pause();
        this.currentMode = mode;
        this.timeLeft = this.modes[mode];

        this.modeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        this.updateDisplay();
    },

    toggleStart() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    },

    start() {
        SoundFX.init();
        this.isRunning = true;
        this.playIcon.className = 'fa-solid fa-pause';
        this.startBtn.classList.add('active');

        this.intervalId = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();

            if (this.timeLeft <= 0) {
                this.complete();
            }
        }, 1000);
    },

    pause() {
        this.isRunning = false;
        clearInterval(this.intervalId);
        this.playIcon.className = 'fa-solid fa-play';
        this.startBtn.classList.remove('active');
    },

    reset() {
        this.pause();
        this.timeLeft = this.modes[this.currentMode];
        this.updateDisplay();
    },

    complete() {
        this.pause();
        SoundFX.playTimerEnd();

        if (typeof confetti === 'function') {
            confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        }

        const msg = this.currentMode === 'focus' 
            ? 'Sessão de foco concluída! Hora de uma pausa revigorante ☕' 
            : 'Pausa encerrada! Pronto para a próxima sessão de foco? 🚀';
        Toast.show(msg, 'success', 5000);

        this.reset();
    },

    updateDisplay() {
        const mins = Math.floor(this.timeLeft / 60);
        const secs = this.timeLeft % 60;
        const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        this.displayEl.textContent = formatted;
        document.title = this.isRunning ? `(${formatted}) Meu Dia Pro ✨` : 'Meu Dia Pro ✨ | Suíte de Produtividade & Foco';
    }
};

// =========================================================
// 5. TASK MANAGER (CRUD, DRAG & DROP, EDIT, SEARCH & STORAGE)
// =========================================================
const TaskManager = {
    STORAGE_KEY: 'meu_dia_tarefas_v3',
    LEGACY_V2_KEY: 'meu_dia_tarefas_v2',
    LEGACY_V1_KEY: 'meu_dia_tarefas',

    categories: {
        pessoal: { label: 'Pessoal', color: '#10b981', bg: '#d1fae5' },
        trabalho: { label: 'Trabalho', color: '#6366f1', bg: '#ede9fe' },
        urgente: { label: 'Urgente', color: '#ef4444', bg: '#fee2e2' },
        estudo: { label: 'Estudo', color: '#f59e0b', bg: '#fef3c7' },
        lazer: { label: 'Lazer', color: '#ec4899', bg: '#fce7f3' }
    },

    tasks: [],
    currentCategory: 'pessoal',
    currentFilter: 'all',
    currentSort: 'manual',
    searchQuery: '',
    draggedIndex: null,

    // Elementos DOM
    taskInput: document.getElementById('task-input'),
    taskPriority: document.getElementById('task-priority'),
    taskDueDate: document.getElementById('task-due-date'),
    addBtn: document.getElementById('add-btn'),
    taskList: document.getElementById('task-list'),
    emptyState: document.getElementById('empty-state'),
    searchInput: document.getElementById('search-input'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    sortSelect: document.getElementById('sort-select'),
    progressFill: document.getElementById('progress-fill'),
    progressPercentage: document.getElementById('progress-percentage'),
    progressStats: document.getElementById('progress-stats'),
    progressText: document.getElementById('progress-text'),
    tasksSummaryEl: document.getElementById('tasks-summary'),
    clearCompletedBtn: document.getElementById('clear-completed-btn'),
    categoryChips: document.querySelectorAll('.category-chip'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    countAll: document.getElementById('count-all'),
    countPending: document.getElementById('count-pending'),
    countCompleted: document.getElementById('count-completed'),

    init() {
        this.loadTasks();
        this.bindEvents();
        this.render();
    },

    loadTasks() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            try {
                this.tasks = JSON.parse(saved);
            } catch (e) {
                this.tasks = [];
            }
        } else {
            // Migração de versões legadas
            this.tasks = this.migrateLegacyData();
            this.save();
        }

        // Garante que todas as tarefas possuem os campos modernos
        this.tasks.forEach((t, i) => {
            if (!t.id) t.id = Date.now() + i;
            if (!t.priority) t.priority = 'medium';
            if (t.dueDate === undefined) t.dueDate = null;
            if (t.order === undefined) t.order = i;
        });
    },

    migrateLegacyData() {
        const v2 = localStorage.getItem(this.LEGACY_V2_KEY);
        if (v2) {
            try {
                const parsed = JSON.parse(v2);
                if (Array.isArray(parsed)) return parsed;
            } catch (e) {}
        }
        const v1 = localStorage.getItem(this.LEGACY_V1_KEY);
        if (v1) {
            try {
                const parsed = JSON.parse(v1);
                if (Array.isArray(parsed)) {
                    return parsed.map((item, i) => ({
                        id: Date.now() + i,
                        text: typeof item === 'string' ? item : item.text,
                        category: 'pessoal',
                        priority: 'medium',
                        dueDate: null,
                        completed: false,
                        createdAt: new Date().toISOString(),
                        order: i
                    }));
                }
            } catch (e) {}
        }
        return [];
    },

    save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
    },

    bindEvents() {
        // Adicionar tarefa
        this.addBtn?.addEventListener('click', () => this.addTask());
        this.taskInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addTask();
            }
        });

        // Seleção de Categoria
        this.categoryChips.forEach(chip => {
            chip.addEventListener('click', () => {
                this.categoryChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.currentCategory = chip.dataset.category;
            });
        });

        // Filtros (Todas, Pendentes, Feitas)
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.render();
            });
        });

        // Ordenação
        this.sortSelect?.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.render();
        });

        // Busca Rápida
        this.searchInput?.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase().trim();
            this.clearSearchBtn?.classList.toggle('hidden', this.searchQuery === '');
            this.render();
        });

        this.clearSearchBtn?.addEventListener('click', () => {
            this.searchInput.value = '';
            this.searchQuery = '';
            this.clearSearchBtn.classList.add('hidden');
            this.searchInput.focus();
            this.render();
        });

        // Atalho de Teclado Global (Ctrl+K ou Cmd+K para busca)
        window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                this.searchInput?.focus();
            }
        });

        // Limpar Concluídas
        this.clearCompletedBtn?.addEventListener('click', () => this.clearCompleted());
    },

    addTask() {
        const text = this.taskInput.value.trim();

        if (text === '') {
            Toast.show('Por favor, digite uma tarefa antes de adicionar!', 'error');
            this.taskInput.focus();
            return;
        }

        const newTask = {
            id: Date.now(),
            text: text,
            category: this.currentCategory,
            priority: this.taskPriority.value,
            dueDate: this.taskDueDate.value || null,
            completed: false,
            createdAt: new Date().toISOString(),
            order: 0
        };

        // Desloca a ordem dos outros itens
        this.tasks.forEach(t => t.order++);
        this.tasks.unshift(newTask);

        this.save();
        SoundFX.playPop();
        Toast.show('Tarefa adicionada com sucesso!', 'success');

        this.taskInput.value = '';
        this.taskDueDate.value = '';
        this.taskInput.focus();
        this.render();
    },

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        task.completed = !task.completed;
        this.save();
        this.render();

        if (task.completed) {
            SoundFX.playSuccess();
            StatsManager.recordCompletion();

            // Confetes vibrantes
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 55,
                    spread: 65,
                    origin: { y: 0.7 }
                });

                // Se todas forem concluídas: celebração épica
                const remaining = this.tasks.filter(t => !t.completed).length;
                if (remaining === 0 && this.tasks.length > 0) {
                    setTimeout(() => {
                        confetti({
                            particleCount: 140,
                            spread: 100,
                            origin: { y: 0.55 }
                        });
                        Toast.show('🎉 Extraordinário! Você concluiu 100% das suas metas hoje!', 'success', 4500);
                    }, 250);
                }
            }
        }
    },

    deleteTask(id) {
        SoundFX.playDelete();
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.save();
        this.render();
        Toast.show('Tarefa excluída!', 'info');
    },

    // Edição Inline com duplo clique ou clique no botão
    startEdit(task, taskTextElement, detailsContainer) {
        const currentText = task.text;
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'task-inline-input';
        input.value = currentText;
        input.maxLength = 120;

        taskTextElement.style.display = 'none';
        detailsContainer.insertBefore(input, detailsContainer.firstChild);
        input.focus();
        input.select();

        const saveEdit = () => {
            const newText = input.value.trim();
            if (newText !== '' && newText !== currentText) {
                task.text = newText;
                this.save();
                Toast.show('Tarefa atualizada!', 'success');
            }
            this.render();
        };

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            } else if (e.key === 'Escape') {
                this.render();
            }
        });

        input.addEventListener('blur', saveEdit);
    },

    clearCompleted() {
        const completed = this.tasks.filter(t => t.completed).length;
        if (completed === 0) {
            Toast.show('Nenhuma tarefa concluída para limpar!', 'info');
            return;
        }

        if (confirm(`Deseja remover as ${completed} tarefas concluídas?`)) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.save();
            this.render();
            SoundFX.playDelete();
            Toast.show('Tarefas concluídas removidas!', 'info');
        }
    },

    getFilteredAndSortedTasks() {
        // 1. Filtro de abas
        let list = this.tasks.filter(t => {
            if (this.currentFilter === 'pending') return !t.completed;
            if (this.currentFilter === 'completed') return t.completed;
            return true;
        });

        // 2. Filtro de busca
        if (this.searchQuery) {
            list = list.filter(t => 
                t.text.toLowerCase().includes(this.searchQuery) ||
                t.category.toLowerCase().includes(this.searchQuery) ||
                t.priority.toLowerCase().includes(this.searchQuery)
            );
        }

        // 3. Ordenação
        list = [...list].sort((a, b) => {
            if (this.currentSort === 'priority') {
                const map = { high: 3, medium: 2, low: 1 };
                return map[b.priority] - map[a.priority];
            }
            if (this.currentSort === 'dueDate') {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
            if (this.currentSort === 'newest') {
                return (b.id || 0) - (a.id || 0);
            }
            // Ordem manual padrão
            return (a.order || 0) - (b.order || 0);
        });

        return list;
    },

    formatDueDate(dateStr) {
        if (!dateStr) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [y, m, d] = dateStr.split('-').map(Number);
        const dueDate = new Date(y, m - 1, d);
        dueDate.setHours(0, 0, 0, 0);

        const diffDays = Math.round((dueDate - today) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { label: `Atrasada (${Math.abs(diffDays)}d)`, type: 'overdue' };
        } else if (diffDays === 0) {
            return { label: 'Hoje', type: 'today' };
        } else if (diffDays === 1) {
            return { label: 'Amanhã', type: 'future' };
        } else {
            return { label: `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`, type: 'future' };
        }
    },

    render() {
        const filteredTasks = this.getFilteredAndSortedTasks();
        this.taskList.innerHTML = '';

        if (filteredTasks.length === 0) {
            this.emptyState.style.display = 'block';
        } else {
            this.emptyState.style.display = 'none';
        }

        filteredTasks.forEach((task, index) => {
            const categoryData = this.categories[task.category] || this.categories.pessoal;
            const dueInfo = this.formatDueDate(task.dueDate);

            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.style.borderLeftColor = categoryData.color;
            li.setAttribute('draggable', this.currentSort === 'manual');
            li.dataset.id = task.id;

            // Suporte a Drag & Drop Nativo
            this.bindDragEvents(li, index);

            // Bloco Esquerdo
            const leftDiv = document.createElement('div');
            leftDiv.className = 'task-left';

            // Alça de arrastar
            if (this.currentSort === 'manual') {
                const handle = document.createElement('span');
                handle.className = 'drag-handle';
                handle.innerHTML = '<i class="fa-solid fa-grip-vertical"></i>';
                handle.title = 'Arraste para reordenar';
                leftDiv.appendChild(handle);
            }

            // Checkbox
            const checkbox = document.createElement('button');
            checkbox.type = 'button';
            checkbox.className = 'custom-checkbox';
            checkbox.setAttribute('aria-label', task.completed ? 'Desmarcar tarefa' : 'Concluir tarefa');
            checkbox.innerHTML = '<i class="fa-solid fa-check"></i>';
            checkbox.addEventListener('click', () => this.toggleTask(task.id));
            leftDiv.appendChild(checkbox);

            // Detalhes de texto e badges
            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'task-details';

            const spanText = document.createElement('span');
            spanText.className = 'task-text';
            spanText.textContent = task.text;
            spanText.title = 'Clique duplo para editar';
            spanText.addEventListener('dblclick', () => this.startEdit(task, spanText, detailsDiv));
            detailsDiv.appendChild(spanText);

            // Badges (Categoria + Prioridade + Prazo)
            const badgesDiv = document.createElement('div');
            badgesDiv.className = 'task-badges';

            // Categoria
            const catBadge = document.createElement('span');
            catBadge.className = 'task-badge';
            catBadge.style.backgroundColor = categoryData.bg;
            catBadge.style.color = categoryData.color;
            catBadge.textContent = categoryData.label;
            badgesDiv.appendChild(catBadge);

            // Prioridade
            const prioMap = {
                high: { label: 'Alta', icon: 'fa-solid fa-fire', class: 'badge-prio-high' },
                medium: { label: 'Média', icon: 'fa-solid fa-bolt', class: 'badge-prio-medium' },
                low: { label: 'Baixa', icon: 'fa-solid fa-seedling', class: 'badge-prio-low' }
            };
            const prioData = prioMap[task.priority] || prioMap.medium;
            const prioBadge = document.createElement('span');
            prioBadge.className = `task-badge ${prioData.class}`;
            prioBadge.innerHTML = `<i class="${prioData.icon}"></i> ${prioData.label}`;
            badgesDiv.appendChild(prioBadge);

            // Prazo
            if (dueInfo) {
                const dueBadge = document.createElement('span');
                dueBadge.className = `task-badge badge-due-${dueInfo.type}`;
                dueBadge.innerHTML = `<i class="fa-regular fa-clock"></i> ${dueInfo.label}`;
                badgesDiv.appendChild(dueBadge);
            }

            detailsDiv.appendChild(badgesDiv);
            leftDiv.appendChild(detailsDiv);

            // Ações: Botão Editar + Botão Excluir
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'task-actions';

            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'btn-icon-action';
            editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
            editBtn.title = 'Editar tarefa';
            editBtn.addEventListener('click', () => this.startEdit(task, spanText, detailsDiv));

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'btn-icon-action btn-delete-task';
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            deleteBtn.title = 'Excluir tarefa';
            deleteBtn.addEventListener('click', () => {
                li.style.transform = 'translateX(30px)';
                li.style.opacity = '0';
                setTimeout(() => this.deleteTask(task.id), 200);
            });

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);

            li.appendChild(leftDiv);
            li.appendChild(actionsDiv);
            this.taskList.appendChild(li);
        });

        this.updateStats();
    },

    bindDragEvents(li, index) {
        li.addEventListener('dragstart', (e) => {
            this.draggedIndex = index;
            li.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        li.addEventListener('dragend', () => {
            li.classList.remove('dragging');
            document.querySelectorAll('.task-item').forEach(el => el.classList.remove('drag-over'));
        });

        li.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            li.classList.add('drag-over');
        });

        li.addEventListener('dragleave', () => {
            li.classList.remove('drag-over');
        });

        li.addEventListener('drop', (e) => {
            e.preventDefault();
            li.classList.remove('drag-over');

            if (this.draggedIndex === null || this.draggedIndex === index) return;

            // Reordena na lista
            const currentList = this.getFilteredAndSortedTasks();
            const draggedItem = currentList[this.draggedIndex];
            const targetItem = currentList[index];

            // Troca de ordens
            const oldOrder = draggedItem.order;
            draggedItem.order = targetItem.order;
            targetItem.order = oldOrder;

            this.tasks.sort((a, b) => a.order - b.order);
            this.save();
            this.render();
            Toast.show('Ordem atualizada!', 'info', 1500);
        });
    },

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

        this.progressFill.style.width = `${percent}%`;
        this.progressPercentage.textContent = `${percent}%`;
        this.progressStats.textContent = `${completed} de ${total} tarefas concluídas`;

        this.countAll.textContent = total;
        this.countPending.textContent = pending;
        this.countCompleted.textContent = completed;

        this.tasksSummaryEl.textContent = `${total} tarefas registradas`;

        if (total === 0) {
            this.progressText.textContent = 'Adicione uma meta para começar seu dia!';
        } else if (percent === 100) {
            this.progressText.textContent = '🎉 Dia 100% vencido! Parabéns pelo foco!';
        } else if (percent >= 50) {
            this.progressText.textContent = 'Mais da metade superada, mantenha o ritmo! 🚀';
        } else {
            this.progressText.textContent = 'Começo consistente! Avance passo a passo 💪';
        }
    }
};

// =========================================================
// 6. STREAK & PRODUCTIVITY TRACKER
// =========================================================
const StatsManager = {
    STREAK_KEY: 'meu_dia_streak_days',
    LAST_DATE_KEY: 'meu_dia_last_active_date',

    init() {
        this.checkStreak();
    },

    recordCompletion() {
        const todayStr = new Date().toISOString().split('T')[0];
        const lastDate = localStorage.getItem(this.LAST_DATE_KEY);

        if (lastDate === todayStr) {
            // Já registrou hoje
            return;
        }

        let streak = parseInt(localStorage.getItem(this.STREAK_KEY) || '0', 10);

        if (lastDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastDate === yesterdayStr) {
                streak++;
            } else {
                streak = 1;
            }
        } else {
            streak = 1;
        }

        localStorage.setItem(this.STREAK_KEY, streak);
        localStorage.setItem(this.LAST_DATE_KEY, todayStr);
        this.updateStreakDisplay(streak);
    },

    checkStreak() {
        const streak = parseInt(localStorage.getItem(this.STREAK_KEY) || '1', 10);
        this.updateStreakDisplay(streak);
    },

    updateStreakDisplay(streak) {
        const el = document.getElementById('streak-count');
        if (el) el.textContent = streak;
    }
};

// =========================================================
// 7. BACKUP, EXPORT & IMPORT MANAGER
// =========================================================
const BackupManager = {
    menuBtn: document.getElementById('backup-menu-btn'),
    dropdown: document.getElementById('backup-dropdown'),
    exportJsonBtn: document.getElementById('export-json-btn'),
    exportTxtBtn: document.getElementById('export-txt-btn'),
    importInput: document.getElementById('import-json-input'),

    init() {
        this.menuBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.dropdown?.classList.toggle('show');
        });

        window.addEventListener('click', () => {
            this.dropdown?.classList.remove('show');
        });

        this.exportJsonBtn?.addEventListener('click', () => this.exportJSON());
        this.exportTxtBtn?.addEventListener('click', () => this.exportTXT());
        this.importInput?.addEventListener('change', (e) => this.importJSON(e));
    },

    exportJSON() {
        const data = {
            appName: 'Meu Dia Pro',
            version: '3.0',
            exportedAt: new Date().toISOString(),
            tasks: TaskManager.tasks
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const dateStr = new Date().toISOString().split('T')[0];
        a.href = url;
        a.download = `meu-dia-backup-${dateStr}.json`;
        a.click();
        URL.revokeObjectURL(url);
        Toast.show('Backup JSON baixado com sucesso!', 'success');
    },

    exportTXT() {
        const tasks = TaskManager.tasks;
        if (tasks.length === 0) {
            Toast.show('Nenhuma tarefa para exportar!', 'info');
            return;
        }

        let content = `✨ MEU DIA PRO - RESUMO DE TAREFAS (${new Date().toLocaleDateString('pt-BR')})\n`;
        content += `====================================================\n\n`;

        tasks.forEach((t, i) => {
            const status = t.completed ? '[X]' : '[ ]';
            const prio = t.priority === 'high' ? '🔥 ALTA' : t.priority === 'medium' ? '⚡ MÉDIA' : '🌱 BAIXA';
            content += `${status} ${t.text} (${t.category.toUpperCase()} | ${prio})\n`;
        });

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `meu-dia-resumo.txt`;
        a.click();
        URL.revokeObjectURL(url);
        Toast.show('Resumo em texto exportado!', 'success');
    },

    importJSON(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                const importedTasks = Array.isArray(parsed) ? parsed : parsed.tasks;

                if (Array.isArray(importedTasks)) {
                    TaskManager.tasks = importedTasks;
                    TaskManager.save();
                    TaskManager.render();
                    Toast.show(`${importedTasks.length} tarefas restauradas com sucesso!`, 'success');
                } else {
                    Toast.show('Arquivo inválido: formato incompatível.', 'error');
                }
            } catch (err) {
                Toast.show('Erro ao ler o arquivo de backup.', 'error');
            }
        };

        reader.readAsText(file);
        e.target.value = ''; // Reset do input
    }
};

// =========================================================
// 8. DATA ATUAL FORMATADA
// =========================================================
function renderFormattedDate() {
    const el = document.getElementById('current-date');
    if (!el) return;

    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    let text = now.toLocaleDateString('pt-BR', options);
    text = text.charAt(0).toUpperCase() + text.slice(1);
    el.textContent = text;
}

// =========================================================
// 9. INICIALIZAÇÃO GERAL
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Data e Sistema de Som
    renderFormattedDate();
    SoundFX.updateSoundIcon();
    document.getElementById('sound-toggle-btn')?.addEventListener('click', () => SoundFX.toggleMute());

    // 2. Módulos
    ThemeManager.init();
    Pomodoro.init();
    TaskManager.init();
    StatsManager.init();
    BackupManager.init();

    // Mensagem de boas-vindas sofisticada
    setTimeout(() => {
        Toast.show('Bem-vindo ao Meu Dia Pro ✨', 'info', 2500);
    }, 400);
});
