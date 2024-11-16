import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getDatabase, ref, push, get, update, remove } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyA76z0XXXezGeVanUic8eCd6ZIz85hk-UQ",
    authDomain: "library-management-syste-d7c8c.firebaseapp.com",
    databaseURL: "https://library-management-syste-d7c8c-default-rtdb.firebaseio.com",
    projectId: "library-management-syste-d7c8c",
    storageBucket: "library-management-syste-d7c8c.firebasestorage.app",
    messagingSenderId: "130726218728",
    appId: "1:130726218728:web:8989fe492a826d868e325d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Global variables for pagination
let booksPage = 1;
const booksPerPage = 5;

const fetchBooks = async () => {
  const booksRef = ref(db, "books/");
  const snapshot = await get(booksRef);

  if (snapshot.exists()) {
    let books = Object.entries(snapshot.val()).map(([id, data]) => ({
      id,
      ...data,
    }));

    // Apply filtering by genre
    const filterGenre = document.getElementById("filter-genre").value;
    if (filterGenre) {
      books = books.filter((book) => book.genre === filterGenre);
    }

    // Apply sorting
    const sortValue = document.getElementById("sort-books").value;
    if (sortValue) {
      books.sort((a, b) => {
        if (sortValue === "title") {
          return a.title.localeCompare(b.title);
        } else if (sortValue === "author") {
          return a.author.localeCompare(b.author);
        } else if (sortValue === "publishedYear") {
          return a.publishedYear - b.publishedYear;
        }
        return 0;
      });
    }

    // Apply pagination
    const startIndex = (booksPage - 1) * booksPerPage;
    const paginatedBooks = books.slice(startIndex, startIndex + booksPerPage);

    // Render books
    const booksList = document.getElementById("books-list");
    booksList.innerHTML = "";

    paginatedBooks.forEach((book) => {
      booksList.innerHTML += `
        <div>
          <p><strong>${book.title}</strong> - ${book.author} (${book.publishedYear}) - ${book.genre} - ${book.available ? "Available" : "Not Available"}</p>
          <div class="buttons">
            <button class="edit-btn" onclick="editBook('${book.id}')">Edit</button>
            <button class="delete-btn" onclick="deleteBook('${book.id}')">Delete</button>
          </div>
        </div>
      `;
    });

    updateBooksPagination(books.length);
  }
};

const updateBooksPagination = (totalBooks) => {
  const totalPages = Math.ceil(totalBooks / booksPerPage);

  document.getElementById("prev-books").disabled = booksPage === 1;
  document.getElementById("next-books").disabled = booksPage === totalPages;

  document.getElementById("books-page-info").textContent = `Page ${booksPage} of ${totalPages}`;
};

document.getElementById("prev-books").addEventListener("click", () => {
  booksPage--;
  fetchBooks();
});

document.getElementById("next-books").addEventListener("click", () => {
  booksPage++;
  fetchBooks();
});

document.getElementById("filter-genre").addEventListener("change", () => {
  booksPage = 1;
  fetchBooks();
});

document.getElementById("sort-books").addEventListener("change", () => {
  booksPage = 1;
  fetchBooks();
});

// Add book
document.getElementById("book-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("book-title").value;
  const author = document.getElementById("book-author").value;
  const genre = document.getElementById("book-genre").value;
  const publishedYear = parseInt(document.getElementById("book-year").value);
  const available = document.getElementById("book-available").value === "Yes" ? true : false;

  const newBook = { title, author, genre, publishedYear, available };
  push(ref(db, "books/"), newBook);

  alert("Book added successfully!");
  fetchBooks();
});

// Edit book
const editBook = async (firebaseKey) => {
  let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const booksRef = ref(db, `books/${numbers.includes(firebaseKey) ? +firebaseKey - 1 : firebaseKey}`);
  const snapshot = await get(booksRef);
  if (snapshot.exists()) {
    const book = snapshot.val();
    const title = prompt("Edit Title:", book.title);
    const author = prompt("Edit Author:", book.author);
    const genre = prompt("Edit Genre:", book.genre);
    const publishedYear = parseInt(prompt("Edit Year:", book.publishedYear));
    const available = prompt("Is this book available? (enter Yes or No):", book.available) === "Yes" ? true : false;

    update(booksRef, { title, author, genre, publishedYear, available });
    alert("Book updated successfully!");
    fetchBooks();
  }
};

// Delete book
const deleteBook = (firebaseKey) => {  
  let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  remove(ref(db, `books/${numbers.includes(firebaseKey) ? +firebaseKey - 1 : firebaseKey}`))
  .then(() => {
    alert("Book deleted successfully!");
    fetchBooks();
  })
  .catch((error) => {
    console.log("Error deleting book: ", error);
  });
};

// ------------------- MEMBERS SECTION -------------------

// Global variables for pagination
let membersPage = 1;
const membersPerPage = 10;

// Fetch and display members
const fetchMembers = async () => {
  const membersRef = ref(db, "members/");
  const snapshot = await get(membersRef);

  if (snapshot.exists()) {
    let members = Object.entries(snapshot.val()).map(([id, data]) => ({
      id,
      ...data,
    }));

    // Apply filters and sorting
    const filterValue = document.getElementById("filter-members").value;
    if (filterValue) {
      members = members.filter((member) =>
        filterValue === "active" ? member.active : !member.active
      );
    }

    const sortValue = document.getElementById("sort-members").value;
    if (sortValue) {
      members.sort((a, b) => {
        if (sortValue === "name") {
          return a.name.localeCompare(b.name);
        } else if (sortValue === "membershipDate") {
          return new Date(a.membershipDate) - new Date(b.membershipDate);
        }
        return 0;
      });
    }

    // Apply pagination
    const startIndex = (membersPage - 1) * membersPerPage;
    const paginatedMembers = members.slice(startIndex, startIndex + membersPerPage);

    // Render members
    const membersList = document.getElementById("members-list");
    membersList.innerHTML = "";

    paginatedMembers.forEach((member) => {
      membersList.innerHTML += `
        <div>
          <p><strong>${member.name}</strong> (Joined: ${member.membershipDate}) - Status: ${member.active ? "Active" : "Inactive"}</p>
          <div class="buttons">
            <button class="edit-btn" onclick="editMember('${member.id}')">Edit</button>
            <button class="delete-btn" onclick="deleteMember('${member.id}')">Delete</button>
          </div>
          </div>
      `;
    });

    updateMembersPagination(members.length);
  }
};

// Add member
document.getElementById("member-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("member-name").value;
  const membershipDate = document.getElementById("member-date").value;

  const newMember = { name, membershipDate, active: true };
  push(ref(db, "members/"), newMember);

  alert("Member added successfully!");
  fetchMembers();
});

// Edit member
const editMember = async (firebaseKey) => {
  let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const membersRef = ref(db, `members/${numbers.includes(firebaseKey) ? +firebaseKey - 1 : firebaseKey}`);
  const snapshot = await get(membersRef);
  if (snapshot.exists()) {
      const member = snapshot.val();
      const name = prompt("Edit Name:", member.name);
      const joinedDate = prompt("Edit Joined Date:", member.membershipDate);
      const active = prompt("Is user still active? (enter Yes or No):", member.active) === "Yes" ? true : false;

      update(membersRef, { name, joinedDate, active });
      alert("Member updated successfully!");
      fetchMembers();
  }
};

// Delete member
const deleteMember = (firebaseKey) => {
  let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  remove(ref(db, `members/${numbers.includes(firebaseKey) ? +firebaseKey - 1 : firebaseKey}`))
  .then(() => {
    alert("Member deleted successfully!");
    fetchMembers();
  })
  .catch((error) => {
    console.log("Error deleting member: ", error);
  });
};

// Pagination controls
const updateMembersPagination = (totalMembers) => {
  const totalPages = Math.ceil(totalMembers / membersPerPage);

  document.getElementById("prev-members").disabled = membersPage === 1;
  document.getElementById("next-members").disabled = membersPage === totalPages;

  document.getElementById("members-page-info").textContent = `Page ${membersPage} of ${totalPages}`;
};

document.getElementById("prev-members").addEventListener("click", () => {
  membersPage--;
  fetchMembers();
});

document.getElementById("next-members").addEventListener("click", () => {
  membersPage++;
  fetchMembers();
});

// Filters and Sorting
document.getElementById("filter-members").addEventListener("change", () => {
  membersPage = 1; // Reset to first page after filtering
  fetchMembers();
});

document.getElementById("sort-members").addEventListener("change", () => {
  membersPage = 1; // Reset to first page after sorting
  fetchMembers();
});

// Make functions globally accessible
window.editBook = editBook;
window.deleteBook = deleteBook;
window.editMember = editMember;
window.deleteMember = deleteMember;

// Initial fetch
fetchBooks();
fetchMembers();