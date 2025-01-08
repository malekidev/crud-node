const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
    return;
  }
  console.log("Connected to MySQL");
});

// CRUD Routes

// 1. افزودن بازی جدید
app.post("/games", (req, res) => {
  const { title, genre, releaseYear } = req.body;
  const sql = "INSERT INTO games (title, genre, releaseYear) VALUES (?, ?, ?)";
  db.query(sql, [title, genre, releaseYear], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, title, genre, releaseYear });
  });
});

// 2. دریافت لیست بازی‌ها
app.get("/games", (req, res) => {
  const sql = "SELECT * FROM games";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

// 3. ویرایش اطلاعات بازی
app.put("/games/:id", (req, res) => {
  const { id } = req.params;
  const { title, genre, releaseYear } = req.body;
  const sql = "UPDATE games SET title = ?, genre = ?, releaseYear = ? WHERE id = ?";
  db.query(sql, [title, genre, releaseYear, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.status(200).json({ message: "Game updated successfully" });
  });
});

// 4. حذف بازی
app.delete("/games/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM games WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.status(200).json({ message: "Game deleted successfully" });
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
