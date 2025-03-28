document.getElementById('deleteBookForm').addEventListener('submit', function(e) {
    e.preventDefault();

   
    const messageDiv = document.getElementById('message');
    messageDiv.style.display = 'none';

    
    const title = document.getElementById('title').value;
    const isbn = document.getElementById('isbn').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;

    const searchData = {
        title: title,
        isbn: isbn,
        author: author,
        genre: genre
    };

    // DELETE request to the  endpoint
    fetch('/api/deletebook', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete book');
        }
        return response.text();
    })
    .then(data => {
        messageDiv.style.backgroundColor = '#4caf50'; 
        messageDiv.innerHTML = data;
        messageDiv.style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
        messageDiv.style.backgroundColor = '#f44336'; 
        messageDiv.innerHTML = 'Error deleting the book.';
        messageDiv.style.display = 'block';
    });

    console.log('Attempting to delete book:', searchData);

    
    document.getElementById('deleteBookForm').reset();
});
