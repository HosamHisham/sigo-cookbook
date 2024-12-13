const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs'); // Ensure bcrypt is required
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();
const secretKey = 'secret'; // You should store this securely

app.use(bodyParser.json());
app.use(cors());

const db = new sqlite3.Database('./recipes.db');

// Serve static files from the current directory and uploads directory
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Server for hosting
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'index.html');  
    res.sendFile(filePath);
});

const hostname = '127.0.0.1';
const port = 5000;
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// Heartbeat to check server status
setInterval(() => {
    console.log('Heartbeat: Server is still running...');
}, 2500);

// Create the users table with the role column
const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'guest'
  );
`;

db.run(createUsersTableQuery, (err) => {
  if (err) {
    console.error("Error creating users table:", err.message);  
  } else {
    console.log("Users table created successfully");
  }
});

// Create the recipes table
const createRecipesTableQuery = `
  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT
  );
`;

db.run(createRecipesTableQuery, (err) => {
  if (err) {
    console.error("Error creating recipes table:", err.message);  
  } else {
    console.log("Recipes table created successfully");
  }
});

// Middleware to verify JWT and check admin role
// Middleware to verify JWT and check admin role
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token from the header
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error('Failed to authenticate token:', err.message);
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Permission denied. Admins only.' });
    }

    req.user = decoded;
    next();
  });
};

// Delete a recipe (admin only)
app.delete('/recipes/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to delete recipe with id: ${id}`); // Log the delete attempt
  db.run('DELETE FROM recipes WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Error while deleting recipe:', err.message);
      return res.status(500).json({ message: 'Problem while deleting', error: err.message });
    }
    res.status(200).json({ message: 'Recipe deleted successfully' });
  });
});


// Login API
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Received login request:', { username, password }); // Log the request
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.error('Error fetching user:', err.message);
      return res.status(500).json({ message: 'An error occurred during login' });
    }
    if (!user) {
      console.warn('User not found:', username);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare hashed password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err.message);
        return res.status(500).json({ message: 'An error occurred during login' });
      }
      if (!isMatch) {
        console.warn('Invalid password for user:', username);
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Generate a token (e.g., JWT)
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ token, user });
    });
  });
});


// Signup API
app.post('/signup', (req, res) => {
  const { username, password, role } = req.body;
  const userRole = role || 'guest';

  const hash = bcrypt.hashSync(password, 10);

  const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
  db.run(sql, [username, hash, userRole], function (err) {
    if (err) {
      console.error("Error signing up:", err.message);  
      return res.status(500).json({ message: 'Error in signing up', error: err.message }); // Include error message
    }
    res.status(201).json({ message: 'User created successfully' });
  });
});


// Get recipes by category
app.get('/recipes/:category', (req, res) => {
  const { category } = req.params;
  console.log('Received request for category:', category);  // Debug log

  db.all(
    'SELECT * FROM recipes WHERE category = ?',
    [category],
    (err, rows) => {
      if (err) {
        console.error('Error fetching recipes:', err.message);  // Log errors
        return res.status(500).json({ message: 'Unable to find recipe' });
      }

      console.log('Fetched recipes:', rows);  // Log the recipes found
      res.status(200).json(rows);
    }
  );
});


// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Save files with a unique name
  }
});

const upload = multer({ storage: storage });

// Create a new recipe (admin only) with debug logging
app.post('/recipes', verifyAdmin, upload.single('image'), (req, res) => {
  const { title, description, ingredients, instructions, category } = req.body;
  const image = req.file ? req.file.path.replace(/\\/g, '/') : null;

  console.log("Received data:", { title, description, ingredients, instructions, category, image }); // Debug log

  db.run(
    'INSERT INTO recipes (title, description, ingredients, instructions, category, image) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description, ingredients, instructions, category, image],
    function (err) {
      if (err) {
        console.error("Error while adding recipe:", err.message); // Detailed error log
        return res.status(500).json({ message: 'Problem while adding recipe', error: err.message });
      }
      res.status(201).json({ message: 'Recipe added successfully' });
    }
  );
});

// Fetch a recipe by ID
app.get('/recipe/:id', (req, res) => {
  const recipeId = req.params.id;

  console.log('Fetching recipe with ID:', recipeId);

  db.get('SELECT * FROM recipes WHERE id = ?', [recipeId], (err, row) => {
    if (err) {
      console.error('Database query failed:', err);
      return res.status(500).json({ error: 'Error fetching recipe from database' });
    }

    if (!row) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(row); // Send the found recipe as the response
  });
});



// Update a recipe (admin only)
app.put('/recipes/:id', verifyAdmin, upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, description, ingredients, instructions, category } = req.body;
  const image = req.file ? req.file.path.replace(/\\/g, '/') : null;

  db.run(
    'UPDATE recipes SET title = ?, description = ?, ingredients = ?, instructions = ?, category = ?, image = ? WHERE id = ?',
    [title, description, ingredients, instructions, category, image, id],
    function (err) {
      if (err) {
        console.error('Error while updating recipe:', err.message); // Detailed error log
        return res.status(500).json({ message: 'Error updating recipe', error: err.message });
      }
      res.status(200).json({ message: 'Update successful' });
    }
  );
});

// Serve static files from the current directory and uploads directory
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




