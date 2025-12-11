// URL del backend API
const API_URL = 'http://localhost:8000/api';

// Cargar todas las tareas al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();

    // Permitir crear tarea con Enter
    document.getElementById('todoInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            createTodo();
        }
    });
});

// Función para cargar todas las tareas desde el backend
async function loadTodos() {
    try {
        const response = await fetch(`${API_URL}/todos`);
        const todos = await response.json();

        displayTodos(todos);
    } catch (error) {
        console.error('Error al cargar tareas:', error);
        alert('Error al conectar con el servidor. Verifica que el backend esté corriendo.');
    }
}

// Función para mostrar las tareas en el HTML
function displayTodos(todos) {
    const todoList = document.getElementById('todoList');

    if (todos.length === 0) {
        todoList.innerHTML = '<div class="empty-state">No hay tareas. ¡Agrega una nueva!</div>';
        return;
    }
    // EN ESTE BLOQUE SE AGREGO EL BOTON EDITAR
    todoList.innerHTML = todos.map(todo => `
        <div class="todo-item">
            <span class="todo-text">${todo.title}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">
                Eliminar
            </button>
            <button class="edit-btn" onclick="editTodo(${todo.id})">
                Editar
            </button>
        </div>
    `).join('');
}

// Función para crear una nueva tarea
async function createTodo() {
    const input = document.getElementById('todoInput');
    const title = input.value.trim();

    if (!title) {
        alert('Por favor escribe una tarea');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title })
        });

        if (response.ok) {
            input.value = '';
            loadTodos(); // Recargar la lista
        }
    } catch (error) {
        console.error('Error al crear tarea:', error);
        alert('Error al crear la tarea');
    }
}

// Función para eliminar una tarea
async function deleteTodo(id) {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadTodos(); // Recargar la lista
        }
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        alert('Error al eliminar la tarea');
    }
}

// Aqui editas una tarea
async function editTodo(id) {
    const newTitle = prompt('Escribe el nuevo título de la tarea:');
    if (newTitle === null) {
        return; // El usuario canceló el prompt
    }
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) {
        alert('El título no puede estar vacío.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: trimmedTitle })
        });

        if (response.ok) {
            loadTodos(); // Recargar la lista
        }
    } catch (error) {
        console.error('Error al editar tarea:', error);
        alert('Error al editar la tarea');
    }
}