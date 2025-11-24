// Simple To‑Do List functionality
document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');

    // Function to add a new to‑do item
    function addTodo() {
        const taskText = todoInput.value.trim();
        if (taskText === '') return; // Do nothing if input is empty

        // Create a new list item
        const listItem = document.createElement('li');
        // Span to hold the task text
        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;

        // Create a remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'remove-btn';

        // Attach click event to remove the item
        removeBtn.addEventListener('click', () => {
            todoList.removeChild(listItem);
        });

        // Append the text and button to the list item
        listItem.appendChild(taskSpan);
        listItem.appendChild(removeBtn);
        // Add the list item to the list
        todoList.appendChild(listItem);

        // Clear the input for the next task
        todoInput.value = '';
    }

    // Event listener for the Add button
    addBtn.addEventListener('click', addTodo);

    // Add item when pressing Enter key inside the input field
    todoInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            addTodo();
        }
    });
});
