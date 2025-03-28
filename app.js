//modules
const express = require('express'); 
const path = require('path');
const bodyParser = require('body-parser');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const session = require('express-session');
require('dotenv').config();  

const app = express();


// Connect to SQLite database
let db;
(async () => {
    db = await sqlite.open({
        filename: './lms.db', 
        driver: sqlite3.Database
    });

    console.log('Connected to SQLite database.');
})();

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  
  }));


// Middleware to serve static files
app.use('/public', express.static(path.join(__dirname, 'static')));

// Middleware JSON 
app.use(bodyParser.json());

// Middleware 
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res)=>{

    res.sendFile(path.join(__dirname, 'static', 'startPage.html'))
});

app.get('/', (req, res)=>{

    res.sendFile(path.join(__dirname, 'static', 'signUp_login.html'))
});

app.get('/login', (req, res)=>{

    res.sendFile(path.join(__dirname, 'static','signUp_login.html'))
});

// Search for user by email
app.get('/api/updateUsers', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email is required to search' });
    }

    try {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const user = await db.get(sql, [email]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error('Error searching user:', err.message);
        res.status(500).json({ error: 'Database error' });
    }
});

// Update user info
app.put('/api/updateUsers', async (req, res) => {
    const { name, email, password } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required to update user info' });
    }

    try {
        let sql = 'UPDATE users SET name = ?, email = ?';
        const params = [name, email];

        // Update password only if provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            sql += ', password = ?';
            params.push(hashedPassword);
        }

        sql += ' WHERE email = ?';
        params.push(email);

        const result = await db.run(sql, params);
        if (result.changes > 0) {
            res.status(200).send('User updated successfully');
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Server error');
    }
});

// Delete a user
app.delete('/api/updateUsers', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email is required to delete user' });
    }

    try {
        const sql = 'DELETE FROM users WHERE email = ?';
        const result = await db.run(sql, [email]);

        if (result.changes > 0) {
            res.status(200).send('User deleted successfully');
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Server error');
    }
});


// Adding books to the database
app.post('http://localhost:3009/api/addbooks', async (req, res) => {
    const { title, isbn, author, genre } = req.body;

    
    const sql = 'INSERT INTO books (title, isbn, author, genre) VALUES (?, ?, ?, ?)';

    try {
       
        await db.run(sql, [title, isbn, author, genre]);

        // If successful, send a success message
        res.status(201).send('Book added successfully');
    } catch (err) {
        console.error('Error inserting book:', err);
        res.status(500).send('Server error');
    }
});

// Adding user to the database
app.post('/api/adduser', async (req, res) => {
    const { name, email, password } = req.body;
  
    try {

        // Hashing password
        const hashedPassword = await bcrypt.hash(password, 10);
  
        
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        await db.run(sql, [name, email, hashedPassword]);

        res.json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during sign-up:', err.message);
        if (err.code === 'SQLITE_CONSTRAINT') {
            res.status(409).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Database error' });
        }
    }
});

// Route to delete a book from the database
app.delete('/api/deletebook', async (req, res) => {
    const { title, isbn, author, genre } = req.body;

    
    let query = 'DELETE FROM books WHERE 1=1';
    const params = [];

    if (title) {
        query += ' AND title LIKE ?';
        params.push(`%${title}%`);
    }
    if (isbn) {
        query += ' AND isbn = ?';
        params.push(isbn);
    }
    if (author) {
        query += ' AND author LIKE ?';
        params.push(`%${author}%`);
    }
    if (genre) {
        query += ' AND genre LIKE ?';
        params.push(`%${genre}%`);
    }

    try {
        const result = await db.run(query, params);
        if (result.changes > 0) {
            res.status(200).send('Book deleted successfully');
        } else {
            res.status(404).send('No matching book found');
        }
    } catch (err) {
        console.error('Error deleting book:', err);
        res.status(500).send('Server error');
    }
});


//route for fetching book data as JSON
app.get('/api/books', (req, res) => {
    const { title, isbn, author, genre } = req.query;

    
    let query = 'SELECT * FROM books WHERE 1=1';
    const params = [];

    if (title) {
      query += ' AND title LIKE ?';
      params.push(`%${title}%`);
    }
    if (isbn) {
      query += ' AND isbn = ?';
      params.push(isbn);
    }
    if (author) {
      query += ' AND author LIKE ?';
      params.push(`%${author}%`);
    }
    if (genre) {
      query += ' AND genre LIKE ?';
      params.push(`%${genre}%`);
    }

    // Execute the query and return the results
    db.all(query, params)
      .then((rows) => {
        res.json(rows);  
      })
      .catch((err) => {
        console.error('Error fetching books:', err);
        res.status(500).json({ error: 'Failed to fetch books' });
      });
});

// route for fetching book data as JSON
app.get('/api/adminBooks', (req, res) => {
    const { title, isbn, author, genre } = req.query;

   
    let query = 'SELECT * FROM books WHERE 1=1';
    const params = [];

    if (title) {
      query += ' AND title LIKE ?';
      params.push(`%${title}%`);
    }
    if (isbn) {
      query += ' AND isbn = ?';
      params.push(isbn);
    }
    if (author) {
      query += ' AND author LIKE ?';
      params.push(`%${author}%`);
    }
    if (genre) {
      query += ' AND genre LIKE ?';
      params.push(`%${genre}%`);
    }

   
    db.all(query, params)
      .then((rows) => {
        res.json(rows);  
      })
      .catch((err) => {
        console.error('Error fetching books:', err);
        res.status(500).json({ error: 'Failed to fetch books' });
      });
});

// Handle sign-up request
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
  
    try {

        // Hashing  password
        const hashedPassword = await bcrypt.hash(password, 10);
  
        
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        await db.run(sql, [name, email, hashedPassword]);

        res.json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during sign-up:', err.message);
        if (err.code === 'SQLITE_CONSTRAINT') {
            res.status(409).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Database error' });
        }
    }
});


//handling login requests
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      
      const sql = 'SELECT * FROM users WHERE email = ?';
      const user = await db.get(sql, [email]);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Compare password with hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        
        req.session.user = {
          id: user.id,
          email: user.email,
          role: user.role
        };

        
        const isAdmin = user.role === 'admin';  

        
        return res.json({ message: 'Login successful', isAdmin });
      } else {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (err) {
      console.error('Error during login:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
});



// Middleware
function clientAuth(req, res, next) {
    if (req.session.user && req.session.user.role === 'user') {
        return next(); 
    }
    return res.status(403).json({ error: 'Forbidden' });
};


function adminAuth(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        return next(); 
    }
    return res.status(403).json({ error: 'Forbidden' });
};

// Client page route
app.get('/client', clientAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'clientIndex.html'));
});

// Admin page route
app.get('/admin', adminAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'adminIndex.html'));
});

// Search books 
app.get('/search-books', async (req, res) => {
    const query = req.query.query;

    try {
        const sql = `SELECT id, title FROM books WHERE title LIKE ?`;
        const books = await db.all(sql, [`%${query}%`]);

        if (books.length > 0) {
            res.json(books);
        } else {
            res.status(404).json({ message: 'No books found.' });
        }
    } catch (err) {
        console.error('Error searching for books:', err.message);
        res.status(500).json({ error: 'Database error' });
    }
});


// Reserve books 
app.post('/reserve-books', async (req, res) => {
    const { bookId, reservationDate } = req.body;
    const userId = req.session.user.id;  

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    console.log('Received data:', { bookId, reservationDate, userId });  

    try {
       
        const reservedBook = await db.get('SELECT * FROM reserved_books WHERE book_id = ?', [bookId]);

        if (reservedBook) {
            return res.status(400).json({ message: 'Book is already reserved' });
        }

        // week long return date 
        const returnDate = new Date(reservationDate);
        returnDate.setDate(returnDate.getDate() + 7);

       
        const sql = 'INSERT INTO reserved_books (book_id, user_id, reserved_date, return_date) VALUES (?, ?, ?, ?)';
        await db.run(sql, [bookId, userId, reservationDate, returnDate.toISOString().split('T')[0]]);

        return res.json({ message: 'Book reserved successfully' });
    } catch (error) {
        console.error('Error reserving book:', error);
        return res.status(500).json({ error: 'Database error' });
    }
});

//reserved books endpoint 
app.get('/api/reserved-books', async (req, res) => {
    const userId = req.session.user?.id;  

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    try {
        
        const sql = `
            SELECT b.title, r.reserved_date, r.return_date
            FROM reserved_books r
            JOIN books b ON r.book_id = b.id
            WHERE r.user_id = ?`;
        const reservedBooks = await db.all(sql, [userId]);

        return res.json(reservedBooks);  
    } catch (error) {
        console.error('Error fetching reserved books:', error);
        return res.status(500).json({ error: 'Database error' });
    }
});


// renewing a book
app.post('/renew-book', async (req, res) => {
    const { bookId, newReservationDate } = req.body;
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    console.log('Book ID:', bookId);
    console.log('User ID:', userId);

    try {
        const reservedBook = await db.get(
            'SELECT * FROM reserved_books WHERE book_id = ? AND user_id = ?', 
            [bookId, userId]
        );

        if (!reservedBook) {
            return res.status(400).json({ message: 'Book not reserved by this user' });
        }

        const sql = 'UPDATE reserved_books SET reserved_date = ? WHERE book_id = ? AND user_id = ?';
        await db.run(sql, [newReservationDate, bookId, userId]);

        return res.json({ message: 'Book renewed successfully' });
    } catch (error) {
        console.error('Error renewing book:', error);
        return res.status(500).json({ error: 'Database error' });
    }
});

//imposing fine
app.post('/api/impose_fine/:bookId', (req, res) => {
    const bookId = req.params.bookId;
    const { fine } = req.body;
  
    const getBookDataQuery = `
      SELECT rb.book_id, rb.user_id, rb.reserved_date, rb.return_date
      FROM reserved_books rb
      WHERE rb.book_id = ?;
    `;
  
    db.get(getBookDataQuery, [bookId], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: "No reserved book found for the given book ID" });
        return;
      }
  
      // Insert the fine information into the fines table
      const insertFineQuery = `
        INSERT INTO fines (book_id, user_id, reserved_date, return_date, fine_amount)
        VALUES (?, ?, ?, ?, ?);
      `;
  
      db.run(insertFineQuery, [row.book_id, row.user_id, row.reserved_date, row.return_date, fine], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ success: true, fine_id: this.lastID });
      });
    });
  });
  
  

// starting server
const PORT = process.env.PORT || 3000; 

app.listen(PORT, (err)=>{

    if (err){

        console.log(err);
    }else{

        console.log(`Server is running on port ${PORT}`);
    }
});