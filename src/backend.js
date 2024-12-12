const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
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
const verifyAdmin = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Permission denied. Admins only.' });
    }

    req.user = decoded;
    next();
  });
};

// Login API
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (bcrypt.compareSync(password, row.password)) {
      const token = jwt.sign({ username: row.username, role: row.role }, secretKey, { expiresIn: '1h' });
      res.status(200).json({
        message: 'Login successful',
        token,
        role: row.role // Ensure role is included in the response
      });
    } else {
      res.status(400).json({ message: 'Wrong password or username' });
    }
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
  db.all(
    'SELECT * FROM recipes WHERE category = ?',
    [category],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Unable to find recipe' });
      }
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

// Get recipe by ID
app.get('/recipes/:id', (req, res) => {
    const { id } = req.params;
    db.get(
      'SELECT * FROM recipes WHERE id = ?',
      [id],
      (err, row) => {
        if (err) {
          return res.status(500).json({ message: 'Unable to find recipe' });
        }
        if (!row) {
          return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(200).json(row);
      }
    );
  });
  

// Update a recipe (admin only)
app.put('/recipes/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { title, description, ingredients, instructions, category, image } = req.body;

  db.run(
    'UPDATE recipes SET title = ?, description = ?, ingredients = ?, instructions = ?, category = ?, image = ? WHERE id = ?',
    [title, description, ingredients, instructions, category, image, id],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating recipe' });
      }
      res.status(200).json({ message: 'Update successful' });
    }
  );
});

// Delete a recipe (admin only)
app.delete('/recipes/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM recipes WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Problem while deleting' });
    }
    res.status(200).json({ message: 'Recipe deleted successfully' });
  });
});
