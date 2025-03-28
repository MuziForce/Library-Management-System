
document.getElementById('addBookForm').addEventListener('submit', function(e) {
    console.log('form submitted');
    e.preventDefault();

    
    document.getElementById('successMessage').style.display = 'none';

  
    const title = document.getElementById('title').value;
    const isbn = document.getElementById('isbn').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;

  
    const bookData = {
        title: title,
        isbn: isbn,
        author: author,
        genre: genre
    };

    // endpoint
    fetch('http://localhost:3009/api/addbooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.text();
      })
      .then(data => {
       
        alert(data);
        
        
        document.getElementById('successMessage').style.display = 'block';
      })
      .catch(error => {
        console.error('Error:', error);
        alert('There was an issue adding the book.');
      });

    console.log('Sending book data to the server:', bookData);

    document.getElementById('addBookForm').reset();
});
