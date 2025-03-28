// display reserved books in the dropdown
function loadReservedBooks() {
  fetch('/api/reserved-books', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(books => {
      const bookSelect = document.getElementById('bookId');
      bookSelect.innerHTML = ''; 

      if (books.length > 0) {
          books.forEach(book => {
              const option = document.createElement('option');
              option.value = book.id;
              option.textContent = `${book.title} (Reserved on: ${book.reserved_date})`;
              bookSelect.appendChild(option);
          });
      } else {
          // If no reserved books found
          const option = document.createElement('option');
          option.value = '';
          option.textContent = 'No reserved books found';
          bookSelect.appendChild(option);
      }
  })
  .catch(error => {
      console.error('Error fetching reserved books:', error);
  });
}

// Function to renew a reserved book
function renewBook() {
  const bookId = document.getElementById('bookId').value;
  const newReservationDate = document.getElementById('newReservationDate').value;

  if (!bookId || !newReservationDate) {
      alert('Please select a book and a new reservation date');
      return;
  }

  const data = {
      bookId: bookId,
      newReservationDate: newReservationDate
  };

  fetch('/renew-book', {
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
          alert('Book renewed successfully!');
      }
  })
  .catch(error => {
      console.error('Error renewing book:', error);
  });
}


window.onload = loadReservedBooks;
