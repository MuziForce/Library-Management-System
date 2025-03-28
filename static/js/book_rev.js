// search books
function searchBook() {
  const searchQuery = document.getElementById("bookSearch").value;
  
  $.ajax({
      url: '/search-books',
      type: 'GET',
      data: { query: searchQuery },
      success: (books) => {
          const resultsList = document.getElementById("resultsList");
          resultsList.innerHTML = ""; 
          
          books.forEach(book => {
              const listItem = document.createElement("li");
              listItem.classList.add("list-group-item");

              listItem.textContent = book.title;

              const selectBtn = document.createElement("button");
              selectBtn.classList.add("btn", "btn-sm", "btn-outline-primary", "ms-2");
              selectBtn.textContent = "Select";
              selectBtn.onclick = () => selectBook(book.id, book.title);

              listItem.appendChild(selectBtn);
              resultsList.appendChild(listItem);
          });
      },
      error: (xhr, status, error) => {
          alert("Error fetching books: " + error);
      }
  });
}

// reserving books
let selectedBooks = [];

function selectBook(bookId, bookTitle) {
  const selectedList = document.getElementById("selectedList");

  // Prevent duplicate selection
  if (selectedBooks.some(book => book.id === bookId)) {
      alert("This book is already selected.");
      return;
  }

  selectedBooks.push({ id: bookId, title: bookTitle });

  const listItem = document.createElement("li");
  listItem.classList.add("list-group-item");
  listItem.textContent = bookTitle;
  
  selectedList.appendChild(listItem);
}

// reserve selected books
function reserveBooks() {
  const reservationDate = document.getElementById('reservationDate').value;
  
 
  if (selectedBooks.length === 0 || !reservationDate) {
      alert('Please select a book and a reservation date');
      return;
  }

  // Preparing the data to send to the server
  const data = {
      bookId: selectedBooks[0].id,  
      reservationDate: reservationDate,
      
  };

  console.log('Sending data:', data); 

  // Send the request to the server
  fetch('/reserve-books', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
      if (result.message) {
          alert(result.message);
      } else {
          alert('Book reserved successfully!');
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
}
