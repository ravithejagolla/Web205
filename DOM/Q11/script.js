// Global Variables
const userContainer = document.getElementById('user-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageNumber = document.getElementById('page-number');
let currentPage = 1;
let sortCriteria = ''; // Default sorting
const usersPerPage = 6;

// Function to fetch and render users with pagination and sorting
async function fetchUsers(page = 1, sort = '') {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=${usersPerPage}${sort ? `&_sort=${sort}` : ''}`);
        const users = await response.json();
        
        if (users.length === 0) return; // Stop fetching if no data

        renderUsers(users);
        pageNumber.textContent = `Page: ${page}`;
    } catch (error) {
        userContainer.innerHTML = `<p>Error fetching data. Please try again.</p>`;
    }
}

// Function to render users in the DOM
function renderUsers(users) {
    userContainer.innerHTML = '';
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('user-item');
        userDiv.innerHTML = `
            <h3>${user.name}</h3>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>City:</strong> ${user.address.city}</p>
            <p><strong>Company:</strong> ${user.company.name}</p>
        `;
        userContainer.appendChild(userDiv);
    });
}

// Pagination controls
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchUsers(currentPage, sortCriteria);
    }
});

nextBtn.addEventListener('click', () => {
    currentPage++;
    fetchUsers(currentPage, sortCriteria);
});

// Sorting functionality
function sortUsers(criteria) {
    sortCriteria = criteria;
    currentPage = 1; // Reset to first page on sorting
    fetchUsers(currentPage, sortCriteria);
}

// Initial fetch
fetchUsers();
