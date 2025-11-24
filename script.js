// Enhanced To‑Do List functionality
// This script implements persistence via localStorage, task completion,
// deletion, editing, drag‑and‑drop reordering, dark mode support and
// additional validation for empty tasks.

document.addEventListener('DOMContentLoaded', () => {
    // DOM element references
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const deleteAllBtn = document.getElementById('delete-all-btn');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const todoList = document.getElementById('todo-list');

    // In‑memory array of tasks; each task has { text, completed, createdAt }
    let tasks = [];
    // Index of the task being dragged; used during drag‑and‑drop
    let draggedIndex = null;

    /**
     * Save the current tasks array to localStorage.
     */
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    /**
     * Load tasks from localStorage into the tasks array.
     */
    function loadTasks() {
        const stored = localStorage.getItem('tasks');
        try {
            tasks = stored ? JSON.parse(stored) : [];
        } catch (e) {
            tasks = [];
        }
    }

    /**
     * Render the tasks list based on the tasks array.
     */
    function renderTasks() {
        // Clear existing list items
        todoList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.dataset.index = index.toString();
            li.draggable = true;
            // Apply completed class for styling
            if (task.completed) li.classList.add('completed');

            // Checkbox to mark completion
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'complete-checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                saveTasks();
                renderTasks();
            });

            // Container for text and timestamp to align flexibly
            const textContainer = document.createElement('div');
            textContainer.style.flex = '1';
            textContainer.style.display = 'flex';
            textContainer.style.flexDirection = 'column';

            // Span showing the task text
            const taskSpan = document.createElement('span');
            taskSpan.className = 'task-text';
            taskSpan.textContent = task.text;
            // Make the span editable on demand
            taskSpan.contentEditable = 'false';

            // Timestamp element
            const tsSpan = document.createElement('span');
            tsSpan.className = 'timestamp';
            const dateObj = new Date(task.createdAt);
            tsSpan.textContent = dateObj.toLocaleString();

            textContainer.appendChild(taskSpan);
            textContainer.appendChild(tsSpan);

            // Edit button toggles inline editing
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'edit-btn';
            editBtn.addEventListener('click', () => {
                // Toggle editing state: if not editing, enable editing
                const isEditing = taskSpan.isContentEditable;
                if (!isEditing) {
                    taskSpan.contentEditable = 'true';
                    taskSpan.focus();
                    // Select all text for convenience
                    document.execCommand('selectAll', false, null);
                } else {
                    // Commit changes when exiting editing
                    const newText = taskSpan.textContent.trim();
                    if (newText) {
                        task.text = newText;
                        saveTasks();
                    }
                    taskSpan.contentEditable = 'false';
                    renderTasks();
                }
            });

            // Remove button deletes the task
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'remove-btn';
            removeBtn.addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            // Append elements to list item
            li.appendChild(checkbox);
            li.appendChild(textContainer);
            li.appendChild(editBtn);
            li.appendChild(removeBtn);

            // Drag and drop handlers
            li.addEventListener('dragstart', handleDragStart);
            li.addEventListener('dragover', handleDragOver);
            li.addEventListener('drop', handleDrop);
            li.addEventListener('dragend', handleDragEnd);

            todoList.appendChild(li);
        });
    }

    /**
     * Handle drag start event: set the dragged index and apply a style.
     */
    function handleDragStart(event) {
        draggedIndex = Number(this.dataset.index);
        event.dataTransfer.effectAllowed = 'move';
        // Reduce opacity to indicate drag state
        this.style.opacity = '0.4';
    }

    /**
     * Allow drop by preventing default behaviour.
     */
    function handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    /**
     * Handle drop event: reorder tasks based on drop position.
     */
    function handleDrop(event) {
        event.preventDefault();
        const targetIndex = Number(this.dataset.index);
        if (draggedIndex === null || draggedIndex === targetIndex) return;
        const [movedTask] = tasks.splice(draggedIndex, 1);
        tasks.splice(targetIndex, 0, movedTask);
        saveTasks();
        renderTasks();
    }

    /**
     * Reset opacity when dragging ends.
     */
    function handleDragEnd() {
        this.style.opacity = '';
        draggedIndex = null;
    }

    /**
     * Add a new task to the list if the input is non‑empty.
     */
    function addTask() {
        const text = todoInput.value.trim();
        if (!text) return;
        const newTask = {
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        todoInput.value = '';
    }

    /**
     * Remove all tasks from the list and storage.
     */
    function deleteAllTasks() {
        tasks = [];
        saveTasks();
        renderTasks();
    }

    /**
     * Toggle dark mode on or off. Optionally force a specific state.
     * @param {boolean} [force] Optional explicit state to set
     */
    function toggleDarkMode(force) {
        const body = document.body;
        let enable;
        if (typeof force === 'boolean') {
            enable = force;
        } else {
            enable = !body.classList.contains('dark-mode');
        }
        if (enable) {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
        localStorage.setItem('darkMode', enable.toString());
    }

    /**
     * Initialize the application: load tasks, set dark mode,
     * assign event listeners.
     */
    function init() {
        loadTasks();
        // Load dark mode preference
        const darkPref = localStorage.getItem('darkMode') === 'true';
        if (darkPref) toggleDarkMode(true);
        renderTasks();
        // Event listeners
        addBtn.addEventListener('click', addTask);
        deleteAllBtn.addEventListener('click', deleteAllTasks);
        darkModeToggle.addEventListener('click', () => toggleDarkMode());
        todoInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') addTask();
        });
    }

    // Kick off the initialization
    init();
});
