//fetch reserved books and update 
function refreshBooks() {
  fetch('/api/reserved-books', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      },
      credentials: 'include'  
  })
  .then(response => response.json())
  .then(books => {
      const reservedList = document.getElementById('reservedList');
      reservedList.innerHTML = '';  

      
      if (books.length === 0) {
          const noBooksItem = document.createElement('li');
          noBooksItem.classList.add('list-group-item', 'text-center');
          noBooksItem.textContent = 'No reserved books found.';
          reservedList.appendChild(noBooksItem);
      } else {
          
          books.forEach(book => {
              const listItem = document.createElement('li');
              listItem.classList.add('list-group-item');

             
              const reservedDate = new Date(book.reserved_date).toLocaleDateString();
              const returnDate = new Date(book.return_date).toLocaleDateString();

         
              listItem.textContent = `${book.title} - Reserved on: ${reservedDate} - Return date: ${returnDate}`;

              reservedList.appendChild(listItem);
          });
      }
  })
  .catch(error => {
      console.error('Error fetching reserved books:', error);
  });
}

window.onload = refreshBooks;
