// DOM Elements
const todoList = document.getElementById('todoList');
const pagination = document.getElementById('pagination');
const fetchTodosBtn = document.getElementById('fetchTodosBtn');

// Variables
let currentPage = 1;
const todosPerPage = 10;
const API_URL = 'https://jsonplaceholder.typicode.com/todos';

// Event Listener for Fetch Button
fetchTodosBtn.addEventListener('click', () => {
    fetchTodos(currentPage);
});

// Fetch Todos
async function fetchTodos(page) {
    try {
        const response = await fetch(API_URL);
        const todos = await response.json();

        // Calculate the total pages based on todos per page
        const totalPages = Math.ceil(todos.length / todosPerPage);

        // Display todos for the current page
        displayTodos(todos, page);

        // Display pagination buttons
        setupPagination(totalPages);
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

// Display Todos
function displayTodos(todos, page) {
    todoList.innerHTML = ''; // Clear previous todos

    // Calculate start and end index for slicing
    const startIndex = (page - 1) * todosPerPage;
    const endIndex = startIndex + todosPerPage;
    const todosToDisplay = todos.slice(startIndex, endIndex);

    // Append todos to the DOM
    todosToDisplay.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');
        if (todo.completed) {
            todoItem.classList.add('completed');
        }
        todoItem.innerHTML = `<h4>${todo.title}</h4>`;
        todoList.appendChild(todoItem);
    });
}

// Setup Pagination
function setupPagination(totalPages) {
    pagination.innerHTML = ''; // Clear previous pagination buttons

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.classList.add('page-btn');
        pageBtn.textContent = i;

        // Highlight current page button
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }

        pageBtn.addEventListener('click', () => {
            currentPage = i;
            fetchTodos(currentPage);
        });

        pagination.appendChild(pageBtn);
    }
}
