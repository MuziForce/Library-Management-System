
document.getElementById('addUserForm').addEventListener('submit', function(e) {
    console.log('form submitted');
    e.preventDefault();

    
    document.getElementById('successMessage').style.display = 'none';

   
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    

   
    const bookData = {
        name: name,
        email: email,
        password: password
        
    };

    
    fetch('http://localhost:3009/api/adduser', {
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

    
    document.getElementById('addUserForm').reset();
});
