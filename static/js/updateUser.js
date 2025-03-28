document.getElementById('searchUserForm').addEventListener('submit', function(e) {
    e.preventDefault();

    
    const messageDiv = document.getElementById('message');
    messageDiv.style.display = 'none';

   
    const searchEmail = document.getElementById('searchEmail').value;

    // GET request to search for the user 
    fetch(`/api/updateUsers?email=${encodeURIComponent(searchEmail)}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('User not found');
        }
        return response.json();
    })
    .then(user => {
        // Populate the update form with the fetched user details
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
        document.getElementById('password').value = '';  
        document.getElementById('updateUserForm').style.display = 'block';  
    })
    .catch(error => {
        console.error('Error:', error);
        messageDiv.style.backgroundColor = '#f44336'; 
        messageDiv.innerHTML = 'Error finding user.';
        messageDiv.style.display = 'block';
    });
});

document.getElementById('updateUserForm').addEventListener('submit', function(e) {
    e.preventDefault();

  
    const messageDiv = document.getElementById('message');
    messageDiv.style.display = 'none';

   
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

 
    const updateData = {
        name: name,
        email: email,
        password: password  
    };

    
    fetch('/api/updateUsers', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update user');
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
        messageDiv.innerHTML = 'Error updating user.';
        messageDiv.style.display = 'block';
    });

    console.log('Updating user info:', updateData);
});

document.getElementById('deleteUserBtn').addEventListener('click', function() {
    const email = document.getElementById('email').value;

    
    fetch(`/api/updateUsers?email=${encodeURIComponent(email)}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete user');
        }
        return response.text();
    })
    .then(data => {
        messageDiv.style.backgroundColor = '#4caf50'; 
        messageDiv.innerHTML = data;
        messageDiv.style.display = 'block';

        // Clear form
        document.getElementById('updateUserForm').reset();
        document.getElementById('updateUserForm').style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
        messageDiv.style.backgroundColor = '#f44336'; 
        messageDiv.innerHTML = 'Error deleting user.';
        messageDiv.style.display = 'block';
    });
});
