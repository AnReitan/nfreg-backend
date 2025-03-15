
require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const db = require('./config/db.js'); // Import db.js correctly

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: ["http://localhost:3000", 
          "https://nfreg-backend-1n1icp7zw-andre-reitans-projects.vercel.app/", 
          "https://anreitan.github.io/nfreg/"  // ✅ Add your GitHub Pages URL here"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Create a MySQL connection
const connection = mysql.createConnection(db);
console.log("DB config: ", db);

// Connect to MySQL (ONLY HERE)1
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    return;
  }
  console.log("Connected to the MySQL server.");
});




/// API enpoints ////

// API Endpoint to get users
app.get('/api/users', (req, res) => {
  db.query('SELECT p_key, s_name, i_userlevel FROM d_user', (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      res.status(500).json({ error: 'Database query error' });
      return;
    }
    res.json(results);
  });
});

// API Endpoint to get one user
app.get("/api/user/:userID", (req, res) => {
  const userID = req.params.userID; // Extract userID from URL
  console.log("Fetching user with ID:", userID); // Debugging

  const sql = "SELECT p_key, s_name, s_email, s_regno, i_userlevel, b_active FROM d_user WHERE p_key = ?";
  
  db.query(sql, [userID], (err, result) => {
      if (err) {
          console.error("Error fetching user:", err);
          return res.status(500).json({ error: "Database error" });
      }
      if (result.length === 0) {
          return res.status(404).json({ error: "User not found" }); // Handle no user found
      }
      console.log("User fetched:", result[0]); // Debugging
      res.json(result[0]); // Return first user object
  });
});




// UPDATE USERS AFTER EDITING

app.put('/api/user/:userID', (req, res) => {
  const { userID } = req.params;
  const { s_name, s_email, s_regno, i_userlevel, b_active } = req.body;

  // Prepare the SQL query to update the user data
  const query = `
      UPDATE d_user
      SET s_name = ?, s_email = ?, s_regno = ?, i_userlevel = ?, b_active = ?
      WHERE p_key = ?`;

  // Execute the query
  db.query(query, [s_name, s_email, s_regno, i_userlevel, b_active, userID], (err, result) => {
      if (err) {
          console.error("Error updating user:", err);
          return res.status(500).send('Error updating user');
      }
      res.status(200).send('User updated successfully');
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
