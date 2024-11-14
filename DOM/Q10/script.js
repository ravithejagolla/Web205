// DOM Elements
const userList = document.getElementById('userList');
const pagination = document.getElementById('pagination');

// Variables
let currentPage = 1;
const usersPerPage = 6;
const API_URL = 'https://jsonplaceholder.typicode.com/users';

// Fetch users for a specific page
async function fetchUsers(page) {
    try {
        const response = await fetch(`${API_URL}?_page=${page}&_limit=${usersPerPage}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const users = await response.json();
        displayUsers(users);
        setupPaginationButtons();
    } catch (error) {
        displayError(error.message);
    }
}

// Display users in the DOM
function displayUsers(users) {
    userList.innerHTML = ''; // Clear previous users
    users.forEach(user => {
        const userItem = document.createElement('div');
        userItem.classList.add('user-item');
        userItem.innerHTML = `
            <h3>${user.name}</h3>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>City:</strong> ${user.address.city}</p>
        `;
        userList.appendChild(userItem);
    });
}

// Display an error message
function displayError(message) {
    userList.innerHTML = `<p class="error">${message}</p>`;
}

// Setup pagination buttons based on the total number of pages (assume 2 pages for example)
function setupPaginationButtons() {
    pagination.innerHTML = ''; // Clear previous buttons
    for (let i = 1; i <= 2; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.classList.add('page-btn');
        pageBtn.textContent = i;
        
        // Highlight the current page
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        
        // Event listener for changing pages
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            fetchUsers(currentPage);
        });

        pagination.appendChild(pageBtn);
    }
}

// Initial fetch
fetchUsers(currentPage);
