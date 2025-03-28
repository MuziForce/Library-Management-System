// Function to fetch overdue book records
async function fetchBooks() {
    try {
      const response = await fetch('/api/overdue_books');
      const books = await response.json();
      const bookList = document.getElementById('bookList');
  
      books.forEach(book => {
        const row = document.createElement('tr');
        const fine = calculateFine(book.return_date);
  
        row.innerHTML = `
          <td>${book.book_id}</td>
          <td>${book.user_id}</td>
          <td>${book.reserved_date}</td>
          <td>${book.return_date}</td>
          <td>$${fine.toFixed(2)}</td>
          <td>
            <button class="btn btn-danger" onclick="imposeFine(${book.book_id}, ${fine})">Impose Fine</button>
          </td>
        `;
        bookList.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching overdue books:', error);
    }
  }
  
  // Calculate fine based on return date
  function calculateFine(returnDate) {
    const today = new Date();
    const returnDateObj = new Date(returnDate);
    const diffTime = today - returnDateObj;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    return diffDays > 0 ? diffDays * 5.5 : 0; // $5.50 per day
  }
  
  // Function to impose fine
  async function imposeFine(bookId, fineAmount) {
    try {
      const response = await fetch(`/api/impose_fine/${bookId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fine: fineAmount }),
      });
      const result = await response.json();
  
      if (result.success) {
        document.getElementById('message').innerHTML = `<div class="alert alert-success">Fine of $${fineAmount.toFixed(2)} imposed successfully! Fine ID: ${result.fine_id}</div>`;
      } else {
        document.getElementById('message').innerHTML = `<div class="alert alert-danger">Error imposing fine.</div>`;
      }
    } catch (error) {
      console.error('Error imposing fine:', error);
    }
  }
  
  
  // Fetch books on page load
  window.onload = fetchBooks;
  