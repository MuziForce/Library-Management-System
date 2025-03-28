let books = [];  
let currentPage = 1;
const booksPerPage = 10;

//fetch books from the backend
function searchBooks() {
  const title = document.getElementById("searchTitle").value.trim();
  const isbn = document.getElementById("searchISBN").value.trim();
  const author = document.getElementById("searchAuthor").value.trim();
  const genre = document.getElementById("searchGenre").value.trim();

  
  const queryParams = new URLSearchParams({
    title: title,
    isbn: isbn,
    author: author,
    genre: genre
  });

  // Fetch request to get books from the backend
  fetch(`/api/books?${queryParams}`)
    .then(response => response.json())
    .then(data => {
      books = data; 
      currentPage = 1;  
      renderBooks();    
    })
    .catch(err => {
      console.error('Error fetching books:', err);
    });
}

// render books on the current page
function renderBooks() {
  const bookList = document.getElementById("bookList");
  bookList.innerHTML = ""; 

  // display books on current page
  const start = (currentPage - 1) * booksPerPage;
  const end = start + booksPerPage;
  const booksOnPage = books.slice(start, end);

  booksOnPage.forEach(book => {
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item");

    // Book details 
    const bookDetails = `
      <div>
        <strong>${book.title}</strong><br>
        ISBN: ${book.isbn}<br>
        Author: ${book.author}<br>
        Genre: ${book.genre}
      </div>
    `;

    listItem.innerHTML = bookDetails;
    bookList.appendChild(listItem);
  });

  updatePagination(); 
}


function updatePagination() {
  document.getElementById("pageNum").textContent = `Page ${currentPage}`;
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage * booksPerPage >= books.length;
}


function nextPage() {
  if (currentPage * booksPerPage < books.length) {
    currentPage++;
    renderBooks();
  }
}


function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderBooks();
  }
}


document.addEventListener("DOMContentLoaded", () => {
  searchBooks();  
});
